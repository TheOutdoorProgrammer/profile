#!/bin/bash
set -e

# Fetch latest posts from Bluesky
echo "Fetching posts from Bluesky..."
MAX_POSTS=5
curl -sS -H "Accept: application/json" "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=theoutdoorprogrammer.com&limit=$MAX_POSTS" | yq -P > _data/posts.yml

# Build Jekyll site
echo "Building Jekyll site..."
JEKYLL_ENV=production bundle exec jekyll build

echo "Build complete! Output in _site directory"
