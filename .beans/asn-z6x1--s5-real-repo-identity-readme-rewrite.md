---
# asn-z6x1
title: S5 — Real repo identity + README rewrite
status: completed
type: feature
priority: normal
created_at: 2026-06-03T08:21:59Z
updated_at: 2026-06-04T05:08:52Z
parent: asn-zaqr
---

## What to build

Strip the leftover `actions/typescript-action` template identity and document the real action (parent PRD `asn-zaqr`). Independent of the toolchain work — can land any time.

See parent PRD: *Problem Statement*, *Implementation Decisions*.

## Acceptance criteria

- [x] `package.json`: real `description` (not "TypeScript template action"), `repository.url` pointing at this repo (not `actions/typescript-action`), `author` set to François Best, real `keywords` (slack, notification, github-actions…).
- [x] README rewritten from scratch: what the action does, inputs (`status`, `steps`, `jobName`), `SLACK_WEBHOOK_URL` secret setup, copy-paste usage example (showing SHA-pinned `uses:`).
- [x] Stale `build-test` badge pointing at the template repo removed.
- [x] No remaining references to `actions/typescript-action` or "template" in repo metadata/docs.

## User stories addressed

- 18, 19

## Summary of Changes

Removed the leftover `actions/typescript-action` template identity and documented the real action.

- **`package.json`**: `description` → "GitHub Action to notify job status to Slack, with context and useful links"; `repository.url` → `git+https://github.com/47ng/actions-slack-notify.git`; `author` → "François Best (https://francoisbest.com)"; `keywords` → github-actions/slack/slack-notification/notification/ci/webhook (oxfmt sorts them).
- **`README.md`** rewritten from scratch: what the action does (feature bullets), `SLACK_WEBHOOK_URL` secret setup, a copy-paste workflow example with SHA-pinned `uses:`, and Inputs / Environment tables. Template `build-test` badge replaced with the real `test.yml` CI badge + an MIT license badge.
- Verified no `template` / `typescript-action` references remain in README/package.json/action.yml.

### Design decision — usage example pin

The example `uses:` is shown as `47ng/actions-slack-notify@<commit-sha>` (placeholder) with a pointer to the Releases page, **not** a concrete SHA. Reason (from code review): the only existing release tag `1.0.2` (SHA `0917ccc`) predates the whole modernization — it runs node20 and lacks the malformed-webhook skip this README documents. Pinning the example there would hand users stale code that doesn't match the docs. Once the modernized version is released, fill the example with that release SHA.
