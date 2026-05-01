---
layout: post
title: "Bridging mDNS Across OrbStack and Your LAN: A Home Assistant Discovery Fix"
date: 2026-05-01 18:00:00 -0400
description: "How I got Home Assistant running in Kubernetes on OrbStack to discover Apple TVs, Hue bridges, and other LAN devices by building a bidirectional mDNS reflector with macOS-native tools."
categories: [homelab, kubernetes]
icon: "twemoji:house-with-garden"
---

## The Problem

Home Assistant's auto-discovery is one of its killer features. Plug in a Hue bridge, power on an Apple TV, add a smart plug — and HA finds them without any manual configuration. It all works beautifully as long as HA and your devices share the same network segment.

Then you throw Kubernetes into the mix on OrbStack and everything breaks.

OrbStack creates a virtual bridge network (typically `bridge100` in the `192.168.139.x` range) that's completely isolated from your physical LAN (`192.168.1.x` or `192.168.x.x` depending on your router). Your Mac sits on both networks, but the mDNS multicast that makes zero-config discovery work doesn't cross between them.

The result: Home Assistant (running inside an OrbStack pod) can see exactly nothing on the LAN. No Hue bridges. No Apple TVs. No Sonos speakers. Meanwhile, devices on the LAN can't discover HA's API either.

## Why mDNS Is the Culprit

mDNS (Multicast DNS) is the backbone of zero-config device discovery. When an Apple TV wants to advertise itself, it sends a multicast UDP packet to `224.0.0.251:5353`. Any device on the same network segment listening on that address gets the announcement. No DNS server, no configuration — just multicast.

The problem is that multicast doesn't route. **224.0.0.251 never leaves the subnet it originated from.** Since OrbStack's virtual network and your physical LAN are separate subnets with a bridge between them (rather than a router, but the effect is the same for multicast), the mDNS packets never make the crossing.

