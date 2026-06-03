---
# asn-lp3m
title: S4 — Typed input/env parsing with zod (parse, don't validate)
status: todo
type: feature
created_at: 2026-06-03T08:21:58Z
updated_at: 2026-06-03T08:21:58Z
parent: asn-zaqr
blocked_by:
    - asn-mdr4
---

## What to build

Replace the unsafe `as` casts and bare `JSON.parse` with zod v4 parsers (parse-don't-validate) on top of the S1 test harness (parent PRD `asn-zaqr`). Inputs and env are parsed into clean typed objects holding only what the action needs. Behaviour-preserving: an unknown `status` sends nothing and exits 0. Errors surface through the single top-level try/catch in `main.ts`.

See parent PRD: *Implementation Decisions* (Modules: env parser, input parser; Conventions; Error handling), *Testing Decisions*.

## Acceptance criteria

- [ ] `zod` (v4) added (read v4 docs — training data has deprecated APIs). Schemas camelCase, inferred types PascalCase.
- [ ] **input parser**: `status` + `steps` raw → validated values; `steps` parsed from JSON to `Record<string, { outcome }>` (replaces `JSON.parse` + the `Steps` hand type); malformed steps JSON → clear failure.
- [ ] **unknown `status` → no-op**: only `success`/`failure` emit a message; anything else exits 0 without throwing (preserves `if: always()` behaviour).
- [ ] **env parser**: `process.env` → lean object with only the ~8 fields read, each format-checked, no passthrough; inferred type replaces the hand-written `GitHubActionsEnv` interface. `SLACK_WEBHOOK_URL` stays the upstream gate in `main.ts` (absent → skip).
- [ ] Tests (TDD, first): input parser (valid, unknown-status no-op, malformed steps JSON); env parser (valid, missing required field).
- [ ] S1 golden snapshots still green; `pnpm validate` clean.

## User stories addressed

- 12, 13, 24
