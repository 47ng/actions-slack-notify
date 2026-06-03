---
# asn-mdr4
title: S1 — Working action on new rails + behavior locked by snapshots
status: todo
type: feature
priority: high
created_at: 2026-06-03T08:21:51Z
updated_at: 2026-06-03T08:21:51Z
parent: asn-zaqr
---

## What to build

The end-to-end "swap the rails, keep the train" tracer for the modernization (parent PRD `asn-zaqr`). Move the project onto pnpm + node24 + tsdown + TS6 and establish the vitest harness, **without changing any runtime behaviour** — `src/` logic stays as-is (still `slack-block-builder`, still the unsafe casts). The result is a SHA-pinnable action that posts the *identical* Slack message, now built from a node24 tsdown bundle and guarded by CI. Golden snapshots of the current output are captured here so every later slice is non-regression-checked from the start.

See parent PRD sections: *Solution*, *Implementation Decisions* (Tooling specifics, CI), *Testing Decisions*.

## Acceptance criteria

- [ ] Yarn Classic → pnpm 11+; `yarn.lock` removed, `pnpm-lock.yaml` committed, `packageManager` pinned.
- [ ] Secure pnpm config: `minimumReleaseAge` = 4320 (3 days), `enable-pre-post-scripts=false`, empty `onlyBuiltDependencies`.
- [ ] `action.yml` → `using: node24`; `.node-version` = `24.16.0`; `@types/node` on the 24 line.
- [ ] Dep bumps: `@actions/core` → 3.x (check changelog for breaks), `@slack/webhook` → 7.0.9.
- [ ] `tsconfig` → TS6, target `ES2022`, module/resolution `NodeNext`, boilerplate comments stripped; `typecheck: tsc --noEmit` passes.
- [ ] tsdown bundles `src/main.ts` → `dist/index.js` (`format:'cjs'`, sourcemap, no dts), force-bundling runtime deps via `deps.alwaysBundle` (`@actions/core`, `@slack/webhook`). `@vercel/ncc` + `dist/licenses.txt` removed. Unused `tsc`-emit `lib/` removed.
- [ ] vitest harness in place; existing `__tests__/gha.test.ts` ported and green.
- [ ] **Golden snapshots captured from the CURRENT implementation** (success, failure-with-steps, dependabot ref, PR ref, plain branch) and committed as non-regression fixtures.
- [ ] CI (`.github/workflows`): pnpm + setup-node (reads `.node-version`) + cache; `pnpm install --frozen-lockfile`, typecheck, test, `pnpm package`; **dist-drift check** (`git diff --exit-code dist/`); third-party actions pinned by full commit SHA; least-privilege `permissions:` block.
- [ ] Emitted Slack payload byte-identical to pre-change (no behaviour change).

## User stories addressed

- 2, 6, 7, 8, 9, 10, 11, 16, 20, 21, 22, 23
