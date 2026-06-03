---
# asn-2p6f
title: 'S2 — Static quality gates: oxlint, oxfmt, knip, validate'
status: todo
type: feature
created_at: 2026-06-03T08:21:55Z
updated_at: 2026-06-03T08:21:55Z
parent: asn-zaqr
blocked_by:
    - asn-mdr4
---

## What to build

Add the static-quality gates on top of the working rails from S1 (parent PRD `asn-zaqr`): oxlint, oxfmt, knip, and the single `validate` script that chains every check. No behaviour change. After this, `pnpm validate` is the one green/red signal locally and in CI.

See parent PRD: *Implementation Decisions* (Tooling specifics).

## Acceptance criteria

- [ ] `oxlint` added; `eslint`, `eslint-plugin-github`, `eslint-plugin-jest`, `@typescript-eslint/parser` removed; `.eslintrc.json`, `.eslintignore` deleted. `.oxlintrc.json`: `correctness` + `suspicious` + `typescript` + `unicorn`, `no-explicit-any` denied. `pnpm lint` clean.
- [ ] `oxfmt` added; `prettier` removed; `.prettierrc.json`, `.prettierignore` deleted. Defaults + import formatting + package.json formatting (sorts scripts). `pnpm format:check` clean.
- [ ] `.vscode/settings.json`: format-on-save via oxfmt.
- [ ] `knip` added (low/no config); flags resolved (expect stale `lib/`, `ts-node`, `npm-run-all`, `act` already gone from S1 — clear any remainder). `pnpm deadcode` clean.
- [ ] `validate` script chains `typecheck`, `lint`, `format:check`, `deadcode`, `test` sequentially (no `npm-run-all`); CI runs `pnpm validate`.

## User stories addressed

- 1, 3, 4, 5
