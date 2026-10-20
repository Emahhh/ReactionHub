# ReactionHub

A lightweight, search-first website for finding reaction videos on [X](https://x.com). [Open the live site](https://emahhh.github.io/ReactionHub/).

## What it does

- Search curated **Stan Twitter**, **Italian Twitter**, and **K-pop** accounts, individually or together.
- Add up to 60 **personal X accounts**, saved only in your browser.
- Search photos and videos, videos only, or images only, with an optional exact phrase.
- Switch between X's Media, Latest and Top tabs.
- Re-run recent searches or copy a search URL.
- If a large search yields no results, try groups of five accounts using the links shown after submitting.

ReactionHub constructs X search URLs; it **does not scrape X, fetch results or store video files**. You generally need to be signed in to X to see results. X may change its search behavior independently of this website.

## Technical approach

Plain `index.html`, `ReactionHub.js` and `style.css`, plus the CSS-only [daisyUI 5](https://daisyui.com/) stylesheet loaded from jsDelivr. **No Bootstrap, no Tailwind browser compiler, no JavaScript framework, no npm dependencies or build step.** State is saved to `localStorage` (with a safe fallback where storage is blocked).

Serve the project as static files, or open `index.html` in a browser. To run helper tests:

```sh
node --test tests/search.test.js
```

Source lists are at the top of `ReactionHub.js`. They are maintained manually, and some X handles may be inactive or renamed.
