---
# asn-pi4q
title: Release-card mode, end-to-end
status: completed
type: feature
priority: normal
created_at: 2026-06-06T20:16:40Z
updated_at: 2026-06-06T20:25:15Z
parent: asn-u4d2
---

## What to build

The complete release-card mode tracer bullet through every layer, as specified in parent PRD `asn-u4d2` (see its Implementation Decisions, Testing Decisions, and Out of Scope sections — do not duplicate here).

End-to-end behavior: on a successful job, if `packageName` + `version` + `channel` all parse as valid, the action posts a two-block release card (`*{packageName} v{version}* released on {channel}` + "View on npmx" / "Release notes" buttons) instead of the generic success message. Invalid/absent release inputs silently fall back to the existing success message. The failure path is untouched.

## Acceptance criteria

- [x] `action.yml` exposes three new optional inputs: `packageName`, `version`, `channel` (no `required`, no defaults)
- [x] valibot release schema: npm package-name validation (accepts scoped), semver+prerelease validation, transform stripping an optional leading `v` to a bare internal version; non-empty `channel`; parse fn returns a typed `Release` or `undefined` via `safeParse`
- [x] `release()` renderer emits: section `*{packageName} v{version}* released on {channel}`; actions block with "View on npmx" → `https://npmx.dev/package/{packageName}/v/{version}` (bare version) and "Release notes" → `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/releases/tag/v{version}`; no context footer; top-level `text` fallback `{packageName} v{version} released on {channel}`
- [x] `main.ts` gate: `success` + valid release inputs → card; `success` + invalid/absent → existing `success()`; `failure` → existing failure renderer regardless of release inputs; other statuses unchanged no-op; no `setFailed` path added for release inputs
- [x] Tests: golden snapshots for a `latest` and a `beta` card; parse tests covering scoped package, prerelease version, leading-`v` strip, and empty/malformed → `undefined`; regression proving success-with-invalid-inputs falls back to generic success and failure path is unchanged
- [x] Existing success/failure/dependabot/PR snapshots remain byte-identical
- [x] README inputs table updated with the three inputs + a release-mode usage example added
- [x] `dist/index.mjs` (+ source map) rebuilt via `pnpm package` and committed
- [x] `pnpm validate` is green (typecheck + oxlint + oxfmt + knip + vitest)

## User stories addressed

Reference by number from parent PRD `asn-u4d2`:

- User stories 1–22 (all)

## Summary of Changes

Added an additive, status-driven release-card mode. `parseRelease` (valibot) gates the mode: on a successful job, three new optional inputs (`packageName`, `version`, `channel`) are parsed, and only if all three are valid does the new `release()` builder render the card; otherwise the existing `success()` message is used. The failure path is untouched, and there is no `setFailed` path for release inputs — misconfiguration silently falls back rather than reddening a green build.

`version` tolerates a leading `v` (stripped to a bare internal value via `v.transform`); the npmx URL uses the bare version while the headline, tag, and release-notes URL re-add the `v`. The release-notes URL derives from `GITHUB_SERVER_URL` + `GITHUB_REPOSITORY` (GHES-safe, consistent with `getURLs`); npmx is hardcoded. `channel` is rendered verbatim.

Gate wiring extracted into a `buildMessage()` helper in `main.ts` for a single clear branch. Tests: GA + beta golden snapshots, a GHES URL-derivation assertion, and `parseRelease` cases (scoped package, prerelease, leading-`v` strip, empty/malformed → `undefined`). Existing snapshots verified byte-identical. `dist/` rebuilt; `pnpm validate` green (35 tests).
