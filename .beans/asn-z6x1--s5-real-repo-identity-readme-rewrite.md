---
# asn-z6x1
title: S5 — Real repo identity + README rewrite
status: todo
type: feature
created_at: 2026-06-03T08:21:59Z
updated_at: 2026-06-03T08:21:59Z
parent: asn-zaqr
---

## What to build

Strip the leftover `actions/typescript-action` template identity and document the real action (parent PRD `asn-zaqr`). Independent of the toolchain work — can land any time.

See parent PRD: *Problem Statement*, *Implementation Decisions*.

## Acceptance criteria

- [ ] `package.json`: real `description` (not "TypeScript template action"), `repository.url` pointing at this repo (not `actions/typescript-action`), `author` set to François Best, real `keywords` (slack, notification, github-actions…).
- [ ] README rewritten from scratch: what the action does, inputs (`status`, `steps`, `jobName`), `SLACK_WEBHOOK_URL` secret setup, copy-paste usage example (showing SHA-pinned `uses:`).
- [ ] Stale `build-test` badge pointing at the template repo removed.
- [ ] No remaining references to `actions/typescript-action` or "template" in repo metadata/docs.

## User stories addressed

- 18, 19
