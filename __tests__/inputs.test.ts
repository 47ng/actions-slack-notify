import { expect, test } from "vitest";

import { parseStatus, parseSteps } from "../src/inputs";

test("parseStatus accepts success and failure", () => {
  expect(parseStatus("success")).toBe("success");
  expect(parseStatus("failure")).toBe("failure");
});

test("parseStatus treats any other status as a no-op (undefined)", () => {
  // `if: always()` runs the action on cancelled/other statuses; those must not
  // emit a message and must not throw.
  expect(parseStatus("cancelled")).toBeUndefined();
  expect(parseStatus("")).toBeUndefined();
  expect(parseStatus("skipped")).toBeUndefined();
});

test("parseSteps parses the toJson(steps) payload into outcomes", () => {
  const raw = JSON.stringify({
    build: { outcome: "success", conclusion: "success", outputs: {} },
    test: { outcome: "failure" },
  });
  expect(parseSteps(raw)).toEqual({
    build: { outcome: "success" },
    test: { outcome: "failure" },
  });
});

test("parseSteps throws on malformed JSON", () => {
  expect(() => parseSteps("{not json")).toThrow();
});

test("parseSteps rejects an unknown step outcome", () => {
  expect(() => parseSteps(JSON.stringify({ build: { outcome: "bogus" } }))).toThrow();
});
