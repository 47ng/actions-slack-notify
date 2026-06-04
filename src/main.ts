import * as core from "@actions/core";
import { IncomingWebhook } from "@slack/webhook";

import { parseEnv } from "./gha";
import { parseStatus, parseSteps, parseWebhookUrl } from "./inputs";
import { failure, previewUrl, success } from "./slack";

async function run(): Promise<void> {
  try {
    const url = parseWebhookUrl(process.env.SLACK_WEBHOOK_URL);
    if (!url) {
      core.info(
        "SLACK_WEBHOOK_URL is missing or not a valid Slack webhook URL, skipping sending Slack notification.",
      );
      return;
    }
    const webhook = new IncomingWebhook(url);
    core.info(core.getInput("steps"));

    const status = parseStatus(core.getInput("status"));
    if (status === undefined) {
      return; // Unknown status (e.g. cancelled): no-op, but exit cleanly.
    }

    const env = parseEnv(process.env);
    const jobName = core.getInput("jobName");
    const msg =
      status === "success"
        ? success(env, jobName)
        : failure(env, jobName, parseSteps(core.getInput("steps")));

    core.info(previewUrl(msg.blocks));
    await webhook.send(msg);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
  }
}

run();
