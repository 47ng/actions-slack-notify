import type { ActionsBlock, Button, ContextBlock, KnownBlock, SectionBlock } from "@slack/types";
import type { IncomingWebhookSendArguments } from "@slack/webhook";

import { type GithubEnv, getPRNumber, getRefContext, getURLs, parseDependabotRef } from "./gha";
import type { Steps } from "./inputs";

function section(text: string): SectionBlock {
  return { type: "section", text: { type: "mrkdwn", text } };
}

export function success(env: GithubEnv, jobName: string): IncomingWebhookSendArguments {
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
  env: GithubEnv,
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

function getContext(env: GithubEnv): ContextBlock {
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

function getActions(env: GithubEnv, status: "success" | "failure"): ActionsBlock {
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

// --

// Retry budget for transient failures (rate limiting & 5xx), mirroring the
// resilience @slack/webhook gave us before we dropped it for native fetch.
const MAX_RETRIES = 3;
// Cap on a single backoff so a stray Retry-After can't stall the whole job.
const MAX_BACKOFF_MS = 30_000;

export async function postToSlack(
  url: string,
  message: IncomingWebhookSendArguments,
): Promise<void> {
  const body = JSON.stringify(message);
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    if (response.ok) {
      return;
    }
    // Slack rate-limits with 429 and signals transient outages with 5xx; both
    // are worth retrying. 4xx (bad payload, revoked webhook) is terminal.
    const retriable = response.status === 429 || response.status >= 500;
    if (!retriable || attempt >= MAX_RETRIES) {
      const detail = await response.text().catch(() => "");
      throw new Error(
        `Slack webhook responded ${response.status} ${response.statusText}${detail ? `: ${detail}` : ""}`,
      );
    }
    // Honor Retry-After (seconds) when Slack sends it, else exponential backoff.
    const retryAfter = Number(response.headers.get("retry-after"));
    const requestedMs =
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 2 ** attempt * 1000;
    await new Promise((resolve) => setTimeout(resolve, Math.min(requestedMs, MAX_BACKOFF_MS)));
  }
}
