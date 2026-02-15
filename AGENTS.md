# AGENTS.md - Profile Repo Notes

This repo powers https://theoutdoorprogrammer.com and the blog.

## Blog Post Checklist

When creating a new blog post in `_posts/`:

- **Always set `layout: post`** in front matter.
- **Always add a `description`** field.
  - Used for `<meta name="description">`, `og:description`, and `twitter:description`.
- **Always add an `icon`** field so the blog card has the right icon.
  - Example: `icon: "twemoji:fish"` for the FishID post.
- **Always add a `tags`** field. in front matter.
- Keep titles short but descriptive (they show up in OG cards & lists).
- If the post has a primary image/screenshot, include it in the body; OG/Twitter image defaults to the site logo.
- External links in post bodies are auto-upgraded to open in a new tab (`target="_blank"` + `rel="noopener noreferrer"`) by `_layouts/post.html`; internal links stay unchanged.

## OG / Meta Notes

- Default OG tags for posts come from `_layouts/post.html`.
- Title: `page.title`
- Description: `page.description` or the post excerpt (truncated).
- Image: `site.url` + `site.image.path` (configured in `_config.yml`).

If you change how OG images work, update this file so future agents remember the pattern.
