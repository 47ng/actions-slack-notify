import * as core from "@actions/core";
import type { IncomingWebhookSendArguments } from "@slack/webhook";

import { type GithubEnv, parseEnv } from "./gha";
import {
  type MessageStatus,
  parseRelease,
  parseStatus,
  parseSteps,
  parseWebhookUrl,
} from "./inputs";
import { failure, postToSlack, previewUrl, release, success } from "./slack";

// On success, valid release inputs swap the generic notice for the release card;
// absent or malformed inputs (parseRelease → undefined) fall back to it. Failure
// keeps the step breakdown regardless of any release inputs.
function buildMessage(
  status: MessageStatus,
  env: GithubEnv,
  jobName: string,
): IncomingWebhookSendArguments {
  if (status === "failure") {
    return failure(env, jobName, parseSteps(core.getInput("steps")));
  }
  const releaseInfo = parseRelease({
    packageName: core.getInput("packageName"),
    version: core.getInput("version"),
    channel: core.getInput("channel"),
  });
  return releaseInfo ? release(env, releaseInfo) : success(env, jobName);
}

async function run(): Promise<void> {
  try {
    const url = parseWebhookUrl(process.env.SLACK_WEBHOOK_URL);
    if (!url) {
      core.info(
        "SLACK_WEBHOOK_URL is missing or not a valid Slack webhook URL, skipping sending Slack notification.",
      );
      return;
    }
    core.info(core.getInput("steps"));

    const status = parseStatus(core.getInput("status"));
    if (status === undefined) {
      return; // Unknown status (e.g. cancelled): no-op, but exit cleanly.
    }

    const env = parseEnv(process.env);
    const jobName = core.getInput("jobName");
    const msg = buildMessage(status, env, jobName);

    core.info(previewUrl(msg.blocks));
    await postToSlack(url, msg);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
  }
}

run();
