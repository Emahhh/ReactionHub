const assert = require("node:assert/strict");
const { test } = require("node:test");
const { normalizeAccounts, createQuery, createURL } = require("../ReactionHub.js");

test("normalizes usernames and removes duplicates", () => {
    assert.deepEqual(normalizeAccounts(["@NASA", "nasa", "@bad-name", " @SpaceX "]), ["NASA", "SpaceX"]);
});
test("builds a valid Boolean OR expression with no leading OR or commas", () => {
    assert.equal(createQuery("gaga", ["@NASA", "@SpaceX"]),
        "gaga (from:NASA OR from:SpaceX) filter:media");
});
test("handles empty keywords and no accounts", () => {
    assert.equal(createQuery("", ["NASA"]), "(from:NASA) filter:media");
    assert.equal(createQuery("crying", []), "crying filter:media");
});
test("supports video-only search", () => {
    assert.equal(createQuery("crying", ["NASA"], "videos"), "crying (from:NASA) filter:videos");
});
test("encodes special characters and supports Latest tab", () => {
    assert.equal(createURL("hello & goodbye", "live"),
        "https://x.com/search?q=hello%20%26%20goodbye&f=live");
});
