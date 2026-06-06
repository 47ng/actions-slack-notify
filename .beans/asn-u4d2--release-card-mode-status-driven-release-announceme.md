---
# asn-u4d2
title: 'Release-card mode: status-driven release announcement'
status: completed
type: epic
priority: normal
created_at: 2026-06-06T20:01:15Z
updated_at: 2026-06-06T20:57:10Z
---

Add an optional, additive **release-card mode** to `47ng/actions-slack-notify`: when a successful job supplies release metadata, the action posts a celebratory "package vX.Y.Z released" Slack card with links to npmx and the GitHub release, instead of the generic "CI passed" message. Fully backward-compatible — existing CI usages with no release inputs behave exactly as today. This action is a dependency of the nuqs "Finalize Release" workflow (phase 2 of phasing out semantic-release).

## Problem Statement

As the nuqs maintainer phasing out semantic-release, I need the finalize step of a release workflow to announce a shipped release to Slack — package name, version, and which channel (latest/beta) it went to — with quick links to inspect the package and read the release notes. Today this action only emits generic CI-status messages ("✔︎ CI passed" / "🚨 CI failed"). It has no way to say "nuqs v2.8.9 was just released." I want one `if: always()` step that still reports CI failures (so a broken finalize is visible) but, on success with release metadata present, posts a proper release announcement. It must not disturb any existing consumer of the action, and it should stay repo-agnostic so other 47ng repos can use it.

## Solution

Augment the action with a status-driven release-card mode layered on top of the current behavior:

- **Failure path is untouched.** A failed job still renders the step-breakdown message, so a broken finalize shows which step broke.
- **Success path branches.** On `status == success`, the action attempts to parse three new optional inputs. If all three parse as valid, it renders the **release card**; otherwise it renders the existing generic success message. The branch is silent — invalid or absent release inputs never fail the job, they just fall back to current behavior.
- **Other statuses** (cancelled, empty default) remain a clean no-op.

The release card is a minimal two-block Block Kit message: a headline section `*{packageName} v{version}* released on {channel}` and an actions block with two buttons — **View on npmx** (links to the npmx package page) and **Release notes** (links to the GitHub release for the tag). No context footer. All URLs are derived inside the action from the inputs plus `GITHUB_SERVER_URL`/`GITHUB_REPOSITORY`, so callers pass the minimum: package name, version, channel.

Consumers pin by SHA. The only consumer-visible change for existing users is three new optional inputs they can ignore.

## User Stories

1. As the nuqs maintainer, I want my finalize job to post "nuqs v2.8.9 released" to Slack when a release ships, so that the team sees releases without watching CI logs.
2. As the nuqs maintainer, I want the release announcement to include a button to the npmx package page, so that anyone can inspect the published package in one click.
3. As the nuqs maintainer, I want the release announcement to include a button to the GitHub release notes, so that readers can see what changed.
4. As the nuqs maintainer, I want the card to show which channel a version went to (e.g. `🚀 latest` or `🧪 beta`), so that the team can tell a stable release from a prerelease at a glance.
5. As the nuqs maintainer, I want a single `if: always()` step (not a success/failure fork), so that my workflow stays simple and one step covers both announcement and failure reporting.
6. As the nuqs maintainer, I want a failed finalize to still produce the step-breakdown failure message, so that I can see exactly which finalize step broke.
7. As the nuqs maintainer, I want to pass the version without worrying whether it has a leading `v`, so that a `v1.2.3` vs `1.2.3` slip doesn't matter.
8. As the nuqs maintainer, I want the action to derive npmx and GitHub-release URLs itself, so that I don't have to wire up extra inputs in the caller.
9. As an existing CI consumer of this action, I want my current workflow to keep producing the exact same success/failure messages, so that nothing changes when I upgrade to a release that includes this feature.
10. As an existing CI consumer, I want the three new inputs to be optional, so that omitting them keeps the generic behavior.
11. As a maintainer of another 47ng repo, I want the action to read the repo and host from the runtime GitHub environment, so that the release card works in any repo without per-repo configuration.
12. As a maintainer on GitHub Enterprise, I want the release-notes URL to honor `GITHUB_SERVER_URL`, so that links point at my instance rather than github.com.
13. As the nuqs maintainer, I want a malformed or partial set of release inputs on a successful job to silently fall back to the generic success message (not fail the job), so that a misconfiguration never turns a green build red.
14. As a release reader, I want the package name and version bolded in the headline, so that the release identity stands out.
15. As a release reader, I want the npmx URL to use the bare version (no leading `v`) in its path, so that the link resolves correctly.
16. As a release reader, I want the GitHub-release URL and the displayed version to carry the `v` prefix (the tag), so that the link matches the repo's tag and the headline reads naturally.
17. As the nuqs maintainer, I want scoped package names (e.g. `@scope/pkg`) to be accepted, so that the action works for scoped packages too.
18. As a maintainer reading the docs, I want the README inputs table updated and a release-mode usage example added, so that I can adopt the feature by copy-paste.
19. As a maintainer, I want the action's single SHA-pinnable bundle rebuilt and committed, so that consumers pinning by SHA get the new behavior.
20. As a maintainer, I want `pnpm validate` to stay green (typecheck, lint, format, knip, tests), so that the change meets the repo's quality bar.
21. As a maintainer, I want golden snapshots of the release card (both a latest and a beta example), so that future refactors can't silently change the emitted payload.
22. As a maintainer, I want the existing success/failure snapshots to remain byte-identical, so that I have proof the additive change didn't regress current behavior.

## Implementation Decisions

