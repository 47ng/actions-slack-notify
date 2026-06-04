import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

import { postToSlack } from "../src/slack";

// Fake, hyphenated token so neither the host nor the path looks like a real
// Slack webhook secret to push protection. msw matches on this exact URL.
const url = "https://hooks.slack.test/services/T-TEST/B-TEST/fake-token";
const message = { text: "hello", blocks: [] };

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("POSTs the JSON payload and resolves on 200", async () => {
  let contentType: string | null = null;
  let received: unknown;
  server.use(
    http.post(url, async ({ request }) => {
      contentType = request.headers.get("content-type");
      received = await request.json();
      return HttpResponse.text("ok");
    }),
  );

  await expect(postToSlack(url, message)).resolves.toBeUndefined();
  expect(contentType).toBe("application/json");
  expect(received).toEqual(message);
});

test("throws with status detail and does not retry on 4xx", async () => {
  let calls = 0;
  server.use(
    http.post(url, () => {
      calls++;
      return HttpResponse.text("invalid_payload", { status: 400 });
    }),
  );

  await expect(postToSlack(url, message)).rejects.toThrow(/400.*invalid_payload/);
  expect(calls).toBe(1); // terminal: no retry budget spent
});

// The retry path sleeps between attempts; fake timers let us drive those delays
// instantly instead of waiting on real exponential backoff.
describe("transient failures (faked timers)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test("retries 5xx then throws after exhausting the budget", async () => {
    let calls = 0;
    server.use(
      http.post(url, () => {
        calls++;
        return HttpResponse.text("server_error", { status: 500 });
      }),
    );

    const promise = postToSlack(url, message);
    // Attach the rejection assertion before advancing so the eventual rejection
    // is never momentarily unhandled.
    const settled = expect(promise).rejects.toThrow(/500/);
    await vi.runAllTimersAsync();
    await settled;
    expect(calls).toBe(4); // 1 initial attempt + 3 retries (MAX_RETRIES)
  });

  test("recovers when a transient 500 is followed by success", async () => {
    let calls = 0;
    server.use(
      http.post(url, () => {
        calls++;
        return calls === 1
          ? HttpResponse.text("server_error", { status: 500 })
          : HttpResponse.text("ok");
      }),
    );

    const promise = postToSlack(url, message);
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toBeUndefined();
    expect(calls).toBe(2);
  });

  test("honors Retry-After on 429 and recovers", async () => {
    let calls = 0;
    server.use(
      http.post(url, () => {
        calls++;
        return calls === 1
          ? HttpResponse.text("rate_limited", {
              status: 429,
              headers: { "retry-after": "1" },
            })
          : HttpResponse.text("ok");
      }),
    );

    const promise = postToSlack(url, message);
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toBeUndefined();
    expect(calls).toBe(2);
  });
});
