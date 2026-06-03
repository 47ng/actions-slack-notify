import * as core from "@actions/core";
import { IncomingWebhook } from "@slack/webhook";

import { GitHubActionsEnv } from "./gha";
import { failure, previewUrl, success } from "./slack";

async function run(): Promise<void> {
  try {
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url) {
      core.info(
        "No SLACK_WEBHOOK_URL environment variable provided, skipping sending Slack notification.",
      );
      return;
    }
    const webhook = new IncomingWebhook(url);
    const status = core.getInput("status") as "success" | "failure" | "cancelled";
    const jobName = core.getInput("jobName");
    const env = process.env as unknown as GitHubActionsEnv;
    core.info(core.getInput("steps"));
    if (status === "success") {
      const msg = success(env, jobName);
      core.info(previewUrl(msg.blocks));
      await webhook.send(msg);
    } else if (status === "failure") {
      const msg = failure(env, jobName, JSON.parse(core.getInput("steps")));
      core.info(previewUrl(msg.blocks));
      await webhook.send(msg);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
  }
}

run();
