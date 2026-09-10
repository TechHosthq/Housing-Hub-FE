import { NextRequest } from 'next/server';

/**
 * Sentry tunnel — a deliberately narrow one.
 *
 * Browser error reports are posted here and relayed to Sentry from the server, so
 * ad blockers (which block sentry.io by default) do not silently turn monitoring
 * off. That is the only reason this endpoint exists.
 *
 * It replaces `tunnelRoute: '/monitoring'`, the generic route the Sentry SDK
 * generates. A pen test reported that route as server-side request forgery: the
 * destination is taken from the `dsn` field of the envelope the *client* sends, and
 * it reached arbitrary hosts including the AWS instance metadata endpoint. The same
 * property made it an open relay — anyone could push events into any Sentry project
 * through this domain, unmetered.
 *
 * Everything below follows from one rule: **the destination is ours, computed from
 * our own configured DSN, and nothing in the request can influence it.** The DSN in
 * the envelope is only ever compared against ours, never followed.
 *
 * What this cannot fix: the DSN is public by design — it ships in the browser
 * bundle — so anyone can post events to our Sentry project, here or directly to
 * sentry.io. Rate limiting and the size cap below make that tedious rather than
 * free, but the events themselves are attacker-controllable and must be read as
 * untrusted data in the Sentry UI. That is true of every client-side error
 * reporter and is not something a relay can change.
 */

/**
 * Requests per window, per address. A browser reports a handful of errors per
 * session; a hundred is generous for a real client and useless for flooding.
 */
const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW_MS = 60_000;

/**
 * Envelopes are a few kilobytes. Sentry's own ingest limit is 100KB for the
 * envelope endpoint, so anything larger would be rejected upstream anyway — better
 * to refuse it before it occupies a serverless function's memory.
 */
const MAX_BODY_BYTES = 100 * 1024;

/**
 * In-memory, per-instance, and that is understood.
 *
 * Serverless means several instances and no shared state, so the real ceiling is
 * this multiplied by however many are warm. It is a speed bump against a script,
 * not a control against a distributed flood — the durable answer for that is a
 * WAF rule in front of the origin. Worth having anyway: it turns an unbounded
 * relay into a bounded one, which is the finding.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

const isRateLimited = (key: string): boolean => {
  const now = Date.now();
  const existing = hits.get(key);

  if (!existing || now > existing.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });

    // Bounded sweep of expired keys, so a stream of unique addresses cannot grow
    // this map without limit. Cheap because it only runs when a window rolls over.
    if (hits.size > 10_000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }

    return false;
  }

  existing.count += 1;
  return existing.count > RATE_LIMIT_MAX;
};

/**
 * The one destination this route will ever talk to, derived from our own DSN.
 *
 * Parsed once at module load and never from a request. A DSN looks like
 * `https://<publicKey>@o<org>.ingest.sentry.io/<projectId>`, and the envelope
 * endpoint for it is `<origin>/api/<projectId>/envelope/`.
 */
const upstream = (() => {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return null;

  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\//, '');
    if (!projectId) return null;

    // Only ever https, and only ever the host our own DSN names.
    if (url.protocol !== 'https:') return null;

    return {
      projectId,
      host: url.host,
      envelopeUrl: `https://${url.host}/api/${projectId}/envelope/`,
    };
  } catch {
    return null;
  }
})();

export async function POST(request: NextRequest) {
  // No detail in any response body. The pen test noted that both our own
  // validation messages and Sentry's upstream errors were being handed back, which
  // described the relay's internals (and its parser) to an unauthenticated caller.
  // A status code is all a browser transport needs.
  if (!upstream) return new Response(null, { status: 204 });

  const forwarded = request.headers.get('x-forwarded-for');
  const address = forwarded?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(address)) return new Response(null, { status: 429 });

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (declaredLength > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  let body: string;
  try {
    body = await request.text();
  } catch {
    return new Response(null, { status: 400 });
  }

  // Checked again after reading: content-length is client-supplied and a chunked
  // request need not send one at all.
  if (body.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });

  // An envelope is newline-delimited JSON whose first line is the header. The only
  // thing we take from it is the DSN, and only to compare.
  const header = body.slice(0, body.indexOf('\n') === -1 ? body.length : body.indexOf('\n'));

  let envelopeDsn: string | undefined;
  try {
    envelopeDsn = (JSON.parse(header) as { dsn?: string }).dsn;
  } catch {
    return new Response(null, { status: 400 });
  }

  if (!envelopeDsn) return new Response(null, { status: 400 });

  let claimed: URL;
  try {
    claimed = new URL(envelopeDsn);
  } catch {
    return new Response(null, { status: 400 });
  }

  // Host and project must both be ours. This is the check that turns the SSRF off:
  // a mismatch is refused rather than followed, and the URL we then post to is
  // built from our own DSN regardless of what the envelope said.
  if (
    claimed.host !== upstream.host ||
    claimed.pathname.replace(/^\//, '') !== upstream.projectId
  ) {
    return new Response(null, { status: 400 });
  }

  try {
    const response = await fetch(upstream.envelopeUrl, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-sentry-envelope' },
      // A hanging upstream must not hold a function open.
      signal: AbortSignal.timeout(5_000),
    });

    // Upstream's status is echoed, its body is not. Sentry's ingest errors name
    // its own parser implementation, which is not ours to disclose.
    return new Response(null, { status: response.ok ? 200 : 502 });
  } catch {
    return new Response(null, { status: 502 });
  }
}

/**
 * Anything other than POST is not a transport request.
 *
 * Answered with 405 rather than left to Next's default so a probe learns nothing
 * beyond the method being wrong.
 */
export async function GET() {
  return new Response(null, { status: 405 });
}
