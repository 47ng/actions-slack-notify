<p align="center">
  <a href="https://github.com/47ng/actions-slack-notify/actions/workflows/test.yml"><img alt="CI status" src="https://github.com/47ng/actions-slack-notify/actions/workflows/test.yml/badge.svg"></a>
  <a href="./LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</p>

# Notify to Slack

A GitHub Action that posts a job's status to Slack, with context (commit, ref,
trigger) and handy links back to the workflow run and pull request.

- **Success / failure messages** with a coloured button linking to the run.
- **Per-step breakdown** on failure (which steps passed, failed or were skipped).
- **Pull request & Dependabot aware**: links the PR and surfaces the bumped
  package on Dependabot branches.
- **Release card**: on success, pass `packageName` + `version` + `channel` to
  post a release announcement (links to npmx and the GitHub release) instead of
  the generic success message.
- Runs on `node24`, ships as a single SHA-pinnable bundle, sends nothing when no
  webhook is configured.

## Setup

1. Create a [Slack Incoming Webhook](https://api.slack.com/messaging/webhooks)
   for the channel you want to post to.
2. Add the resulting URL as a repository secret named `SLACK_WEBHOOK_URL`
   (**Settings → Secrets and variables → Actions**).

If the secret is missing or not a valid Slack webhook URL, the action logs a
message and exits cleanly without failing the job.

## Usage

Add the action as the **last step** of your job and run it with `if: always()`
so it reports both successes and failures:

```yaml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # ...other steps...

      - name: Notify Slack
        uses: 47ng/actions-slack-notify@454fe45e7ca3f21d7f7be774044de1664f1b22c1
        if: always()
        with:
          status: ${{ job.status }}
          steps: ${{ toJson(steps) }}
          jobName: Build
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Release card

To announce a release instead of a generic "passed" message, add the three
release inputs on a **successful** job. When all three are present and valid, the
action posts a card titled `<package> v<version> released on <channel>` with
buttons linking to the package on [npmx](https://npmx.dev) and to the GitHub
release notes. The failure path is unchanged, and omitting these inputs keeps the
normal CI behavior — so a single `if: always()` step covers both.

```yaml
- name: Notify release
  uses: 47ng/actions-slack-notify@<commit-sha> # see the Releases page
  if: always()
  with:
    status: ${{ job.status }}
    packageName: nuqs
    version: ${{ steps.release.outputs.version }} # e.g. 1.2.3 or 1.2.3-beta.4 (no leading v)
    channel: "🚀 latest" # or "🧪 beta"
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

The release-notes URL is derived from the runtime GitHub environment
(`GITHUB_SERVER_URL` + `GITHUB_REPOSITORY` + `v<version>`), so the action works
in any repository without extra configuration.

## Inputs

| Input         | Required | Default | Description                                                                                                      |
| ------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `status`      | yes      | —       | The job status. Pass `${{ job.status }}`. Only `success` and `failure` send a message; anything else is a no-op. |
| `steps`       | no       | `{}`    | Pass `${{ toJson(steps) }}` to include a per-step pass/fail/skip breakdown in failure messages.                  |
| `jobName`     | no       | —       | A label appended to the workflow name in the message (e.g. `CI/Build`), useful in matrix jobs.                   |
| `packageName` | no       | —       | Release mode: the npm package name (`nuqs`, `@scope/pkg`). Requires `version` and `channel`.                     |
| `version`     | no       | —       | Release mode: the released version, semver, without a leading `v` (`1.2.3`, `1.2.3-beta.4`).                     |
| `channel`     | no       | —       | Release mode: a distribution-channel label, shown as-is (`🚀 latest`, `🧪 beta`).                                |

## Environment

| Variable            | Required | Description                                                                                   |
| ------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `SLACK_WEBHOOK_URL` | yes      | The Slack Incoming Webhook URL. When absent or malformed, the action skips silently (exit 0). |

## License

[MIT](./LICENSE) — François Best
