import { expect, test, vi } from "vitest";

import type { GitHubActionsEnv, Steps } from "../src/gha";
import { failure, success } from "../src/slack";

// The message builders read `jobName` from @actions/core internally (S1 keeps
// src as-is). Mock it to the empty default so snapshots are deterministic.
vi.mock("@actions/core", () => ({
  getInput: vi.fn(() => ""),
  info: vi.fn(),
}));

// The wire payload is what `webhook.send` JSON-serializes. Normalising through
// JSON strips slack-block-builder's internal DTO classes so the snapshot locks
// the emitted payload itself — letting a later plain-object rewrite that emits
// identical JSON stay green, while any real drift fails.
function payload(message: object): unknown {
  return JSON.parse(JSON.stringify(message));
}

function makeEnv(overrides: Partial<GitHubActionsEnv> = {}): GitHubActionsEnv {
  return {
    GITHUB_WORKFLOW: "CI",
    GITHUB_REPOSITORY: "47ng/actions-slack-notify",
    GITHUB_SHA: "ffac537e6cbbf934b08745a378932722df287a53",
    GITHUB_REF: "refs/heads/main",
    GITHUB_SERVER_URL: "https://github.com",
    GITHUB_RUN_ID: "123456789",
    GITHUB_EVENT_NAME: "push",
    ...overrides,
  } as GitHubActionsEnv;
}

// Golden snapshots captured from the CURRENT slack-block-builder implementation.
// They freeze the emitted Block Kit payload so any later refactor (e.g. the
// @slack/types rewrite) that drifts the output fails here.

test("success on a branch", () => {
  expect(payload(success(makeEnv()))).toMatchSnapshot();
});

test("failure with steps", () => {
  const steps: Steps = {
    build: { outcome: "success" },
    test: { outcome: "failure" },
    lint: { outcome: "skipped" },
  };
  expect(payload(failure(makeEnv(), steps))).toMatchSnapshot();
});

test("success on a dependabot ref", () => {
  const env = makeEnv({
    GITHUB_EVENT_NAME: "pull_request",
    GITHUB_REF: "refs/pull/7/merge",
    GITHUB_HEAD_REF: "dependabot/npm_and_yarn/slack/webhook-7.0.9",
  });
  expect(payload(success(env))).toMatchSnapshot();
});

test("success on a pull request ref", () => {
  const env = makeEnv({
    GITHUB_EVENT_NAME: "pull_request",
    GITHUB_REF: "refs/pull/42/merge",
  });
  expect(payload(success(env))).toMatchSnapshot();
});

test("failure on a plain branch without steps", () => {
  const env = makeEnv({ GITHUB_REF: "refs/heads/feat/some-branch" });
  expect(payload(failure(env, {}))).toMatchSnapshot();
});
