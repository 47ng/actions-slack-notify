---
# asn-ealg
title: 'S3 — Slack message: slack-block-builder → @slack/types (byte-identical)'
status: todo
type: feature
created_at: 2026-06-03T08:21:57Z
updated_at: 2026-06-03T08:21:57Z
parent: asn-zaqr
blocked_by:
    - asn-mdr4
---

## What to build

Replace `slack-block-builder` with hand-rolled Block Kit JSON typed by `@slack/types`, keeping the emitted payload **byte-identical** — proven by the golden snapshots captured in S1 (parent PRD `asn-zaqr`). Make the message builder a pure function so the snapshots test it in isolation.

See parent PRD: *Implementation Decisions* (Modules: message builder, preview-url), *Testing Decisions*.

## Acceptance criteria

- [ ] Make the builder pure: inject `jobName` as a parameter into `success(env, jobName)` / `failure(env, jobName, steps)` (caller in `main.ts` passes it) instead of reading `core.getInput` inside. Snapshot tests call the pure fn; expected values unchanged.
- [ ] `slack-block-builder` removed from dependencies; `@slack/types` added as devDependency (types only).
- [ ] `success()`/`failure()` return plain `IncomingWebhookSendArguments` with blocks typed as `@slack/types` Block Kit objects; `getContext`/`getActions`/dependabot/step formatting reused unchanged; `.buildToObject()` and `Message/Blocks/Elements` imports gone.
- [ ] Preview-url helper reimplemented as a pure fn: `(blocks) → https://app.slack.com/block-kit-builder/#${encodeURIComponent(JSON.stringify({blocks}))}`.
- [ ] Failure button uses `style: 'danger'`.
- [ ] Unnecessary `as IncomingWebhookSendArguments` casts in `main.ts` dropped.
- [ ] **All S1 golden snapshots byte-identical** before vs after; `pnpm validate` clean.

## User stories addressed

- 14, 15, 17, 23 (16 verified)
