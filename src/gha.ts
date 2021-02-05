export interface GitHubActionsEnv {
  CI: true // Always set to true.
  GITHUB_WORKFLOW: string //  The name of the workflow.
  GITHUB_RUN_ID: string //  A unique number for each run within a repository. This number does not change if you re-run the workflow run.
  GITHUB_RUN_NUMBER: string //  A unique number for each run of a particular workflow in a repository. This number begins at 1 for the workflow's first run, and increments with each new run. This number does not change if you re-run the workflow run.
  GITHUB_ACTION: string //   The unique identifier (id) of the action.
  GITHUB_ACTIONS: true // Always set to true when GitHub Actions is running the workflow. You can use this variable to differentiate when tests are being run locally or by GitHub Actions.
  GITHUB_ACTOR: string //  The name of the person or app that initiated the workflow. For example, octocat.
  GITHUB_REPOSITORY: string //  The owner and repository name. For example, octocat/Hello-World.
  GITHUB_EVENT_NAME: string //  The name of the webhook event that triggered the workflow.
  GITHUB_EVENT_PATH: string //  The path of the file with the complete webhook event payload. For example, /github/workflow/event.json.
  GITHUB_WORKSPACE: string //  The GitHub workspace directory path. The workspace directory is a copy of your repository if your workflow uses the actions/checkout action. If you don't use the actions/checkout action, the directory will be empty. For example, /home/runner/work/my-repo-name/my-repo-name.
  GITHUB_SHA: string //  The commit SHA that triggered the workflow. For example, ffac537e6cbbf934b08745a378932722df287a53.
  GITHUB_REF: string //  The branch or tag ref that triggered the workflow. For example, refs/heads/feature-branch-1. If neither a branch or tag is available for the event type, the variable will not exist.
  GITHUB_HEAD_REF?: string //  Only set for pull request events. The name of the head branch.
  GITHUB_BASE_REF?: string //  Only set for pull request events. The name of the base branch.
  GITHUB_SERVER_URL: string //  Returns the URL of the GitHub server. For example: https://github.com.
  GITHUB_API_URL: string //  Returns the API URL. For example: https://api.github.com.
  GITHUB_GRAPHQL_URL: string //  Returns the GraphQL API URL. For example: https://api.github.com/graphql.
}

export interface Step {
  success: boolean
}

export type Steps = {
  [stepID: string]: Step
}

// --

const PR_REF_REGEX = /^refs\/pull\/(\d+)\/merge$/
const BRANCH_REF_REGEX = /^refs\/heads\/(.+)$/
const TAG_REF_REGEX = /^refs\/tags\/(.+)$/

// --

export function getPRNumber(ref: string) {
  const match = ref.match(PR_REF_REGEX)
  if (!match) return undefined
  return parseInt(match[1])
}

// --

export function getBranch(ref: string) {
  const match = ref.match(BRANCH_REF_REGEX)
  if (!match) return undefined
  return match[1]
}

// --

export function getTag(ref: string) {
  const match = ref.match(TAG_REF_REGEX)
  if (!match) return undefined
  return match[1]
}

// --

export function getRefContext(ref: string) {
  const pr = getPRNumber(ref)
  if (pr) {
    return `PR *#${pr}*`
  }
  const tag = getTag(ref)
  if (tag) {
    return `tag *${tag}*`
  }
  const branch = getBranch(ref)
  if (branch) {
    return `branch *${branch}*`
  }
  return `*${ref}*`
}

// --

export function getURLs({
  GITHUB_REPOSITORY,
  GITHUB_SHA,
  GITHUB_REF,
  GITHUB_SERVER_URL = 'https://github.com',
  GITHUB_RUN_ID
}: GitHubActionsEnv) {
  const prNumber = getPRNumber(GITHUB_REF)
  return {
    repo: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}`,
    commit: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}`,
    run: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`,
    pr: prNumber
      ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/pull/${prNumber}`
      : undefined
  }
}
