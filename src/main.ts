import * as core from '@actions/core'
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook'
import { GitHubActionsEnv } from './gha'
import { failure, success } from './slack'

async function run(): Promise<void> {
  try {
    const url = process.env.SLACK_WEBHOOK_URL
    if (!url) {
      core.info(
        // eslint-disable-next-line i18n-text/no-en
        'No SLACK_WEBHOOK_URL environment variable provided, skipping sending Slack notification.'
      )
      return
    }
    const webhook = new IncomingWebhook(url)
    const status = core.getInput('status') as
      | 'success'
      | 'failure'
      | 'cancelled'
    const env = process.env as unknown as GitHubActionsEnv
    core.info(core.getInput('steps'))
    if (status === 'success') {
      const msg = success(env)
      await webhook.send(msg as IncomingWebhookSendArguments)
    } else if (status === 'failure') {
      const msg = failure(env, JSON.parse(core.getInput('steps')))
      await webhook.send(msg as IncomingWebhookSendArguments)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(String(error))
    }
  }
}

run()
