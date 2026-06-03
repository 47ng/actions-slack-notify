import type { ActionsBlock, Button, ContextBlock, KnownBlock, SectionBlock } from "@slack/types";
import type { IncomingWebhookSendArguments } from "@slack/webhook";

import {
  type GitHubActionsEnv,
  getPRNumber,
  getRefContext,
  getURLs,
  parseDependabotRef,
  type Steps,
} from "./gha";

function section(text: string): SectionBlock {
  return { type: "section", text: { type: "mrkdwn", text } };
}

export function success(env: GitHubActionsEnv, jobName: string): IncomingWebhookSendArguments {
  const { GITHUB_WORKFLOW, GITHUB_REPOSITORY, GITHUB_HEAD_REF } = env;
  const urls = getURLs(env);
  const runName = jobName ? `${GITHUB_WORKFLOW}/${jobName}` : GITHUB_WORKFLOW;

  const blocks: KnownBlock[] = [
    section(`*✔︎  ${runName}* passed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`),
  ];
  const dependabot = parseDependabotRef(GITHUB_HEAD_REF);
  if (dependabot) {
    blocks.push(section(`📦  *${dependabot.package}* ${dependabot.version} _(by Dependabot)_`));
  }
  blocks.push(getContext(env), getActions(env, "success"));

  return {
    text: `✔︎  ${runName} passed on ${GITHUB_REPOSITORY}`,
    blocks,
  };
}

// --

export function failure(
  env: GitHubActionsEnv,
  jobName: string,
  steps: Steps,
): IncomingWebhookSendArguments {
  const { GITHUB_WORKFLOW, GITHUB_REPOSITORY, GITHUB_HEAD_REF } = env;
  const urls = getURLs(env);
  const runName = jobName ? `${GITHUB_WORKFLOW}/${jobName}` : GITHUB_WORKFLOW;

  const blocks: KnownBlock[] = [
    section(`*🚨  ${runName}* failed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`),
  ];
  const dependabot = parseDependabotRef(GITHUB_HEAD_REF);
  if (dependabot) {
    blocks.push(section(`📦  *${dependabot.package}* ${dependabot.version} _(by Dependabot)_`));
  }
  if (Object.keys(steps).length > 0) {
    blocks.push(
      section(
        Object.entries(steps)
          .map(([id, { outcome }]) => {
            const icon = {
              failure: "✘",
              success: "✔︎",
              skipped: "○",
            }[outcome];
            const format = {
              failure: "*",
              success: "",
              skipped: "_",
            }[outcome];
            return `${format}${icon}  ${id}${format}`;
          })
          .join("\n"),
      ),
    );
  }
  blocks.push(getContext(env), getActions(env, "failure"));

  return {
    text: `🚨  ${runName} failed on ${GITHUB_REPOSITORY}`,
    blocks,
  };
}

// --

function getContext(env: GitHubActionsEnv): ContextBlock {
  const urls = getURLs(env);
  const shortSha = env.GITHUB_SHA.slice(0, 8);
  return {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `From <${urls.commit}|\`${shortSha}\`> on ${getRefContext(env.GITHUB_REF)}`,
      },
      {
        type: "mrkdwn",
        text: `Triggered by *${env.GITHUB_EVENT_NAME}*`,
      },
    ],
  };
}

// --

function getActions(env: GitHubActionsEnv, status: "success" | "failure"): ActionsBlock {
  const urls = getURLs(env);
  const viewWorkflow: Button = {
    type: "button",
    text: {
      type: "plain_text",
      text: status === "failure" ? "View Failed Workflow" : "View Workflow",
    },
    url: urls.run,
    ...(status === "failure" ? { style: "danger" } : {}),
  };
  const elements: Button[] = [viewWorkflow];
  if (urls.pr !== undefined) {
    const prNumber = getPRNumber(env.GITHUB_REF);
    elements.push({
      type: "button",
      text: { type: "plain_text", text: `View Pull Request #${prNumber}` },
      url: urls.pr,
    });
  }
  return { type: "actions", elements };
}

// --

export function previewUrl(blocks: IncomingWebhookSendArguments["blocks"]): string {
  return `https://app.slack.com/block-kit-builder/#${encodeURIComponent(JSON.stringify({ blocks }))}`;
}
