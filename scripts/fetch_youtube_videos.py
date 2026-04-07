#!/usr/bin/env python3
"""
Fetch latest YouTube videos and Shorts from a channel and save to _data/videos.yml

Usage:
    python3 scripts/fetch_youtube_videos.py

Environment variables:
    YOUTUBE_API_KEY   - YouTube Data API v3 key (required)
    YOUTUBE_CHANNEL_ID - Channel ID (defaults to Joey's channel)
    MAX_VIDEOS        - Max regular videos to fetch (default: 10)
    MAX_SHORTS        - Max shorts to fetch (default: 10)
    OUTPUT_FILE       - Output YAML file (default: _data/videos.yml)
"""

import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


def get_json(url):
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"HTTP {e.code} for URL: {url}\n{body}", file=sys.stderr)
        raise


def duration_seconds(iso):
    """Convert YouTube ISO 8601 duration to seconds."""
    m = re.match(r"^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$", iso or "")
    if not m:
        return 0
    h = int(m.group(1) or 0)
    mi = int(m.group(2) or 0)
    s = int(m.group(3) or 0)
    return h * 3600 + mi * 60 + s


def yq(s):
    """Single-quote a value for YAML scalar."""
    escaped = str(s).replace("'", "''")
    return f"'{escaped}'"


def fetch_youtube_videos(
    api_key: str,
    channel_id: str,
    max_videos: int = 10,
    max_shorts: int = 10,
    max_results: int = 50,
) -> dict:
    """
    Fetch recent videos and shorts from a YouTube channel.
    Returns a dict with 'videos' list containing video entries.
    """

    # Build short/video map from channel RSS (reliable for Shorts detection)
    rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    rss_xml = urllib.request.urlopen(rss_url, timeout=30).read().decode("utf-8", errors="replace")
    root = ET.fromstring(rss_xml)
    ns = {
        "atom": "http://www.w3.org/2005/Atom",
        "yt": "http://www.youtube.com/xml/schemas/2015",
    }
    short_by_id = {}
    for entry in root.findall("atom:entry", ns):
        vid_el = entry.find("yt:videoId", ns)
        if vid_el is None or not vid_el.text:
            continue
        href = ""
        for link in entry.findall("atom:link", ns):
            if link.attrib.get("rel") == "alternate":
                href = link.attrib.get("href", "")
                break
        short_by_id[vid_el.text] = "/shorts/" in href

    # Pull recent channel uploads
    search_qs = urllib.parse.urlencode({
        "part": "snippet",
        "channelId": channel_id,
        "order": "date",
        "type": "video",
        "maxResults": max_results,
        "key": api_key,
    })
    search = get_json(f"https://www.googleapis.com/youtube/v3/search?{search_qs}")

    candidates = []
    ids = []
    for item in search.get("items", []):
        vid = item.get("id", {}).get("videoId")
        snippet = item.get("snippet", {})
        if not vid:
            continue
        title = snippet.get("title", "")
        published_at = snippet.get("publishedAt", "")
        live_flag = snippet.get("liveBroadcastContent", "none")
        candidates.append({
            "id": vid,
            "title": title,
            "publishedAt": published_at,
            "liveFlag": live_flag,
        })
        ids.append(vid)

    # Fetch durations and liveStreamingDetails in batches
    details_by_id = {}
    for i in range(0, len(ids), 50):
        batch = ids[i:i+50]
        videos_qs = urllib.parse.urlencode({
            "part": "contentDetails,liveStreamingDetails",
            "id": ",".join(batch),
            "maxResults": 50,
            "key": api_key,
        })
        videos = get_json(f"https://www.googleapis.com/youtube/v3/videos?{videos_qs}")
        for it in videos.get("items", []):
            details_by_id[it["id"]] = it

    shorts, videos = [], []
    for c in candidates:
        meta = details_by_id.get(c["id"], {})
        has_live_details = "liveStreamingDetails" in meta

        # Exclude live/stream content
        if c["liveFlag"] != "none" or has_live_details:
            continue

        # Get description from snippet (already fetched in search)
        snippet = meta.get("snippet", {})
        description = c.get("title", "")  # fallback to title
        # Try to get description from video details if available
        desc_from_meta = snippet.get("description", "")
        if desc_from_meta:
            description = desc_from_meta

        published_at = c.get("publishedAt", "")
        # Format date as YYYY-MM-DD
        date_str = ""
        if published_at:
            # Input: 2026-03-15T10:30:00Z
            # Output: 2026-03-15
            date_str = published_at[:10]

        item = {
            "id": c["id"],
            "title": c["title"],
            "date": date_str,
            "description": description,
        }
        is_short = short_by_id.get(c["id"], False)
        if is_short:
            item["type"] = "short"
            if len(shorts) < max_shorts:
                shorts.append(item)
        else:
            item["type"] = "video"
            if len(videos) < max_videos:
                videos.append(item)

        if len(shorts) >= max_shorts and len(videos) >= max_videos:
            break

    return {"videos": videos + shorts}


def write_videos_yaml(data: dict, output_path: str):
    """Write video data to a YAML file."""
    lines = ["---", "videos:"]
    for v in data["videos"]:
        lines.append(f"- id: {v['id']}")
        lines.append(f"  title: {yq(v['title'])}")
        if v.get("date"):
            lines.append(f"  date: {v['date']}")
        if v.get("description"):
            lines.append(f"  description: {yq(v['description'])}")
        lines.append(f"  type: {v['type']}")

    Path(output_path).write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(data['videos'])} videos to {output_path}")


def main():
    api_key = os.environ.get("YOUTUBE_API_KEY", "").strip()
    channel_id = os.environ.get("YOUTUBE_CHANNEL_ID", "").strip() or "UC_qK4g_mSlBNZ6Ht5adZ5zw"
    max_videos = int(os.environ.get("MAX_VIDEOS", "10"))
    max_shorts = int(os.environ.get("MAX_SHORTS", "10"))
    output_file = os.environ.get("OUTPUT_FILE", "_data/videos.yml")

    if not api_key:
        print("Error: YOUTUBE_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)

    print(f"Fetching up to {max_videos} videos and {max_shorts} shorts from channel {channel_id}...")

    data = fetch_youtube_videos(
        api_key=api_key,
        channel_id=channel_id,
        max_videos=max_videos,
        max_shorts=max_shorts,
    )

    print(json.dumps(data, indent=2))
    write_videos_yaml(data, output_file)


if __name__ == "__main__":
    main()
