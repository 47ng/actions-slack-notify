---
# asn-07e7
title: Validate SLACK_WEBHOOK_URL format, skip early if malformed
status: completed
type: feature
priority: normal
created_at: 2026-06-04T04:48:11Z
updated_at: 2026-06-04T04:52:31Z
parent: asn-zaqr
---

main.ts only checks SLACK_WEBHOOK_URL is defined. A malformed URL passes the guard and fails later at webhook.send (action errors). Parse it (parse-don't-validate): if absent OR not a Slack incoming-webhook URL, take the same skip branch as undefined (info log, exit 0).

## Acceptance criteria

- [x] `parseWebhookUrl(raw)` in `inputs.ts`: Slack incoming-webhook URL → the URL; absent / not-a-URL / wrong host or shape → `undefined`.
- [x] `main.ts` calls it; absent and malformed both fall into the existing skip branch (info log, exit 0, no throw); the log message never echoes the URL value.
- [x] Tests (TDD): valid, undefined, empty, non-url, wrong-host, truncated-path, scheme-downgrade, token with `_`/`-`.
- [x] `pnpm validate` clean; dist rebuilt; golden snapshots untouched.

## Summary of Changes

- **`parseWebhookUrl`** added to `src/inputs.ts` (parse-don't-validate, `safeParse` → `string | undefined`, never throws — unlike `parseSteps`). Regex `^https://hooks\.slack\.com/services/[A-Z0-9]+/[A-Z0-9]+/[\w-]+$`.
- **`src/main.ts`**: the webhook gate now parses instead of truthiness-checking; absent and malformed URLs share one skip branch. Message reworded to "missing or not a valid Slack webhook URL" (static — no secret leakage).

### Design decisions

- **Host + `/services/` path pinned; token segment permissive (`[\w-]+`).** The host/path is the security-relevant part (keeps the POST aimed at Slack); the token charset is not. A false negative would *silently drop a wanted notification*, so the token stays loose (covered by a code-review steer).
- **Skip, don't fail, on malformed** — per the request, same branch as undefined. The action runs under `if: always()`; a misconfigured URL shouldn't turn every job red, just skip the notification.
