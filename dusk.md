---
dusk: v1alpha1
namespace: stout
kind: repository
name: profile
title: Profile
attributes:
  generator: jekyll
  hosting: cloudflare
  url: https://www.theoutdoorprogrammer.com
  public: true
---

Personal site and blog, a Jekyll build served from Cloudflare.
It started as `linkhub-jekyll-theme` and has diverged far enough that the upstream README no longer describes anything here.

`index.html` is the link-hub landing page, `blog/_posts/` holds the posts, and one-off pages like `solar/` are hand-written HTML that Jekyll passes through untouched.
The site's shape lives in `_layouts/` and `_includes/` rather than in any theme gem.
`wrangler.jsonc` points Cloudflare at the built `_site` directory and nothing else: there is no Worker script, only static assets.

`build.sh` does two unrelated jobs and picks between them on the `IS_CLOUDFLARE_PAGES` environment variable.
Off Cloudflare, which in practice means the `update-bluesky-posts` GitHub Actions workflow, it pulls the Bluesky feed and the YouTube channel feed and rewrites `_data/`.
On Cloudflare it installs gems and runs `jekyll build`.
So the data files are refreshed by CI and committed to the repository, and the deploy only ever builds what is already there.

## Gotchas

**`_data/posts.yml` and `_data/videos.yml` are generated.**
Hand-edits to either are clobbered by the next sync.
Videos on other people's channels belong in `_data/external_videos.yml`, which is hand-maintained and never touched by the sync.
The homepage merges both lists and sorts by date.

**The video sync can silently lose entries.**
YouTube drops Shorts from the channel feed unpredictably, so the workflow reverts `videos.yml` when a run produces removals and no additions.

**Post front matter is load-bearing.**
`layout`, `description`, `icon` and `tags` all feed the blog cards and the OG and Twitter meta tags, and a post missing them renders wrong rather than failing.
The conventions are written down in `AGENTS.md`.
