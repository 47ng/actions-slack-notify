import { Message, Blocks, Elements } from 'slack-block-builder'
import {
  getPRNumber,
  getRefContext,
  getURLs,
  GitHubActionsEnv,
  Steps
} from './gha'

export function success(env: GitHubActionsEnv) {
  const { GITHUB_WORKFLOW, GITHUB_REPOSITORY } = env
  const urls = getURLs(env)
  const msg = Message({
    text: `✔︎ ${GITHUB_WORKFLOW} passed on ${GITHUB_REPOSITORY}`
  }).blocks(
    Blocks.Section({
      text: `*✔︎ ${GITHUB_WORKFLOW}* passed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`
    })
  )
  const context = getContext(env)
  const actions = getActions(env, 'failure')
  msg.blocks([context, actions])
  msg.printPreviewUrl()
  return msg.buildToObject()
}

// --

export function failure(env: GitHubActionsEnv, steps: Steps) {
  const { GITHUB_WORKFLOW, GITHUB_REPOSITORY } = env
  const urls = getURLs(env)
  const failedStepIDs = Object.entries(steps)
    .filter(({ 1: step }) => step.outcome === 'failure')
    .map(([id]) => id)

  const msg = Message({
    text: `🚨 ${GITHUB_WORKFLOW} failed on ${GITHUB_REPOSITORY}`
  }).blocks([
    Blocks.Section({
      text: `*🚨 ${GITHUB_WORKFLOW}* failed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`
    })
  ])
  if (failedStepIDs.length > 0) {
    msg.blocks(
      Blocks.Section().text(failedStepIDs.map(id => `*✘  ${id}*`).join('\n'))
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
    // ...(duration ? [`Took *${duration}*`] : [])
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
