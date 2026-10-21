# ReactionHub

**Find reaction videos on X (formerly Twitter).**

Live site: https://emahhh.github.io/ReactionHub/

A minimalist search tool for browsing curated stan Twitter, Italian and K-pop reaction video accounts, with support for adding your own X accounts. Built by [emanuele.click](https://emanuele.click/).

## How it works

1. Enter a phrase or leave it blank to browse a collection.
2. Select one or more account collections (the custom list is saved locally).
3. Search opens a query on X in a new tab, with the `filter:videos` operator.

ReactionHub does **not** scrape, store, or serve X content. You may need an X login, and X can limit or change search results independently of ReactionHub. Shorter queries and smaller collections may work better when X shows no results.

## SEO and sharing

- Crawlable, static English headline, description and useful visible FAQ (no JavaScript rendering required for indexable text).
- Canonical URL points to the current GitHub Pages project site.
- Open Graph and X/Twitter `summary_large_image` tags reference an original 1200×630 PNG (`og-image.png`).
- `WebSite` and `WebApplication` JSON-LD describe the actual app and its creator; no misleading `SearchAction` or FAQ rich-result claims.
- `sitemap.xml` exposes the canonical page for Search Console submission.
- Lightweight, accessible daisyUI 5 plus a small stylesheet; no font downloads, analytics, bundler or JavaScript framework.

**GitHub Pages caveat:** Google's preferred *site name* is determined at a domain/subdomain level, not at a `/ReactionHub/` subpath. `WebSite` markup is valid context about this app, but cannot force Google to display "ReactionHub" as the `github.io` site name. A dedicated custom domain is needed for that level of brand control. Similarly, `robots.txt` at `/ReactionHub/robots.txt` would not function as the host-root robots file; none is added here. Search visibility and rich results are never guaranteed.

After merging and publishing, submit `https://emahhh.github.io/ReactionHub/sitemap.xml` in Google Search Console, inspect the canonical URL, and verify the OG preview with a live social card debugger. Metadata should be checked after GitHub Pages deploys, not before.

## Development

Static HTML/CSS/vanilla JavaScript, with daisyUI 5 from a CSS-only CDN. No build step required.

```sh
node --test tests/*.test.js
```

Curated account usernames live at the top of `ReactionHub.js`. They may need occasional review as accounts get renamed or removed.
