# ReactionHub

A minimal search tool for reaction videos on [X](https://x.com). [Open ReactionHub](https://emahhh.github.io/ReactionHub/).

Choose a collection, type a phrase and search. The default screen has only one search field and four collection filters. Advanced search controls (media, results tab, exact phrases and all-X search), custom accounts, and fallback links remain available without dominating the interface.

- Curated **Stan Twitter**, **Italian**, and **K-pop** reaction accounts.
- Your own X accounts (stored locally in your browser, up to 60).
- Optional **videos only**, **images only**, **exact phrase**, and **Latest/Top/Media** results.
- Recent searches (shown only after the first search), copyable X search links, and smaller search batches when X struggles with long queries.

ReactionHub only opens X search URLs. It does not fetch or host X posts. Sign in to X to view its results; search availability depends on X.

## Stack

Static **HTML + vanilla JavaScript + daisyUI 5 CSS** with a small stylesheet for layout. No Bootstrap, React, build step or npm dependencies. Works on GitHub Pages.

Run search helper tests with:

```sh
node --test tests/search.test.js
```

Source lists can be edited at the top of `ReactionHub.js`. Some handles may be inactive or renamed.
