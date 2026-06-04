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
      - uses: actions/checkout@v5
      # … your build/test steps …

      - name: Notify Slack
        # Pin to the latest release commit SHA from the Releases page:
        # https://github.com/47ng/actions-slack-notify/releases
        # e.g. uses: 47ng/actions-slack-notify@<commit-sha> # vX.Y.Z
        uses: 47ng/actions-slack-notify@<commit-sha>
        if: always()
        with:
          status: ${{ job.status }}
          steps: ${{ toJson(steps) }}
          jobName: Build
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Inputs

| Input     | Required | Default | Description                                                                                                      |
| --------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `status`  | yes      | —       | The job status. Pass `${{ job.status }}`. Only `success` and `failure` send a message; anything else is a no-op. |
| `steps`   | no       | `{}`    | Pass `${{ toJson(steps) }}` to include a per-step pass/fail/skip breakdown in failure messages.                  |
| `jobName` | no       | —       | A label appended to the workflow name in the message (e.g. `CI/Build`), useful in matrix jobs.                   |

## Environment

| Variable            | Required | Description                                                                                   |
| ------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `SLACK_WEBHOOK_URL` | yes      | The Slack Incoming Webhook URL. When absent or malformed, the action skips silently (exit 0). |

## License

[MIT](./LICENSE) — François Best
