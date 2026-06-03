import { expect, test } from "vitest";

import type { GitHubActionsEnv, Steps } from "../src/gha";
import { failure, previewUrl, success } from "../src/slack";

// The wire payload is what `webhook.send` JSON-serializes. Normalising through
// JSON drops any `undefined` keys so the snapshot locks the emitted payload
// itself, not the in-memory object — keeping these golden fixtures byte-stable
// across the builder rewrite while still catching real drift.
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

// Golden snapshots captured from the original slack-block-builder
// implementation. They freeze the emitted Block Kit payload so the @slack/types
// rewrite is proven byte-identical: any drift fails here. `jobName` is now an
// injected parameter (empty string = no job suffix).

test("success on a branch", () => {
  expect(payload(success(makeEnv(), ""))).toMatchSnapshot();
});

test("failure with steps", () => {
  const steps: Steps = {
    build: { outcome: "success" },
    test: { outcome: "failure" },
    lint: { outcome: "skipped" },
  };
  expect(payload(failure(makeEnv(), "", steps))).toMatchSnapshot();
});

test("success on a dependabot ref", () => {
  const env = makeEnv({
    GITHUB_EVENT_NAME: "pull_request",
    GITHUB_REF: "refs/pull/7/merge",
    GITHUB_HEAD_REF: "dependabot/npm_and_yarn/slack/webhook-7.0.9",
  });
  expect(payload(success(env, ""))).toMatchSnapshot();
});

test("success on a pull request ref", () => {
  const env = makeEnv({
    GITHUB_EVENT_NAME: "pull_request",
    GITHUB_REF: "refs/pull/42/merge",
  });
  expect(payload(success(env, ""))).toMatchSnapshot();
});

test("failure on a plain branch without steps", () => {
  const env = makeEnv({ GITHUB_REF: "refs/heads/feat/some-branch" });
  expect(payload(failure(env, "", {}))).toMatchSnapshot();
});

test("jobName is injected into the run name", () => {
  const { text } = success(makeEnv(), "Build");
  expect(text).toBe("✔︎  CI/Build passed on 47ng/actions-slack-notify");
});

test("previewUrl builds a decodable block-kit-builder link", () => {
  const { blocks } = success(makeEnv(), "");
  const url = previewUrl(blocks);
  expect(url.startsWith("https://app.slack.com/block-kit-builder/#")).toBe(true);
  const fragment = decodeURIComponent(url.slice(url.indexOf("#") + 1));
  expect(JSON.parse(fragment)).toEqual({ blocks });
});
