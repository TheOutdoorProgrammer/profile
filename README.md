# The Outdoor Programmer

Personal site built with Jekyll, originally based on Linkhub.

See this on apollorion.com and theoutdoorprogrammer.com

Run `npm ci` and `npm run build` to bundle browser telemetry and build Jekyll. Cloudflare's `build.sh` runs the same telemetry step before its Jekyll build.

The shared Faro package comes from an immutable Dusk release and is bundled locally into `/assets/telemetry.js`, loaded before application startup. Uncaught errors and rejected promises include the Git revision. Only known routes and public asset names are exported; exception messages, query strings, console output, and session replay are excluded.

## Philosophies

`/philosophies/` contains complete initial HTML from the [canonical NWF philosophies](https://github.com/NerdsWhoFish/philosophies), with a self-referencing canonical URL and ordinary headings and links. The asset build combines `_includes/philosophies-page.html` with the verified `philosophies.json` mirror before Jekyll runs. Run `npm run build`, not a bare Jekyll build, when preparing publication.

The hourly `sync-philosophies` workflow commits only verified, already reviewed canonical content and lets the existing Cloudflare integration rebuild the site. The browser can refresh the text between deployments and retains the full static document if GitHub is unavailable. Rendering code remains pinned; code changes need independent human review. Propose wording changes upstream, never in generated content. GitHub schedules, caches, and deployment queues can delay propagation; investigate failed Actions runs.
