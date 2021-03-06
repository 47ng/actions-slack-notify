import * as core from '@actions/core'
import { Blocks, Elements, Message } from 'slack-block-builder'
import {
  getPRNumber,
  getRefContext,
  getURLs,
  GitHubActionsEnv,
  parseDependabotRef,
  Steps
} from './gha'

export function success(env: GitHubActionsEnv) {
  const { GITHUB_WORKFLOW, GITHUB_REPOSITORY, GITHUB_HEAD_REF } = env
  const urls = getURLs(env)
  const jobName = core.getInput('jobName')
  const runName = jobName ? `${GITHUB_WORKFLOW}/${jobName}` : GITHUB_WORKFLOW
  const msg = Message({
    text: `✔︎  ${runName} passed on ${GITHUB_REPOSITORY}`
  }).blocks(
    Blocks.Section({
      text: `*✔︎  ${runName}* passed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`
    })
  )
  const dependabot = parseDependabotRef(GITHUB_HEAD_REF)
  if (dependabot) {
    msg.blocks(
      Blocks.Section({
        text: `📦  *${dependabot.package}* ${dependabot.version} _(by Dependabot)_`
      })
    )
  }
  const context = getContext(env)
  const actions = getActions(env, 'success')
  msg.blocks([context, actions])
  msg.printPreviewUrl()
  return msg.buildToObject()
}

// --

export function failure(env: GitHubActionsEnv, steps: Steps) {
  const { GITHUB_WORKFLOW, GITHUB_REPOSITORY, GITHUB_HEAD_REF } = env
  const urls = getURLs(env)

  const jobName = core.getInput('jobName')
  const runName = jobName ? `${GITHUB_WORKFLOW}/${jobName}` : GITHUB_WORKFLOW

  const msg = Message({
    text: `🚨  ${runName} failed on ${GITHUB_REPOSITORY}`
  }).blocks([
    Blocks.Section({
      text: `*🚨  ${runName}* failed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`
    })
  ])
  const dependabot = parseDependabotRef(GITHUB_HEAD_REF)
  if (dependabot) {
    msg.blocks(
      Blocks.Section({
        text: `📦  *${dependabot.package}* ${dependabot.version} _(by Dependabot)_`
      })
    )
  }
  if (Object.keys(steps).length > 0) {
    msg.blocks(
      Blocks.Section({
        text: Object.entries(steps)
          .map(([id, { outcome }]) => {
            const icon = {
              failure: '✘',
              success: '✔︎',
              skipped: '○'
            }[outcome]
            const format = {
              failure: '*',
              success: '',
              skipped: '_'
            }[outcome]
            return `${format}${icon}  ${id}${format}`
          })
          .join('\n')
      })
    )
  }
  const context = getContext(env)
  const actions = getActions(env, 'failure')
  msg.blocks([context, actions])
  msg.printPreviewUrl()
  return msg.buildToObject()
}

// --

export function getContext(env: GitHubActionsEnv) {
  const urls = getURLs(env)
  const shortSha = env.GITHUB_SHA.slice(0, 8)
  return Blocks.Context().elements([
    `From <${urls.commit}|\`${shortSha}\`> on ${getRefContext(env.GITHUB_REF)}`,
    `Triggered by *${env.GITHUB_EVENT_NAME}*`
  ])
}

// --

export function getActions(
  env: GitHubActionsEnv,
  status: 'success' | 'failure'
) {
  const urls = getURLs(env)
  const viewWorkflowButton = Elements.Button({
    text: status === 'failure' ? 'View Failed Workflow' : 'View Workflow',
    url: urls.run
  })
  const actions = Blocks.Actions().elements(
    status === 'failure'
      ? viewWorkflowButton.danger()
      : viewWorkflowButton.end()
  )
  if (urls.pr !== undefined) {
    const prNumber = getPRNumber(env.GITHUB_REF)
    actions.elements(
      Elements.Button({
        text: `View Pull Request #${prNumber}`,
        url: urls.pr
      })
    )
  }
  return actions
}
