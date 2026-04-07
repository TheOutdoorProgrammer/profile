---
title: "Building My Homelab Kubernetes Cluster"
date: 2026-02-04
description: "How I moved all my self-hosted services to a homelab K8s cluster running on bare metal."
image: /assets/images/blogposts/2026-02-04-homelab-title.png
tags: [kubernetes, homelab, devops]
layout: post
---

I recently moved all my stuff to a homelab cluster — here's how that went and what I learned along the way.

## Why Homelab?

After years of running services across various cloud providers, I decided it was time to bring everything home. The benefits were clear:

- **Cost savings** — no more monthly cloud bills for personal projects
- **Learning** — nothing teaches you Kubernetes like running it yourself
- **Full control** — my hardware, my rules, my data

## The Hardware

I went with a modest but capable setup:

- 3x Intel NUCs (i5, 32GB RAM each)
- A managed switch with VLAN support
- A Firewalla Gold Pro for network security (yes, [I unboxed it on YouTube](https://www.youtube.com/watch?v=RFDbEWgB8m4))

## Software Stack

```yaml
# The core components
cluster:
  orchestration: k3s
  gitops: ArgoCD
  ingress: Traefik
  storage: Longhorn
  monitoring: Prometheus + Grafana
  secrets: SOPS + Age
```

## Lessons Learned

1. **Storage is the hardest part** — distributed storage on bare metal is no joke. Longhorn saved me, but I had to learn the hard way that not all SSDs are created equal.

2. **DNS matters more than you think** — split-horizon DNS with Pi-hole took a few iterations to get right.

3. **Backups are non‑negotiable** — a firmware update bricked one of my NUCs. Velero turned that from a panic into a restore job.

## What's Next

I want to add GPU passthrough for some local LLM work and a bit of fun “overkill homelab” experimentation.

If you're thinking about building your own homelab cluster, honestly: go for it. The learning experience alone is worth it.
