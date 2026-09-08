# The Outdoor Programmer

Personal site built with Jekyll, originally based on Linkhub.

See this on apollorion.com and theoutdoorprogrammer.com

Run `npm ci` and `npm run build` to bundle browser telemetry and build Jekyll. Cloudflare's `build.sh` runs the same telemetry step before its Jekyll build.

The shared Faro package comes from an immutable Dusk release and is bundled locally into `/assets/telemetry.js`, loaded before application startup. Uncaught errors and rejected promises include the Git revision. Only known routes and public asset names are exported; exception messages, query strings, console output, and session replay are excluded.
