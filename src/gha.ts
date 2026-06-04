import * as z from "zod";

// The action only reads a handful of the GITHUB_* variables. Parse just those
// into a lean, typed object — each field format-checked, everything else
// dropped (z.object strips unknown keys, so there is no passthrough).
const githubEnvSchema = z.object({
  GITHUB_WORKFLOW: z.string().min(1),
  GITHUB_REPOSITORY: z.string().min(1),
  GITHUB_SHA: z.string().min(1),
  GITHUB_REF: z.string().min(1),
  GITHUB_SERVER_URL: z.url().default("https://github.com"),
  GITHUB_RUN_ID: z.string().min(1),
  GITHUB_EVENT_NAME: z.string().min(1),
  GITHUB_HEAD_REF: z.string().optional(), // Only set for pull request events.
});

export type GithubEnv = z.infer<typeof githubEnvSchema>;

export function parseEnv(env: NodeJS.ProcessEnv): GithubEnv {
  return githubEnvSchema.parse(env);
}

// --

const PR_REF_REGEX = /^refs\/pull\/(\d+)\/merge$/;
const BRANCH_REF_REGEX = /^refs\/heads\/(.+)$/;
const TAG_REF_REGEX = /^refs\/tags\/(.+)$/;
const DEPENDABOT_REGEX = /^dependabot\/(?:[\w]+)\/([\w/-]+)-([\d]+\.[\d]+\.[\d]+.*)$/;

// --

export function parseDependabotRef(ref?: string) {
  if (!ref) {
    return undefined;
  }
  const match = ref.match(DEPENDABOT_REGEX);
  if (!match) {
    return undefined;
  }
  return {
    package: match[1].includes("/") ? `@${match[1]}` : match[1],
    version: match[2],
  };
}

export function getPRNumber(ref: string) {
  const match = ref.match(PR_REF_REGEX);
  if (!match) return undefined;
  return parseInt(match[1]);
}

// --

function getBranch(ref: string) {
  const match = ref.match(BRANCH_REF_REGEX);
  if (!match) return undefined;
  return match[1];
}

// --

function getTag(ref: string) {
  const match = ref.match(TAG_REF_REGEX);
  if (!match) return undefined;
  return match[1];
}

// --

export function getRefContext(ref: string) {
  const pr = getPRNumber(ref);
  if (pr) {
    return `PR *#${pr}*`;
  }
  const tag = getTag(ref);
  if (tag) {
    return `tag *${tag}*`;
  }
  const branch = getBranch(ref);
  if (branch) {
    return `branch *${branch}*`;
  }
  return `*${ref}*`;
}

// --

export function getURLs({
  GITHUB_REPOSITORY,
  GITHUB_SHA,
  GITHUB_REF,
  GITHUB_SERVER_URL,
  GITHUB_RUN_ID,
}: GithubEnv) {
  const prNumber = getPRNumber(GITHUB_REF);
  return {
    repo: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}`,
    commit: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}`,
    run: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`,
    pr: prNumber ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/pull/${prNumber}` : undefined,
  };
}
