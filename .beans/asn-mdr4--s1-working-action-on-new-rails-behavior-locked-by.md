---
# asn-mdr4
title: S1 — Working action on new rails + behavior locked by snapshots
status: completed
type: feature
priority: high
created_at: 2026-06-03T08:21:51Z
updated_at: 2026-06-03T09:30:14Z
parent: asn-zaqr
---

## What to build

The end-to-end "swap the rails, keep the train" tracer for the modernization (parent PRD `asn-zaqr`). Move the project onto pnpm + node24 + tsdown + TS6 and establish the vitest harness, **without changing any runtime behaviour** — `src/` logic stays as-is (still `slack-block-builder`, still the unsafe casts). The result is a SHA-pinnable action that posts the *identical* Slack message, now built from a node24 tsdown bundle and guarded by CI. Golden snapshots of the current output are captured here so every later slice is non-regression-checked from the start.

See parent PRD sections: *Solution*, *Implementation Decisions* (Tooling specifics, CI), *Testing Decisions*.

## Acceptance criteria

- [x] Yarn Classic → pnpm 11+; `yarn.lock` removed, `pnpm-lock.yaml` committed, `packageManager` pinned.
- [x] Secure pnpm config: `minimumReleaseAge` = 4320 (3 days), `enable-pre-post-scripts=false`, empty `onlyBuiltDependencies`.
- [x] `action.yml` → `using: node24`; `.node-version` = `24.16.0`; `@types/node` on the 24 line.
- [x] Dep bumps: `@actions/core` → 3.x (check changelog for breaks), `@slack/webhook` → 7.0.9.
- [x] `tsconfig` → TS6, target `ES2022`, module/resolution `NodeNext`, boilerplate comments stripped; `typecheck: tsc --noEmit` passes.
- [x] tsdown bundles `src/main.ts` → `dist/index.js` (`format:'cjs'`, sourcemap, no dts), force-bundling runtime deps via `deps.alwaysBundle` (`@actions/core`, `@slack/webhook`). `@vercel/ncc` + `dist/licenses.txt` removed. Unused `tsc`-emit `lib/` removed.
- [x] vitest harness in place; existing `__tests__/gha.test.ts` ported and green.
- [x] **Golden snapshots captured from the CURRENT implementation** (success, failure-with-steps, dependabot ref, PR ref, plain branch) and committed as non-regression fixtures.
- [x] CI (`.github/workflows`): pnpm + setup-node (reads `.node-version`) + cache; `pnpm install --frozen-lockfile`, typecheck, test, `pnpm package`; **dist-drift check**; third-party actions pinned by full commit SHA; least-privilege `permissions:` block.
- [x] Emitted Slack payload byte-identical to pre-change (no behaviour change).

## User stories addressed

- 2, 6, 7, 8, 9, 10, 11, 16, 20, 21, 22, 23

## Summary of Changes

Re-tooled the action onto the new rails with **zero runtime behaviour change** (`src/` untouched).

- **pnpm:** Yarn removed; `pnpm-lock.yaml` committed; `packageManager` pinned to `pnpm@11.5.0`. Supply-chain hardening in `pnpm-workspace.yaml`: `minimumReleaseAge: 4320` + `enablePrePostScripts: false`.
- **node24:** `.node-version` = `24.16.0`, `action.yml` `using: node24`, `@types/node` on the 24 line.
- **Deps:** `@actions/core` → `^3.0.1`, `@slack/webhook` → `7.0.9`. `slack-block-builder` kept (its replacement is a later slice).
- **TS6:** `tsconfig` rewritten (ES2022 / NodeNext, `noEmit`); `tsc --noEmit` green.
- **tsdown:** `tsdown.config.ts` bundles `src/main.ts` → `dist/index.js` (cjs, sourcemap, no dts), runtime deps force-bundled via `deps.alwaysBundle`. ncc, `lib/`, `dist/licenses.txt`, `dist/sourcemap-register.js` removed. Build verified reproducible (idempotent).
- **vitest:** `gha.test.ts` ported; new `slack.test.ts` golden snapshots for the 5 scenarios.
- **CI:** workflow on pnpm + setup-node (`.node-version`) + cache, runs install/typecheck/test/package, hardened with SHA-pinned actions + least-privilege `permissions: contents: read`.

### Design decisions / deviations

- **`onlyBuiltDependencies` → default-deny.** pnpm 11 *removed* `onlyBuiltDependencies` (replaced by `allowBuilds`) and now blocks **all** dependency build scripts by default. Leaving `allowBuilds` unset is the faithful translation of the AC's "empty `onlyBuiltDependencies`".
- **`minimumReleaseAge` forced a dev-tool pin.** The 3-day window blocked the freshest releases (vitest `4.1.8` was 2 days old), so vitest is pinned to `4.1.7`. Expected behaviour of the guard, not a workaround to remove.
- **Snapshots lock the JSON wire payload, not DTO classes.** Tests normalise builder output through `JSON.parse(JSON.stringify(...))` so the snapshots survive the later plain-object `@slack/types` rewrite while still catching real payload drift.
- **dist-drift check uses `git status --porcelain dist/`** (stricter than `git diff --exit-code`) to also catch newly emitted untracked files.

### Known risk (follow-up if it bites)

- The dist-drift check assumes the tsdown bundle is byte-identical across platforms (built on macOS, CI on Linux). rolldown output is deterministic and the sourcemap uses relative paths, so this should hold; if CI ever drifts, that's the first place to look.
