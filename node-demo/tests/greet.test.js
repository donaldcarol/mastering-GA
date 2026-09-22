const test = require("node:test");
const assert = require("node:assert/strict");

const { greet } = require("../src/index");

test("greet formats the name and returns the expected message", () => {
  const result = greet("donald_carol");

  assert.equal(result, "Hello, Donald Carol!");
});
