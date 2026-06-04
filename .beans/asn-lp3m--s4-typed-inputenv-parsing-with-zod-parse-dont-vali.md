---
# asn-lp3m
title: S4 — Typed input/env parsing with zod (parse, don't validate)
status: completed
type: feature
priority: normal
created_at: 2026-06-03T08:21:58Z
updated_at: 2026-06-04T04:38:02Z
parent: asn-zaqr
blocked_by:
    - asn-mdr4
---

## What to build

Replace the unsafe `as` casts and bare `JSON.parse` with zod v4 parsers (parse-don't-validate) on top of the S1 test harness (parent PRD `asn-zaqr`). Inputs and env are parsed into clean typed objects holding only what the action needs. Behaviour-preserving: an unknown `status` sends nothing and exits 0. Errors surface through the single top-level try/catch in `main.ts`.

See parent PRD: *Implementation Decisions* (Modules: env parser, input parser; Conventions; Error handling), *Testing Decisions*.

## Acceptance criteria

- [x] `zod` (v4) added (read v4 docs — training data has deprecated APIs). Schemas camelCase, inferred types PascalCase.
- [x] **input parser**: `status` + `steps` raw → validated values; `steps` parsed from JSON to `Record<string, { outcome }>` (replaces `JSON.parse` + the `Steps` hand type); malformed steps JSON → clear failure.
- [x] **unknown `status` → no-op**: only `success`/`failure` emit a message; anything else exits 0 without throwing (preserves `if: always()` behaviour).
- [x] **env parser**: `process.env` → lean object with only the ~8 fields read, each format-checked, no passthrough; inferred type replaces the hand-written `GitHubActionsEnv` interface. `SLACK_WEBHOOK_URL` stays the upstream gate in `main.ts` (absent → skip).
- [x] Tests (TDD, first): input parser (valid, unknown-status no-op, malformed steps JSON); env parser (valid, missing required field).
- [x] S1 golden snapshots still green; `pnpm validate` clean.

## User stories addressed

- 12, 13, 24

## Summary of Changes

Replaced the unsafe `as` casts and bare `JSON.parse` with zod v4 parsers (parse-don't-validate). Behaviour-preserving — all 5 S1 golden snapshots stayed byte-identical.

- **`src/inputs.ts`** (new input-parser module): `parseStatus(raw)` → `"success" | "failure" | undefined` via `messageStatusSchema` (`safeParse`, anything else → `undefined`); `parseSteps(raw)` → `JSON.parse` then `stepsSchema.parse` into `Steps`. The `Steps` hand type moved here as `z.infer<typeof stepsSchema>`.
- **`src/gha.ts`**: the hand-written `GitHubActionsEnv` interface (18 fields, mostly unused) replaced by `githubEnvSchema` + inferred `GithubEnv` + `parseEnv(process.env)`. Only the ~8 fields actually read; `z.object` strips everything else (no passthrough); `GITHUB_SERVER_URL` is `z.url().default("https://github.com")`, `GITHUB_HEAD_REF` optional. `getURLs` drops its inline server-url default (the schema guarantees it).
- **`src/main.ts`**: uses `parseStatus` / `parseEnv` / `parseSteps`; all `as` casts and bare `JSON.parse` gone. Env is parsed (and steps on the failure branch) only *after* the unknown-status early-return, so a no-op status never parses env nor throws. Preview-url + send deduplicated across branches.
- **Tooling:** `zod@4.4.3` added as a **runtime** dep (pinned past the 3-day `minimumReleaseAge` window) and added to tsdown `alwaysBundle` (tsdown externalises `dependencies` by default — verified zod is bundled, not required at runtime). Bundle 1.16 MB → 1.28 MB.
- **Tests (TDD, first):** `inputs.test.ts` (valid status, cancelled/empty/unknown no-op, malformed-JSON throw, unknown-outcome throw, extra-field stripping) and `env.test.ts` (no-passthrough, server-url default, optional head-ref, missing-required throw). `slack.test.ts` updated for the type moves (`GithubEnv` from gha, `Steps` from inputs).

### Design decisions

- **zod v4 APIs:** top-level `z.url()` (not the deprecated `z.string().url()`), two-arg `z.record(z.string(), …)`, `import * as z from "zod"`.
- **Step `outcome` enum stays `["success","failure","skipped"]`** (matches the original `Step` type). GitHub can emit `cancelled` for a step, which the old runtime rendered as literal `"undefined"` text without throwing — the strict enum now throws instead. Judged acceptable: a `cancelled` step outcome essentially only arises while a workflow is being cancelled, which sets `job.status="cancelled"` → `parseStatus` no-ops before steps are ever parsed, so this rarely coincides with the `status="failure"` path. Loud failure beats a half-broken message, per parse-don't-validate.
- **`GITHUB_SERVER_URL=""`** would now throw (`z.url()` rejects empty) where the old destructuring default only filled on `undefined`; GitHub always sets a valid URL, so not a real-world regression.
