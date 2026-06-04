import { expect, test } from "vitest";

import { parseEnv } from "../src/gha";

function rawEnv(overrides: Record<string, string | undefined> = {}) {
  return {
    GITHUB_WORKFLOW: "CI",
    GITHUB_REPOSITORY: "47ng/actions-slack-notify",
    GITHUB_SHA: "ffac537e6cbbf934b08745a378932722df287a53",
    GITHUB_REF: "refs/heads/main",
    GITHUB_SERVER_URL: "https://github.com",
    GITHUB_RUN_ID: "123456789",
    GITHUB_EVENT_NAME: "push",
    ...overrides,
  };
}

test("parseEnv keeps only the fields the action reads (no passthrough)", () => {
  const parsed = parseEnv(rawEnv({ GITHUB_TOKEN: "secret", PATH: "/usr/bin" }));
  expect(parsed).toEqual({
    GITHUB_WORKFLOW: "CI",
    GITHUB_REPOSITORY: "47ng/actions-slack-notify",
    GITHUB_SHA: "ffac537e6cbbf934b08745a378932722df287a53",
    GITHUB_REF: "refs/heads/main",
    GITHUB_SERVER_URL: "https://github.com",
    GITHUB_RUN_ID: "123456789",
    GITHUB_EVENT_NAME: "push",
  });
});

test("parseEnv defaults GITHUB_SERVER_URL when absent", () => {
  const parsed = parseEnv(rawEnv({ GITHUB_SERVER_URL: undefined }));
  expect(parsed.GITHUB_SERVER_URL).toBe("https://github.com");
});

test("parseEnv keeps GITHUB_HEAD_REF when present (optional)", () => {
  const parsed = parseEnv(rawEnv({ GITHUB_HEAD_REF: "feature-branch" }));
  expect(parsed.GITHUB_HEAD_REF).toBe("feature-branch");
});

test("parseEnv throws when a required field is missing", () => {
  expect(() => parseEnv(rawEnv({ GITHUB_REPOSITORY: undefined }))).toThrow();
});