**Input surface (`action.yml`).** Add three optional inputs, no defaults, no `required`:
- `packageName` — npm package name (top-level or scoped).
- `version` — semver with optional prerelease suffix (e.g. `1.2.3-foobar.42`); tolerates a leading `v`.
- `channel` — free-form non-empty string, rendered verbatim (carries the emoji + flavor, e.g. `🚀 latest` / `🧪 beta`). No validation beyond non-empty.

**Parsing module (input parsing, valibot, parse-don't-validate).** Extend the existing typed-input layer with a release schema and a parse function that returns a typed `Release` value or `undefined` via `safeParse`:
- `packageName` validated against npm package-name rules (accepts scoped names).
- `version` validated against a semver-with-prerelease regex, with a transform that strips an optional leading `v` so the internal value is canonical/bare (e.g. `2.8.9`).
- `channel` validated as non-empty string.
- The schema's success/failure **is** the mode gate: all three valid ⇒ release; anything invalid or empty ⇒ no release value. GitHub Actions supplies `""` for absent inputs, which naturally fails the non-empty/format checks.

**Gate (entry point).** Decision order: parse webhook URL (existing early-skip), parse status (existing no-op for unknown). On `failure` → existing failure renderer (unchanged). On `success` → attempt release parse; if it yields a `Release`, render the release card; otherwise render the existing generic success message. No `setFailed` path is introduced for release inputs — the fallback is silent.

**Rendering module (Slack message building).** Add a `release` builder alongside the existing success/failure builders. It produces an `IncomingWebhookSendArguments` with:
- A `section` block, mrkdwn: `*{packageName} v{version}* released on {channel}` (version shown with `v` prefix).
- An `actions` block with two `button` elements: "View on npmx" → `https://npmx.dev/package/{packageName}/v/{version}` (bare version; npmx's `/v/` is a path segment, not a version prefix) and "Release notes" → `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/releases/tag/v{version}`.
- No context footer.
- Top-level `text` fallback: `{packageName} v{version} released on {channel}`.

**URL derivation.** The release-notes host and repo come from the GitHub runtime environment (`GITHUB_SERVER_URL` + `GITHUB_REPOSITORY`), consistent with the existing URL helpers, so the action stays repo- and host-agnostic (GHES-safe). The npmx host is hardcoded (public service, no enterprise equivalent).

**Backward compatibility.** All new behavior is additive and gated on the presence of valid release inputs on a successful job. Existing CI usages (no release inputs) hit the exact existing success/failure code paths. The emitted payloads for those paths are unchanged.

**Bundle.** The repo commits `dist/index.mjs` (+ source map). The bundle is rebuilt via the existing `pnpm package` (tsdown) and committed. No new runtime dependency is added; if one ever were, it would need tsdown's `alwaysBundle` — not applicable here.

**Docs.** Update the README inputs table to document the three new inputs and add a release-mode usage example mirroring the nuqs finalize caller (`status: ${{ job.status }}` + `packageName`/`version`/`channel`, `if: always()`, `SLACK_WEBHOOK_URL` env).

## Testing Decisions

**What makes a good test here.** Tests assert external behavior — the emitted Block Kit wire payload and the mode-selection decision — not internal structure. The existing suite already snapshots the JSON wire payload (normalized through `JSON.parse(JSON.stringify(...))` to drop `undefined` keys), which is the right granularity: it locks the bytes Slack receives while surviving internal refactors. New tests follow that prior art.

**Modules to test:**
- *Rendering (release card):* golden snapshots of the emitted payload for at least two cases — a `latest`/GA example and a `beta`/prerelease example — covering the headline text, both button URLs (npmx bare version, GitHub `v`-prefixed tag, host from `GITHUB_SERVER_URL`), and the `text` fallback.
- *Parsing/gate:* the release schema accepts valid inputs (incl. scoped package, prerelease version, and a leading-`v` version that is stripped to bare), and rejects/returns `undefined` for empty or malformed inputs.
- *Regression:* on `success` with invalid/partial release inputs, the generic success message is rendered (fallback proven). On `failure`, the step-breakdown message is rendered regardless of release inputs. The existing success/failure/dependabot/PR snapshots remain byte-identical (untouched).

**Prior art:** `__tests__/slack.test.ts` (+ `__tests__/__snapshots__/slack.test.ts.snap`) for the snapshot pattern and the `payload()` normalizer; `__tests__/inputs.test.ts` for valibot parse/round-trip tests; the existing `makeEnv` helper for synthesizing `GithubEnv`.

## Out of Scope

- Deriving GA-vs-beta wording or an `@dist-tag` from `channel` or `version`. `channel` is rendered verbatim; there is a single card template.
- Any `setFailed`/loud-error path for malformed release inputs (the fallback is intentionally silent).
- Changing the failure or generic-success messages, their blocks, or their text.
- A two-step success/failure workflow fork — the design is one `if: always()` step.
- npmx URL behavior on GitHub Enterprise (npmx is a public service; only the GitHub-release URL is host-derived).
- Writing the nuqs `release-finalize.yml` caller workflow (lives in the nuqs repo; this PRD only delivers the action capability).
- Validating that `channel` matches a fixed allow-list of values.

## Further Notes

- The `channel` string is produced by the nuqs side already as `🚀 latest` / `🧪 beta`; emoji are multi-byte and must be passed through untouched (no byte-index slicing).
- `version` contract is "bare semver"; the action tolerates a leading `v` defensively because the silent-fallback gate would otherwise hide a release on that single likely caller mistake.
- Related context (reference, do not duplicate): nuqs phase-2 PRD "Phasing out semantic-release"; this action is consumed by nuqs `release-finalize.yml` (to be written) and the `finalNotification`-gated success notify in `ci-cd.yml`.
- Prior epic `asn-zaqr` (stack modernization) established the current valibot/tsdown/oxc/vitest stack and the golden-snapshot discipline this PRD builds on.
