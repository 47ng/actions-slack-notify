---
# asn-2p6f
title: 'S2 — Static quality gates: oxlint, oxfmt, knip, validate'
status: completed
type: feature
priority: normal
created_at: 2026-06-03T08:21:55Z
updated_at: 2026-06-03T10:09:12Z
parent: asn-zaqr
blocked_by:
    - asn-mdr4
---

## What to build

Add the static-quality gates on top of the working rails from S1 (parent PRD `asn-zaqr`): oxlint, oxfmt, knip, and the single `validate` script that chains every check. No behaviour change. After this, `pnpm validate` is the one green/red signal locally and in CI.

See parent PRD: *Implementation Decisions* (Tooling specifics).

## Acceptance criteria

- [x] `oxlint` added; `eslint`, `eslint-plugin-github`, `eslint-plugin-jest`, `@typescript-eslint/parser` removed; `.eslintrc.json`, `.eslintignore` deleted. `.oxlintrc.json`: `correctness` + `suspicious` + `typescript` + `unicorn`, `no-explicit-any` denied. `pnpm lint` clean.
- [x] `oxfmt` added; `prettier` removed; `.prettierrc.json`, `.prettierignore` deleted. Defaults + import formatting + package.json formatting (sorts scripts). `pnpm format:check` clean.
- [x] `.vscode/settings.json`: format-on-save via oxfmt.
- [x] `knip` added (low/no config); flags resolved (expect stale `lib/`, `ts-node`, `npm-run-all`, `act` already gone from S1 — clear any remainder). `pnpm deadcode` clean.
- [x] `validate` script chains `typecheck`, `lint`, `format:check`, `deadcode`, `test` sequentially (no `npm-run-all`); CI runs `pnpm validate`.

## User stories addressed

- 1, 3, 4, 5

## Summary of Changes

Added the static-quality gates on top of S1's rails with **zero runtime behaviour change** (golden snapshots stayed green, dist rebuilt byte-equivalent in payload).

- **oxlint** (`1.67.0`) replaces eslint + plugins. `.oxlintrc.json`: `plugins: [typescript, unicorn]`, categories `correctness` + `suspicious` = error, `typescript/no-explicit-any` = deny, `ignorePatterns: [dist/, node_modules/]`. eslint configs deleted; the stale `i18n-text/no-en` disable comment in `main.ts` removed.
- **oxfmt** (`0.52.0`) replaces prettier, adopting oxfmt **defaults** (double quotes, semicolons, trailing commas) + `sortImports`. `sortPackageJson` is on by default (sorts `scripts`). prettier configs deleted. Whole-repo reformat; src/test diffs are pure formatting.
- **`.vscode/settings.json`**: format-on-save wired to the `oxc.oxc-vscode` extension (`editor.defaultFormatter` + `formatOnSave`, per-language for ts/js/json, `oxc.fmt.configPath`).
- **knip** (`6.14.2`, zero-config) for dead code. Resolved flags: removed leftover `js-yaml` devDep; un-exported five module-internal symbols (`getBranch`, `getTag`, `Step` in `gha.ts`; `getContext`, `getActions` in `slack.ts`) — verified no cross-module/test usage.
- **`validate`** script chains `typecheck && lint && format:check && deadcode && test` (sequential, fail-fast, no `npm-run-all`). CI's separate `typecheck`/`test` steps collapsed into one `pnpm validate`; `pnpm package` + dist-drift check intact.

### Design decisions

- **Tool versions pinned below the 3-day `minimumReleaseAge` window** (oxlint 1.67.0, oxfmt 0.52.0, knip 6.14.2 — all published ≤ 2026-05-26); the freshest releases were still in cooldown.
- **oxfmt ignores `.beans/` + `.beans.yml`** (beans-CLI-managed; it rewrites them in its own style, which would otherwise break `pnpm validate` locally on every bean edit) and `dist/` (build output, kept single-quoted by tsdown).
- **`plugins` is set explicitly** in `.oxlintrc.json` because oxlint's `plugins` key overwrites the default set; listing `[typescript, unicorn]` matches the AC exactly.
