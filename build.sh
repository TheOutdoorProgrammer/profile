#!/bin/bash
set -e

# Fetch latest posts from Bluesky and convert JSON to YAML
echo "Fetching posts from Bluesky..."
MAX_POSTS=5
# Cloudflare may run with US-ASCII locale; force UTF-8 so emoji bytes parse correctly.
LANG=C.UTF-8 LC_ALL=C.UTF-8 curl -sS -H "Accept: application/json" "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=theoutdoorprogrammer.com&limit=$MAX_POSTS" | \
ruby -E UTF-8:UTF-8 -rjson -ryaml -e 'input = STDIN.read.force_encoding("UTF-8").encode("UTF-8", invalid: :replace, undef: :replace); puts JSON.parse(input).to_yaml' > _data/posts.yml

# Ensure gems are installed (Cloudflare build images don't include project gems by default)
echo "Installing Ruby gems..."
bundle check || bundle install --jobs 4 --retry 3

# Build Jekyll site
echo "Building Jekyll site..."
JEKYLL_ENV=production bundle exec jekyll build

echo "Build complete! Output in _site directory"
