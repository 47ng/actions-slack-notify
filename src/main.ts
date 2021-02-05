import * as core from '@actions/core'
import { GitHubActionsEnv } from './gha'
import { failure, success } from './slack'

async function run(): Promise<void> {
  try {
    const status = core.getInput('status') as
      | 'success'
      | 'failure'
      | 'cancelled'
    const env = (process.env as unknown) as GitHubActionsEnv
    if (status === 'success') {
      const msg = success(env)
      core.debug(msg)
    } else if (status === 'failure') {
      const msg = failure(env, JSON.parse(core.getInput('steps')))
      core.debug(msg)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
