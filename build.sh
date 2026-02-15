#!/bin/bash
set -e

# Fetch latest posts from Bluesky and convert JSON to YAML
echo "Fetching posts from Bluesky..."
MAX_POSTS=5
curl -sS -H "Accept: application/json" "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=theoutdoorprogrammer.com&limit=$MAX_POSTS" | \
  ruby -rjson -ryaml -e 'puts JSON.parse(STDIN.read).to_yaml' > _data/posts.yml

# Ensure gems are installed (Cloudflare build images don't include project gems by default)
echo "Installing Ruby gems..."
bundle check || bundle install --jobs 4 --retry 3

# Build Jekyll site
echo "Building Jekyll site..."
JEKYLL_ENV=production bundle exec jekyll build

echo "Build complete! Output in _site directory"
