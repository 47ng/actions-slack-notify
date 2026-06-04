import * as z from "zod";

// Only `success` and `failure` produce a message. Any other status (e.g.
// `cancelled`, or the empty default) is a no-op: the action still runs under
// `if: always()`, but parses to `undefined` so nothing is sent.
const messageStatusSchema = z.enum(["success", "failure"]);
export type MessageStatus = z.infer<typeof messageStatusSchema>;

export function parseStatus(raw: string): MessageStatus | undefined {
  const result = messageStatusSchema.safeParse(raw);
  return result.success ? result.data : undefined;
}

// The `steps` input is `toJson(steps)` — a map of step id to its result. Only
// `outcome` is rendered; extra fields (conclusion, outputs) are stripped.
const stepsSchema = z.record(
  z.string(),
  z.object({ outcome: z.enum(["success", "failure", "skipped"]) }),
);
export type Steps = z.infer<typeof stepsSchema>;

export function parseSteps(raw: string): Steps {
  return stepsSchema.parse(JSON.parse(raw));
}

// A Slack incoming-webhook URL: https://hooks.slack.com/services/<T>/<B>/<token>.
// Anything else (absent, not a URL, wrong host/shape) parses to `undefined` so
// the caller skips cleanly instead of failing later at send time.
// The host + `/services/` path are the parts worth pinning (they keep the
// request pointed at Slack); the token segment stays permissive (`[\w-]+`) so a
// valid webhook is never falsely rejected — a false negative would silently
// drop a wanted notification.
const webhookUrlSchema = z
  .string()
  .regex(/^https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]+\/[A-Z0-9]+\/[\w-]+$/);

export function parseWebhookUrl(raw: string | undefined): string | undefined {
  const result = webhookUrlSchema.safeParse(raw);
  return result.success ? result.data : undefined;
}
