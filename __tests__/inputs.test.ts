import { expect, test } from "vitest";

import { parseRelease, parseStatus, parseSteps, parseWebhookUrl } from "../src/inputs";

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

test("parseWebhookUrl accepts a Slack incoming-webhook URL", () => {
  const url = "https://hooks.slack.com/services/T00000000/B00000000/example-webhook-token";
  expect(parseWebhookUrl(url)).toBe(url);
});

test("parseWebhookUrl accepts tokens with underscores and hyphens", () => {
  const url = "https://hooks.slack.com/services/T0ABC123/B0DEF456/aZ9_dash-token";
  expect(parseWebhookUrl(url)).toBe(url);
});

test("parseWebhookUrl returns undefined for missing or malformed URLs", () => {
  // Anything that isn't a Slack webhook URL bails into the same skip path as an
  // absent variable, rather than failing later at send time.
  expect(parseWebhookUrl(undefined)).toBeUndefined();
  expect(parseWebhookUrl("")).toBeUndefined();
  expect(parseWebhookUrl("not a url")).toBeUndefined();
  expect(parseWebhookUrl("https://example.com/webhook")).toBeUndefined();
  expect(parseWebhookUrl("https://hooks.slack.com/services/T00000000")).toBeUndefined();
  // Scheme downgrade must be rejected (guards against a future regex flag slip).
  expect(
    parseWebhookUrl("http://hooks.slack.com/services/T00000000/B00000000/XXXX"),
  ).toBeUndefined();
});

test("parseRelease accepts a complete, valid release", () => {
  expect(parseRelease({ packageName: "nuqs", version: "1.2.3", channel: "🚀 latest" })).toEqual({
    packageName: "nuqs",
    version: "1.2.3",
    channel: "🚀 latest",
  });
});

test("parseRelease accepts a scoped package and a prerelease version", () => {
  expect(
    parseRelease({ packageName: "@47ng/nuqs", version: "1.2.3-beta.4", channel: "🧪 beta" }),
  ).toEqual({ packageName: "@47ng/nuqs", version: "1.2.3-beta.4", channel: "🧪 beta" });
});

test("parseRelease strips a leading v from the version", () => {
  // Callers should pass a bare version, but a `v1.2.3` slip would otherwise
  // silently suppress the release card — tolerate it and canonicalise to bare.
  expect(
    parseRelease({ packageName: "nuqs", version: "v2.8.9", channel: "🚀 latest" })?.version,
  ).toBe("2.8.9");
});

test("parseRelease returns undefined when any input is empty", () => {
  // Absent GitHub Action inputs arrive as "" — that must fall back to the
  // generic success message (release card off), not throw.
  expect(parseRelease({ packageName: "", version: "1.2.3", channel: "🚀 latest" })).toBeUndefined();
  expect(parseRelease({ packageName: "nuqs", version: "", channel: "🚀 latest" })).toBeUndefined();
  expect(parseRelease({ packageName: "nuqs", version: "1.2.3", channel: "" })).toBeUndefined();
});

test("parseRelease returns undefined for a malformed version or package name", () => {
  expect(
    parseRelease({ packageName: "nuqs", version: "not-a-version", channel: "🚀 latest" }),
  ).toBeUndefined();
  expect(
    parseRelease({ packageName: "Invalid Name", version: "1.2.3", channel: "🚀 latest" }),
  ).toBeUndefined();
});
