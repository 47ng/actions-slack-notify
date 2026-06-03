---
# asn-zaqr
title: Modernize the GitHub Action to François's stack
status: todo
type: epic
priority: high
created_at: 2026-06-03T07:27:28Z
updated_at: 2026-06-03T07:27:28Z
---

Migrate `actions-slack-notify` off the 2021 `actions/typescript-action` template onto François's preferred stack, **without changing what the action does**. Split into vertical slices — see child beans (`asn-mdr4` rails + snapshots, then `asn-2p6f`/`asn-ealg`/`asn-lp3m`, plus independent `asn-z6x1`).

## Problem Statement

The action works, but its toolchain is from 2021 and off-stack. It carries Yarn Classic, ESLint 8 (legacy `.eslintrc`), Prettier, Jest/ts-jest, `@vercel/ncc`, and a pile of leftover template identity (wrong repo URL, "TypeScript template action" description, a README that is 100% boilerplate documenting a different project). Inputs are consumed with unsafe `as` casts and a bare `JSON.parse`. The Slack message is built with `slack-block-builder` (zero-dep and fine, but the team prefers hand-rolled JSON typed with official types). Dependencies are years behind (`@actions/core` 1.x → 3.x, runtime `node20`). None of this changes behaviour for consumers, but it slows the feedback loop, drifts from the rest of François's projects, and makes the repo harder for agents and humans to navigate.

## Solution

Re-tool the project to the standard stack — **pnpm 11 (secure config), oxlint, oxfmt, knip, vitest, tsdown (Rolldown) for bundling, TypeScript 6 for typecheck, zod v4 for input/env parsing** — bump runtime to `node24`, replace `slack-block-builder` with hand-rolled Block Kit JSON typed by `@slack/types`, and rewrite the repo identity + README from scratch. The emitted Slack payload and the input surface (`status`, `steps`, `jobName`) stay **byte-for-byte identical**, guaranteed by golden snapshots captured from the current implementation before any refactor. Consumers pin by SHA; the only consumer-visible change is the `node20→node24` runtime requirement.

## User Stories

1. As the maintainer, I want a single fast `pnpm validate` (typecheck + lint + format + deadcode + test) so that I get one green/red signal locally and in CI.
2. As the maintainer, I want `pnpm` with a `minimumReleaseAge` window and no post-install scripts, so that a compromised fresh dependency release can't land in my supply chain.
3. As the maintainer, I want oxlint + oxfmt (oxc) instead of ESLint + Prettier, so that lint/format are near-instant and consistent with my other projects.
4. As the maintainer, I want oxfmt to format on save in VS Code (incl. import ordering and package.json script sorting), so that formatting is never a manual step.
5. As the maintainer, I want knip wired in, so that dead code and unused dependencies (e.g. the stale `lib/` build) are surfaced automatically.
6. As the maintainer, I want vitest instead of Jest/ts-jest, so that tests run fast with zero transform config.
7. As the maintainer, I want the bundle produced by tsdown (Rolldown), so that bundling is on-stack with my oxc tooling and fast.
8. As the maintainer, I want every runtime dependency force-bundled into one self-contained `dist/index.js`, so that the SHA-pinned action runs with no shipped `node_modules`.
9. As the maintainer, I want TypeScript 6 typechecking via `tsc --noEmit`, so that types are verified independently of the bundler.
10. As the maintainer, I want the action to run on the `node24` runtime with `@types/node` matched, so that I'm on a supported, current runtime.
11. As the maintainer, I want dependencies bumped (`@actions/core` → 3.x, `@slack/webhook` → 7.0.9), so that I'm current and patched.
12. As the maintainer, I want inputs parsed with zod (parse-don't-validate), so that `status`/`steps` are validated against their formats instead of unsafely cast.
13. As the maintainer, I want the GitHub env parsed into a lean typed object containing only the fields the action reads (each format-checked, no passthrough), so that the action never gains a new failure mode from an unrelated env var.
14. As the maintainer, I want the Slack message built as hand-rolled Block Kit JSON typed by `@slack/types`, so that I drop a builder dependency in favour of official maintained types.
15. As the maintainer, I want the message builder to be a pure function (jobName injected, not read from `core` internally), so that I can golden-snapshot its output in isolation.
16. As the maintainer, I want golden snapshots captured from the current implementation before the rewrite, so that any drift in the emitted payload fails a test.
17. As the maintainer, I want the Block Kit Builder preview-URL helper reimplemented (lost with the builder), so that logs still link to a rendered preview.
18. As the maintainer, I want repo metadata corrected (description, repository URL, author, keywords), so that the package no longer claims to be the upstream template.
19. As the maintainer, I want the README rewritten to document this action's real inputs, the `SLACK_WEBHOOK_URL` secret, and a copy-paste usage example, so that consumers can actually adopt it.
20. As the maintainer, I want CI to run `pnpm install --frozen-lockfile` + `pnpm validate` + the bundle, so that the pipeline mirrors local checks on the pinned `node24`.
21. As the maintainer, I want CI to fail if the committed `dist/` drifts from source, so that a SHA-pinned consumer never gets a stale bundle.
22. As the maintainer, I want third-party actions in my workflow pinned by commit SHA with a least-privilege `permissions:` block, so that the CI itself is hardened.
23. As a consumer, I want the action's emitted Slack message and inputs to be unchanged, so that my existing `uses:` step keeps working after I bump the SHA.
24. As a consumer, I want an unrecognised `status` (e.g. `cancelled`, empty, a typo) to send nothing and exit 0, so that my `if: always()` notify step never fails the workflow.

## Implementation Decisions

**Scope:** strictly behaviour-preserving. Emitted Block Kit payload and input surface (`status`, `steps`, `jobName`) stay identical. No new features (custom text, channel override, threading, mentions) — those are follow-up beans.

**Release/versioning:** kept deliberately simple. Consumers pin by commit SHA; no version-tag ceremony, no floating major tag, no release automation in this epic. `dist/` stays committed so SHA pins resolve to a working bundle.

**Modules (deep, pure, isolatable):**
- *ref/url parsing* — existing pure helpers (`getRefContext`, `getURLs`, `getPRNumber`, `parseDependabotRef`, `getBranch`, `getTag`); extend, keep pure.
- *env parser* — `process.env` → lean typed object via zod; only the ~8 fields actually read (`GITHUB_WORKFLOW`, `GITHUB_REPOSITORY`, `GITHUB_HEAD_REF?`, `GITHUB_SHA`, `GITHUB_REF`, `GITHUB_SERVER_URL` defaulted, `GITHUB_RUN_ID`, `GITHUB_EVENT_NAME`), each format-checked, no passthrough. Inferred type replaces the hand-written `GitHubActionsEnv` interface.
- *input parser* — `status` + `steps` raw strings → validated values; `steps` parsed from JSON to `Record<string, { outcome }>`; unknown `status` resolves to a no-op marker (not an error).
- *message builder* — `success(env, jobName)` / `failure(env, jobName, steps)` → Block Kit JSON typed by `@slack/types`. **`jobName` injected as a parameter** (not read from `core` inside) so the builder is pure.
- *preview-url* — `(blocks) → https://app.slack.com/block-kit-builder/#<encoded>`; pure.
- *main (orchestration)* — thin: read inputs → gate on `SLACK_WEBHOOK_URL` (absent → skip, unchanged) → parse → build → send → single try/catch → `core.setFailed`. Not unit-tested.

**Conventions:** zod schemas camelCase, inferred types PascalCase; parse-don't-validate (output objects hold only what's needed).

