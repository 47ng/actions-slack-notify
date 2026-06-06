import * as v from "valibot";

// Only `success` and `failure` produce a message. Any other status (e.g.
// `cancelled`, or the empty default) is a no-op: the action still runs under
// `if: always()`, but parses to `undefined` so nothing is sent.
const messageStatusSchema = v.picklist(["success", "failure"]);
export type MessageStatus = v.InferOutput<typeof messageStatusSchema>;

export function parseStatus(raw: string): MessageStatus | undefined {
  const result = v.safeParse(messageStatusSchema, raw);
  return result.success ? result.output : undefined;
}

// The `steps` input is `toJson(steps)` — a map of step id to its result. Only
// `outcome` is rendered; extra fields (conclusion, outputs) are stripped.
const stepsSchema = v.record(
  v.string(),
  v.object({ outcome: v.picklist(["success", "failure", "skipped"]) }),
);
export type Steps = v.InferOutput<typeof stepsSchema>;

export function parseSteps(raw: string): Steps {
  return v.parse(stepsSchema, JSON.parse(raw));
}

// A Slack incoming-webhook URL: https://hooks.slack.com/services/<T>/<B>/<token>.
// Anything else (absent, not a URL, wrong host/shape) parses to `undefined` so
// the caller skips cleanly instead of failing later at send time.
// The host + `/services/` path are the parts worth pinning (they keep the
// request pointed at Slack); the token segment stays permissive (`[\w-]+`) so a
// valid webhook is never falsely rejected — a false negative would silently
// drop a wanted notification.
const webhookUrlSchema = v.pipe(
  v.string(),
  v.regex(/^https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]+\/[A-Z0-9]+\/[\w-]+$/),
);

export function parseWebhookUrl(raw: string | undefined): string | undefined {
  const result = v.safeParse(webhookUrlSchema, raw);
  return result.success ? result.output : undefined;
}

// Release-card inputs. Their *validity* is the mode gate: on a successful job,
// all three parsing cleanly switches the message from the generic success
// notice to the release card; anything missing or malformed (GitHub passes ""
// for absent inputs) parses unsuccessfully and silently falls back — a release
// is never announced from half-configured inputs, nor does it fail the job.

// npm package name, top-level or scoped (`@scope/name`); npm's name rules
// (lowercase, URL-safe, no leading dot/underscore).
const packageNameSchema = v.pipe(
  v.string(),
  v.regex(/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/),
);

// semver core with optional prerelease/build suffix (e.g. `1.2.3-beta.4`). A
// leading `v` is tolerated then stripped, so the internal value is always bare
// (the npmx URL takes the bare version; display/tag re-add the `v`).
const versionSchema = v.pipe(
  v.string(),
  v.regex(/^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z][0-9A-Za-z.-]*)?(?:\+[0-9A-Za-z][0-9A-Za-z.-]*)?$/),
  v.transform((raw) => raw.replace(/^v/, "")),
);

// Free-form label carrying the channel emoji + flavour (e.g. `🚀 latest`,
// `🧪 beta`), rendered verbatim. Only non-emptiness is required.
const channelSchema = v.pipe(v.string(), v.nonEmpty());

const releaseSchema = v.object({
  packageName: packageNameSchema,
  version: versionSchema,
  channel: channelSchema,
});
export type Release = v.InferOutput<typeof releaseSchema>;

export function parseRelease(raw: {
  packageName: string;
  version: string;
  channel: string;
}): Release | undefined {
  const result = v.safeParse(releaseSchema, raw);
  return result.success ? result.output : undefined;
}
