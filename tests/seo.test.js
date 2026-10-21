const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const site = 'https://emahhh.github.io/ReactionHub/';

test('canonical URL and social preview URLs match published site', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/emahhh\.github\.io\/ReactionHub\/">/);
  for (const prop of ['og:url','og:image', 'twitter:image']) assert.ok(html.includes(prop));
  assert.ok(html.includes(site + 'og-image.png'));
  assert.ok(fs.statSync(path.join(root, 'og-image.png')).size > 2000);
});

test('one descriptive title and one useful headline with visible FAQ', () => {
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /Find Reaction Videos on X \(Twitter\)/);
  assert.match(html, /<section class="faq"/);
  assert.equal((html.match(/<details>/g) || []).length, 5);
  assert.match(html, /emanuele\.click/);
});

test('JSON-LD is parseable and describes the actual free web app', () => {
  const match = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  assert.ok(match, 'JSON-LD block missing');
  const graph = JSON.parse(match[1])['@graph'];
  assert.deepEqual(graph.map(node => node['@type']), ['WebSite', 'WebApplication']);
  assert.equal(graph[0].url, site);
  assert.equal(graph[1].creator.url, 'https://emanuele.click/');
  assert.equal(graph[1].isAccessibleForFree, true);
});

test('one-page sitemap uses canonical and no fake update dates', () => {
  const sitemap = fs.readFileSync(path.join(root,'sitemap.xml'), 'utf8');
  assert.match(sitemap, /<loc>https:\/\/emahhh\.github\.io\/ReactionHub\/<\/loc>/);
  assert.doesNotMatch(sitemap, /lastmod|example\.com/);
});

test('no keyword-stuffing tags or runtime framework are included', () => {
  assert.doesNotMatch(html, /name="keywords"|@tailwindcss\/browser|typed\.js|bootstrap/i);
  assert.match(html, /daisyui@5/);
});
