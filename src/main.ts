import * as core from '@actions/core'
import { GitHubActionsEnv } from './gha'
import { failure, success } from './slack'
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook'

async function run(): Promise<void> {
  try {
    const url = process.env.SLACK_WEBHOOK_URL
    if (!url) {
      throw new Error('Missing SLACK_WEBHOOK_URL environment variable')
    }
    const webhook = new IncomingWebhook(url)
    const status = core.getInput('status') as
      | 'success'
      | 'failure'
      | 'cancelled'
    const env = (process.env as unknown) as GitHubActionsEnv
    const { SLACK_WEBHOOK_URL, GITHUB_TOKEN, ...safeEnv } = process.env
    core.info(JSON.stringify(safeEnv, null, 2))
    core.info(core.getInput('steps'))
    if (status === 'success') {
      const msg = success(env)
      core.debug(JSON.stringify(msg, null, 2))
      await webhook.send(msg as IncomingWebhookSendArguments)
    } else if (status === 'failure') {
      const msg = failure(env, JSON.parse(core.getInput('steps')))
      core.debug(JSON.stringify(msg, null, 2))
      await webhook.send(msg as IncomingWebhookSendArguments)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
