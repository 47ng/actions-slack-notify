---
# asn-ealg
title: 'S3 — Slack message: slack-block-builder → @slack/types (byte-identical)'
status: completed
type: feature
priority: normal
created_at: 2026-06-03T08:21:57Z
updated_at: 2026-06-03T11:26:16Z
parent: asn-zaqr
blocked_by:
    - asn-mdr4
---

## What to build

Replace `slack-block-builder` with hand-rolled Block Kit JSON typed by `@slack/types`, keeping the emitted payload **byte-identical** — proven by the golden snapshots captured in S1 (parent PRD `asn-zaqr`). Make the message builder a pure function so the snapshots test it in isolation.

See parent PRD: *Implementation Decisions* (Modules: message builder, preview-url), *Testing Decisions*.

## Acceptance criteria

- [x] Make the builder pure: inject `jobName` as a parameter into `success(env, jobName)` / `failure(env, jobName, steps)` (caller in `main.ts` passes it) instead of reading `core.getInput` inside. Snapshot tests call the pure fn; expected values unchanged.
- [x] `slack-block-builder` removed from dependencies; `@slack/types` added as devDependency (types only).
- [x] `success()`/`failure()` return plain `IncomingWebhookSendArguments` with blocks typed as `@slack/types` Block Kit objects; `getContext`/`getActions`/dependabot/step formatting reused unchanged; `.buildToObject()` and `Message/Blocks/Elements` imports gone.
- [x] Preview-url helper reimplemented as a pure fn: `(blocks) → https://app.slack.com/block-kit-builder/#${encodeURIComponent(JSON.stringify({blocks}))}`.
- [x] Failure button uses `style: 'danger'`.
- [x] Unnecessary `as IncomingWebhookSendArguments` casts in `main.ts` dropped.
- [x] **All S1 golden snapshots byte-identical** before vs after; `pnpm validate` clean.

## User stories addressed

- 14, 15, 17, 23 (16 verified)

## Summary of Changes

Replaced `slack-block-builder` with hand-rolled Block Kit JSON typed by `@slack/types`, **byte-identical** output (all 5 S1 golden snapshots unchanged and green).

- **Pure builders.** `success(env, jobName)` / `failure(env, jobName, steps)` no longer read `core.getInput` — `jobName` is injected by `main.ts`. They build a `KnownBlock[]` and return a plain `IncomingWebhookSendArguments`. `Message/Blocks/Elements`, `.buildToObject()`, and the `@actions/core` import are gone from `slack.ts`.
- **Block Kit objects** typed via `@slack/types` (`SectionBlock`, `ContextBlock`, `ActionsBlock`, `Button`): a small `section()` helper emits `{type:"section",text:{type:"mrkdwn",…}}`; `getContext`/`getActions`/dependabot/step formatting kept identical. Success button omits `style`; failure button carries `style:"danger"` via a conditional spread.
- **`previewUrl(blocks)`** is a pure fn replacing slack-block-builder's `printPreviewUrl()` side effect; `main.ts` logs it via `core.info` for both branches, preserving prior behaviour.
- **`as IncomingWebhookSendArguments` casts dropped** in `main.ts` (the builders are now correctly typed); `webhook.send(msg)` takes the value directly.
- **Deps:** `slack-block-builder` removed (also from tsdown `alwaysBundle`); `@slack/types` `2.21.1` added as a types-only devDep (matches `@slack/webhook`'s resolved `^2.20.1`). Bundle shrank 1.34 MB → 1.16 MB.

### Notes

- `@slack/types` pinned to `2.21.1` (2026-05-07, past the 3-day `minimumReleaseAge` window); `3.0.0-rc.1` is a too-fresh prerelease.
- The `status`/`process.env as GitHubActionsEnv` casts in `main.ts` are intentionally left for S4 (zod parsing) — out of scope here.
- Snapshot test keeps the `JSON.parse(JSON.stringify(...))` normalisation, but the match is genuine (no `emoji`/`block_id`/`style`-on-success keys are emitted at all), not an artefact of undefined-stripping.
