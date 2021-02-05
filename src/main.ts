import * as core from '@actions/core'
import { GitHubActionsEnv } from './gha'
import { failure, success } from './slack'
import { IncomingWebhook } from '@slack/webhook'

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
    if (status === 'success') {
      const msg = success(env)
      core.debug(msg)
      await webhook.send(msg)
    } else if (status === 'failure') {
      const msg = failure(env, JSON.parse(core.getInput('steps')))
      core.debug(msg)
      await webhook.send(msg)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