This is a known limitation: OrbStack's `hostNetwork: true` option binds pods to the virtual bridge interface rather than the physical Ethernet interface. There's an open issue ([orbstack/orbstack#1691](https://github.com/orbstack/orbstack/issues/1691)) tracking this exact problem.

## The Network Topology

Here's what we're working with:

```
┌─────────────────────────────────┬─────────────────────────────────┐
│         Physical LAN             │     OrbStack Virtual Network    │
│    (192.168.1.x / 192.168.x.x)   │       (192.168.139.x)           │
│                                 │                                 │
│  🍎 Apple TV                    │                                 │
│  💡 Hue Bridge                  │     [HA Pod]                    │
│  🔊 Sonos Speaker               │     bridge100:8123              │
│  🏠 Home Assistant API           │                                 │
│                                 │                                 │
│         router (gateway)        │                                 │
└─────────────────────────────────┴─────────────────────────────────┘
                │                              │
                │                              │
           [Mac Mini / MacBook]           bridge100
           en0 (physical)               (OrbStack)
           sits on both              isolated virtual net
           networks
```

The Mac itself is on both networks. Its `mDNSResponder` process (the macOS mDNS daemon) responds to queries on every interface, which is the key to the solution.

## The Solution: A Bidirectional mDNS Reflector

Since the Mac sits on both networks and its `mDNSResponder` already works across all interfaces, we can use it as a relay. The idea:

1. Browse for mDNS services on each interface using macOS's built-in `dns-sd` command (no sudo needed)
2. Detect which services are *only* on the OrbStack side and proxy them to the LAN
3. Detect which services are *only* on the LAN side and proxy them into OrbStack so HA can discover them
4. Use `dns-sd -P` to register proxy service records — these get picked up by `mDNSResponder` and become visible on *all* interfaces, including `bridge100`

This is bidirectional by design: devices in OrbStack need to advertise to the LAN (e.g. Homebridge), and LAN devices need to be discoverable from within OrbStack (e.g. Hue, Apple TV).

## Key Configuration: Home Assistant Pod

Before the script will help, HA itself needs to be configured to operate correctly in this dual-network environment. Two critical settings in the pod spec:

```yaml
spec:
  template:
    spec:
      hostNetwork: true        # Bind to host's network namespace (bridge100)
      dnsPolicy: ClusterFirstWithHostNet  # Use host DNS, not cluster DNS
```

If you're using Helm, patch the HelmRelease with kubectl:

```bash
# Patch hostNetwork
kubectl patch helmrelease home-assistant -n home-assistant \
  --type=merge \
  -p '{"spec":{"template":{"spec":{"hostNetwork":true}}}}'

# Patch dnsPolicy
kubectl patch helmrelease home-assistant -n home-assistant \
  --type=merge \
  -p '{"spec":{"template":{"spec":{"dnsPolicy":"ClusterFirstWithHostNet"}}}}'
```

**Note:** `hostNetwork: true` causes port conflicts if you have other pods trying to bind the same ports. Home Assistant needs ports `8123` (API) and potentially `4357` (MQTT) — keep those reserved exclusively for HA.

## The Script

The reflector is a Python script that runs as a background process on macOS (no LaunchDaemon or systemd needed — just `launchctl` or `brew services` if you want it managed). It uses `dns-sd -B` to browse services, `dns-sd -L` to look up details, and `dns-sd -P` to register proxy records. No external Python packages required — just the standard library.

### How It Works

1. **Service discovery:** Every `CHECK_INTERVAL` seconds, it runs `dns-sd -B _services._dns-sd._udp local.` — the mDNS meta-query that returns *all* service types registered on the network. This means it automatically picks up new device types without hardcoding them.

2. **Interface-aware browsing:** For each service type, it browses and tracks which interface index each instance appeared on. In macOS, interface indices below 20 are typically physical interfaces (en0, en1) and indices 20+ are virtual (bridge100, utun, etc.) — this gives us a reliable way to separate LAN vs. OrbStack services without knowing interface names in advance.

3. **Bidirectional proxying:**
   - **OrbStack → LAN:** Services discovered only on high-numbered interfaces (OrbStack side) get registered as `dns-sd -P` records pointing at the Mac's LAN IP. The Mac's `mDNSResponder` then advertises them on the physical LAN.
   - **LAN → OrbStack:** Services discovered only on low-numbered interfaces (physical LAN) get registered with `dns-sd -P` pointing at their actual IP. This makes them visible to the OrbStack interface, and therefore to HA.

4. **Hostname translation:** HA typically has device configs using hostnames like `apple-tv.local` (mDNS names). The script resolves the `.local` hostname to an IP and re-registers it under the network's actual domain (e.g. `apple-tv.home.lan`), so HA can resolve and connect.

5. **Self-discovery blocklist:** The script blacklists `_home-assistant._tcp` so HA doesn't discover itself through the reflector. You can expand the blocklist for other services.

### Full Script

```python
#!/usr/bin/env python3
"""
OrbStack mDNS Bidirectional Reflector

Bridges mDNS between OrbStack's virtual network and the physical LAN.

1. Proxies OrbStack-only services TO the LAN (e.g. Homebridge)
2. Proxies LAN-only services TO OrbStack (e.g. Apple TVs, Hue) so HA can discover them
3. Keeps Mac's mDNS cache warm by browsing all service types

Uses macOS-native dns-sd commands (no sudo needed).
"""

import subprocess
import signal
import sys
import time
import re
import os
import logging

# --- Configuration ---
# Set these environment variables before running, or change defaults below.
# LAN_IP: the Mac's IP address on the physical LAN
LAN_IP = os.environ.get("LAN_IP", "192.168.1.100")
# PROXY_HOST: the hostname the Mac uses when proxying OrbStack-side services to LAN
PROXY_HOST = os.environ.get("PROXY_HOST", "mini-mac.local")
# ORB_INTERFACE: the OrbStack bridge interface name (usually bridge100)
ORB_INTERFACE = os.environ.get("ORB_INTERFACE", "bridge100")
# CHECK_INTERVAL: seconds between full service scans
CHECK_INTERVAL = int(os.environ.get("CHECK_INTERVAL", "30"))
# NETWORK_DOMAIN: your LAN's domain (for translating .local hostnames)
NETWORK_DOMAIN = os.environ.get("NETWORK_DOMAIN", "home.lan")

# Service types to NEVER proxy (prevent HA discovering itself, etc.)
PROXY_BLACKLIST = {
    "_home-assistant._tcp",
}

# Instance names to never proxy (the Mac itself, shared devices, etc.)
INSTANCE_BLACKLIST = {
    "MacBook-Pro",
    "MacBook-Air",
    "mini-mac",
}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger("mdns-reflector")

# Track active proxies: {key: {"proc": Popen, "details": str}}
# key format: "direction:service_type:instance_name"
active_proxies = {}


def discover_all_service_types():
    """Discover all mDNS service types on the network using meta-query."""
    try:
        proc = subprocess.Popen(
            ["dns-sd", "-B", "_services._dns-sd._udp", "local."],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
        )
        time.sleep(5)
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            proc.kill()

        output = proc.stdout.read()
        service_types = set()

        for line in output.splitlines():
            if "Add" not in line:
                continue
            parts = line.split()
            if len(parts) < 7:
                continue
            instance = parts[6] if len(parts) > 6 else ""
            domain = parts[5] if len(parts) > 5 else ""
            proto = domain.split(".")[0] if domain else ""
            if instance and proto:
                service_type = f"{instance}.{proto}"
                service_types.add(service_type)

        return service_types
    except Exception as e:
        log.error(f"Failed to discover service types: {e}")
        return set()


def browse_services(service_type):
    """Browse for services and return {interface_index: [service_names]}."""
    try:
        proc = subprocess.Popen(
            ["dns-sd", "-B", service_type],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
        )
        time.sleep(4)
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            proc.kill()

        output = proc.stdout.read()
        services_by_if = {}

        for line in output.splitlines():
            if "Add" not in line:
                continue
            parts = line.split()
            if len(parts) < 7:
                continue

            try:
                if_index = int(parts[3])
            except ValueError:
                continue

            instance_name = " ".join(parts[6:]).strip()

            if if_index not in services_by_if:
                services_by_if[if_index] = set()
            services_by_if[if_index].add(instance_name)

        return services_by_if
    except Exception as e:
        log.error(f"Browse failed for {service_type}: {e}")
        return {}


def lookup_service(name, service_type):
    """Look up service details (host, port, IP, and TXT records)."""
    try:
        proc = subprocess.Popen(
            ["dns-sd", "-L", name, service_type, "local"],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
        )
        time.sleep(4)
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            proc.kill()

        output = proc.stdout.read()
        port = None
        hostname = None
        txt_records = []

        for line in output.splitlines():
            if "can be reached at" in line:
                match = re.search(r"at\s+(\S+):(\d+)\s+\(interface", line)
                if match:
                    hostname = match.group(1)
                    port = int(match.group(2))
            elif line.startswith(" "):
                txt_line = line.strip()
                if txt_line:
                    for part in re.findall(r'\S+=\S+', txt_line):
                        txt_records.append(part)

        return hostname, port, txt_records
    except Exception as e:
        log.error(f"Lookup failed for {name}: {e}")
        return None, None, []


def local_to_network_hostname(hostname):
    """Convert a .local mDNS hostname to the network domain."""
    if not hostname:
        return None
    hostname = hostname.rstrip(".")
    if hostname.endswith(".local"):
        base = hostname[:-6]
        return f"{base}.{NETWORK_DOMAIN}"
    return hostname


def resolve_hostname(hostname):
    """Resolve a .local hostname to an IP address."""
    if not hostname:
        return None
    try:
        proc = subprocess.Popen(
            ["dns-sd", "-G", "v4", hostname],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
        )
        time.sleep(3)
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            proc.kill()

        output = proc.stdout.read()
        for line in output.splitlines():
            if "Add" in line:
                parts = line.split()
                for part in reversed(parts):
                    if re.match(r'\d+\.\d+\.\d+\.\d+', part):
                        return part
        return None
    except Exception:
        return None


def start_proxy(name, service_type, port, hostname, ip_addr, txt_records):
    """Start a dns-sd -P proxy for a service."""
    if not hostname:
        hostname = PROXY_HOST
    if not ip_addr:
        ip_addr = LAN_IP

    cmd = [
        "dns-sd", "-P", name, service_type, "local",
        str(port), hostname, ip_addr,
    ] + txt_records

    proc = subprocess.Popen(
        cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    log.info(f"Proxy PID {proc.pid}: {name} ({service_type} port {port} -> {ip_addr})")
    return proc


def stop_proxy(key):
    """Stop a proxy by key."""
    if key in active_proxies:
        pid = active_proxies[key]["proc"].pid
        active_proxies[key]["proc"].terminate()
        try:
            active_proxies[key]["proc"].wait(timeout=5)
        except subprocess.TimeoutExpired:
            active_proxies[key]["proc"].kill()
        del active_proxies[key]
        log.info(f"Stopped proxy PID {pid} for: {key}")


def cleanup(signum=None, frame=None):
    """Clean up all proxies on exit."""
    log.info("Shutting down, cleaning up proxies...")
    for key in list(active_proxies.keys()):
        stop_proxy(key)
    sys.exit(0)


def find_orb_only_services(services_by_if):
    """Find services that ONLY exist on OrbStack (high-numbered) interfaces."""
    if not services_by_if:
        return set()

    low_ifs = {k for k in services_by_if if k < 20}
    high_ifs = {k for k in services_by_if if k >= 20}

    if not high_ifs:
        return set()

    physical_services = set()
    for if_idx in low_ifs:
        physical_services.update(services_by_if[if_idx])

    orb_only = set()
    for if_idx in high_ifs:
        for svc in services_by_if[if_idx]:
            if svc not in physical_services:
                orb_only.add(svc)

    return orb_only


def find_lan_only_services(services_by_if):
    """Find services that ONLY exist on physical LAN (low-numbered) interfaces.
    These need to be proxied so OrbStack/HA can discover them."""
    if not services_by_if:
        return set()

    low_ifs = {k for k in services_by_if if k < 20}
    high_ifs = {k for k in services_by_if if k >= 20}

    if not low_ifs:
        return set()

    orb_services = set()
    for if_idx in high_ifs:
        orb_services.update(services_by_if[if_idx])

    lan_only = set()
    for if_idx in low_ifs:
        for svc in services_by_if[if_idx]:
            if svc not in orb_services:
                lan_only.add(svc)

    return lan_only


def main():
    signal.signal(signal.SIGTERM, cleanup)
    signal.signal(signal.SIGINT, cleanup)

    log.info("OrbStack mDNS Bidirectional Reflector starting")
    log.info(f"  LAN IP: {LAN_IP}")
    log.info(f"  Proxy host: {PROXY_HOST}")
    log.info(f"  Orb interface: {ORB_INTERFACE}")
    log.info(f"  Check interval: {CHECK_INTERVAL}s")
    log.info(f"  Network domain: {NETWORK_DOMAIN}")
    log.info(f"  Proxy blacklist: {PROXY_BLACKLIST}")
    log.info(f"  Instance blacklist: {INSTANCE_BLACKLIST}")

    while True:
        try:
            all_types = discover_all_service_types()
            if all_types:
                log.info(f"Discovered {len(all_types)} service types")

            for service_type in all_types:
                if service_type in PROXY_BLACKLIST:
                    continue

                services_by_if = browse_services(service_type)
                if not services_by_if:
                    continue

                # Direction 1: OrbStack → LAN (advertise OrbStack services on physical LAN)
                orb_only = find_orb_only_services(services_by_if)
                for svc_name in orb_only:
                    if svc_name in INSTANCE_BLACKLIST:
                        continue
                    key = f"orb2lan:{service_type}:{svc_name}"

                    if key in active_proxies:
                        if active_proxies[key]["proc"].poll() is None:
                            continue
                        stop_proxy(key)

                    hostname, port, txt_records = lookup_service(svc_name, service_type)
                    if port is None:
                        continue

                    proc = start_proxy(svc_name, service_type, port, PROXY_HOST, LAN_IP, txt_records)
                    active_proxies[key] = {"proc": proc, "details": f"{port}"}

                # Direction 2: LAN → OrbStack (make LAN devices discoverable from OrbStack)
                lan_only = find_lan_only_services(services_by_if)
                for svc_name in lan_only:
                    if svc_name in INSTANCE_BLACKLIST:
                        continue
                    key = f"lan2orb:{service_type}:{svc_name}"

                    if key in active_proxies:
                        if active_proxies[key]["proc"].poll() is None:
                            continue
                        stop_proxy(key)

                    hostname, port, txt_records = lookup_service(svc_name, service_type)
                    if port is None:
                        continue

                    device_ip = resolve_hostname(hostname)
                    if not device_ip:
                        continue

                    network_hostname = local_to_network_hostname(hostname)
                    proc = start_proxy(svc_name, service_type, port, network_hostname, device_ip, txt_records)
                    active_proxies[key] = {"proc": proc, "details": f"{port}:{device_ip}"}

            # Clean up dead proxies
            for key in list(active_proxies.keys()):
                if active_proxies[key]["proc"].poll() is not None:
                    del active_proxies[key]

        except Exception as e:
            log.error(f"Error in main loop: {e}")

        time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()
```

### Configuration

Set these environment variables (or edit the defaults at the top of the script):

| Variable | Default | Description |
|---|---|---|
| `LAN_IP` | `192.168.1.100` | Your Mac's IP on the physical LAN |
| `PROXY_HOST` | `mini-mac.local` | Hostname to advertise for OrbStack-side services on the LAN |
| `ORB_INTERFACE` | `bridge100` | OrbStack bridge interface name |
| `CHECK_INTERVAL` | `30` | Seconds between full network scans |
| `NETWORK_DOMAIN` | `home.lan` | Your LAN's domain (for `.local` hostname translation) |

### Running It

Make it executable and run it in the background:

```bash
chmod +x orbstack-mdns-reflector.py

LAN_IP=$(ipconfig getifaddr en0) ./orbstack-mdns-reflector.py
```

Or with explicit environment variables:

```bash
LAN_IP=192.168.1.100 \
PROXY_HOST=mini-mac.local \
NETWORK_DOMAIN=home.lan \
./orbstack-mdns-reflector.py
```

To have it start automatically on login, add it to your shell profile or use launchd. A simple plist in `~/Library/LaunchAgents/` works well:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.user.orbstack-mdns-reflector</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/youruser/bin/orbstack-mdns-reflector.py</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>LAN_IP</key>
        <string>192.168.1.100</string>
        <key>PROXY_HOST</key>
        <string>mini-mac.local</string>
        <key>NETWORK_DOMAIN</key>
        <string>home.lan</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

Then load it:
```bash
launchctl load ~/Library/LaunchAgents/com.user.orbstack-mdns-reflector.plist
```

## How HA Sees the Proxied Services

After the reflector starts, HA's integration discovery panel will find devices on the physical LAN. A few things to keep in mind:

**Hostname matching:** If you already have device entries in `configuration.yaml` using `.local` hostnames, you'll want to update them to use the `NETWORK_DOMAIN` hostnames (e.g., `apple-tv.home.lan` instead of `apple-tv.local`), or set up a local DNS resolver that handles both. The script translates `.local` to your network domain so the names will be consistent once you configure HA to use the translated names.

**TXT record preservation:** The script passes along TXT records (used by things like HomeKit compatibility, Hue discovery, etc.) via `dns-sd -P`. Most services should work without additional configuration.

**Device persistence:** The reflector re-registers proxy records every `CHECK_INTERVAL` seconds. This is fine for discovery — HA will find devices each time it scans. For long-running operations (like media playback), the connection is direct IP-to-IP once discovery is done, so the reflector isn't in the data path.

## Why Not Just Use `hostNetwork: false`?

You might wonder why we don't just run HA without `hostNetwork: true` and let it live entirely inside OrbStack's network. The problem is that OrbStack's DNS doesn't resolve LAN hostnames. Even if we configured cluster DNS to forward `.lan` queries, mDNS multicast still wouldn't work — the underlying issue is the network isolation, not DNS.

By keeping `hostNetwork: true` and `dnsPolicy: ClusterFirstWithHostNet`, HA gets the OrbStack IP (for cluster communication) but also inherits the host's full network stack including `mDNSResponder` visibility. The reflector then fills in the gaps that multicast alone can't bridge.

## Wrapping Up

This approach leans entirely on macOS-native tools — `dns-sd` is the same utility that `discoveryd` and other system services use. No kernel extensions, no sudo, no third-party daemons. The script just sits there, quietly proxying mDNS between the two network segments every 30 seconds.

The whole thing is about 250 lines of Python, most of which is defensive error handling and logging. If OrbStack ever fixes [issue #1691](https://github.com/orbstack/orbstack/issues/1691) so `hostNetwork: true` binds to the physical interface, this script becomes unnecessary. Until then, it bridges the gap.
