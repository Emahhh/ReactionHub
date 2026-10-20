const assert = require("node:assert/strict");
const { test } = require("node:test");
const { COLLECTIONS, normalizeAccounts, createQuery, createURL } = require("../ReactionHub.js");

test("normalizes handles, deduplicates case-insensitively and skips invalid usernames", () => {
  assert.deepEqual(normalizeAccounts(["@NASA", "nasa", " @SpaceX ", "bad-name", "@"]), ["NASA", "SpaceX"]);
});
test("generates valid grouped Boolean queries", () => {
  assert.equal(createQuery("gaga", ["@NASA", "@SpaceX"]), "gaga (from:NASA OR from:SpaceX) filter:media");
});
test("allows a general search without account filters", () => {
  assert.equal(createQuery("crying", []), "crying filter:media");
  assert.equal(createQuery("", ["NASA"]), "(from:NASA) filter:media");
});
test("supports exact quoted phrases without malformed nesting", () => {
  assert.equal(createQuery('  Wendy  " Williams ', ["nasa"], "media", true), '"Wendy  Williams" (from:nasa) filter:media');
});
test("distinguishes videos, images, and all media", () => {
  assert.equal(createQuery("wow", [], "videos"), "wow filter:videos");
  assert.equal(createQuery("wow", [], "images"), "wow filter:images");
  assert.equal(createQuery("wow", [], "anything"), "wow filter:media");
});
test("encodes special characters in search URLs", () => {
  assert.equal(createURL("hello & goodbye", "live"), "https://x.com/search?q=hello%20%26%20goodbye&f=live");
  assert.equal(createURL("hello", "top"), "https://x.com/search?q=hello&f=top");
});
test("curated account groups are present", () => {
  for (const group of ["stan", "italian", "kpop"]) assert.ok(COLLECTIONS[group].length > 10);
});