**Error handling:** a single top-level try/catch in `main.ts`; zod `.parse` throwing into it → `core.setFailed`.

**Tooling specifics:**
- pnpm 11+, `packageManager` pinned; secure config: `minimumReleaseAge` = 4320 min (3 days), `enable-pre-post-scripts=false`, empty `onlyBuiltDependencies` (no post-install scripts). Yarn Classic + `yarn.lock` removed.
- oxlint: `correctness` (default) + `suspicious` + `typescript` + `unicorn` plugins, `no-explicit-any` denied. Replaces ESLint + `eslint-plugin-github` + `@typescript-eslint`.
- oxfmt: defaults + import formatting + package.json formatting (sorts scripts); format-on-save in VS Code. Replaces Prettier.
- knip: low/no config; expected to flag the dead `lib/` build, `ts-node`, `npm-run-all`, `act`.
- tsdown bundler: entry `src/main.ts`, `format: 'cjs'` (auto-sets `platform: 'node'`), sourcemap on, no `.d.ts`. Runtime deps **force-bundled** via `deps.alwaysBundle` (explicit list: `@actions/core`, `@slack/webhook`, `zod`; tsdown externalizes `dependencies` by default). Output `dist/index.js`. `@vercel/ncc` and `dist/licenses.txt` dropped.
- TypeScript 6 (`tsc --noEmit`) for typecheck only; `tsconfig` target `ES2022`, module/resolution `NodeNext`, boilerplate comments stripped.
- Runtime: `action.yml` `using: node24`; `.node-version` = `24.16.0`; `@types/node` matched to the 24 line.
- `@slack/types` added as a devDependency (types only, zero runtime cost).
- Scripts: `typecheck`, `lint`, `format`, `format:check`, `deadcode`, `test`, `package` (tsdown), and `validate` chaining them sequentially (drop `npm-run-all`).

**CI:** `pnpm/action-setup` + `actions/setup-node` reading `.node-version` with pnpm cache; `pnpm install --frozen-lockfile` → `pnpm validate` → `pnpm package`; **dist-drift check** (`git diff --exit-code dist/`); third-party actions pinned by full commit SHA; least-privilege `permissions:` block. Confirm fork-PR secret behaviour is safe (action already no-ops without the webhook URL).

## Testing Decisions

- **What makes a good test here:** assert external behaviour (the parsed value, the emitted Block Kit JSON), never implementation details. Pure modules in, deterministic values out.
- **TDD:** write tests first. Golden snapshots are captured from the *current* `slack-block-builder` output as reference fixtures, then held green through the `@slack/types` rewrite — they act as non-regression guards (not a literal red→green, since the reference already passes).
- **Modules tested:** ref/url parsing (extend existing `gha.test.ts` — the prior art), env parser (valid + missing-field), input parser (valid, unknown-status → no-op, malformed steps JSON), message builder (golden snapshots: success, failure-with-steps, dependabot ref, PR ref, plain branch), preview-url.
- **Not tested:** `main` orchestration (thin, side-effectful).
- Runner: vitest (replaces Jest); prior art is the existing single `__tests__/gha.test.ts`.

## Out of Scope

- Any change to emitted message content/shape or the input surface — behaviour is frozen.
- New features: custom message text, channel/threading overrides, failure mentions, additional inputs.
- Release automation (tag → marketplace), version-tag schemes, floating major tags — consumers pin by SHA.
- Migrating off committed `dist/` (it stays committed — required for SHA-pinned `uses:`).

## Further Notes

- `@actions/core` 1.x → 3.x is two majors — check its changelog for input/logging API breaks during the bump.
