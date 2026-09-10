/**
 * The Content Security Policy, built per request so it can carry a nonce.
 *
 * Shared by `middleware.ts`, which sets the header, and `next.config.ts`, which
 * owns every other security header. One definition, because a policy that differs
 * between two files fails in the way an enforcing CSP always fails: silently, as a
 * blank panel or a dead button rather than an error anyone notices.
 */

/**
 * Scheme + host + port of a URL, with any path discarded.
 *
 * A CSP source expression may carry a path, and when it does the browser matches on
 * it — a path not ending in `/` matches only that exact path. Since
 * NEXT_PUBLIC_API_BASE_URL ends in `/dev`, using it verbatim in connect-src permits
 * exactly one URL and refuses every API call beneath it.
 *
 * Falls back rather than throwing. This runs in middleware on every request, so a
 * malformed value must degrade the policy, not 500 the site. The build-time guard
 * in next.config.ts is what refuses to ship with these unset.
 */
const toOrigin = (url: string | undefined, fallback: string): string => {
  try {
    return new URL(url ?? fallback).origin;
  } catch {
    return fallback;
  }
};

const DEV_API_ORIGIN = 'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com';
const DEV_S3_ORIGIN = 'https://housinghub-files-dev.s3.af-south-1.amazonaws.com';

export const API_ORIGIN = toOrigin(process.env.NEXT_PUBLIC_API_BASE_URL, DEV_API_ORIGIN);

/** SignalR upgrades to a WebSocket against the same host. */
const API_WS_ORIGIN = API_ORIGIN.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:');

export const S3_ORIGIN = toOrigin(process.env.NEXT_PUBLIC_S3_ORIGIN, DEV_S3_ORIGIN);

/**
 * Sentry's ingest endpoint, derived from the DSN.
 *
 * Only needed as a fallback: browser reports go through our own /monitoring route,
 * which is same-origin. Kept because the SDK falls back to a direct send in some
 * transport failures, and a refused error report is invisible in the worst possible
 * way — monitoring that looks installed, reports nothing, and leaves you believing
 * there are no errors.
 */
const SENTRY_ORIGIN = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? toOrigin(process.env.NEXT_PUBLIC_SENTRY_DSN, '')
  : '';

/**
 * Builds the policy.
 *
 * @param nonce Per-request nonce. When present, `script-src` carries it **instead
 * of** `'unsafe-inline'`, which is the entire point of this function existing.
 *
 * Why a nonce rather than just dropping `'unsafe-inline'`: Next.js streams the RSC
 * payload through inline `<script>` tags, so the framework itself does not work
 * without either. A nonce allows exactly the scripts we emit and nothing an
 * injection manages to add.
 *
 * Deliberately **not** `'strict-dynamic'`. It would let any script loaded by a
 * nonced script run, which sounds stricter but makes the browser ignore host
 * allowlists — and Google Sign-In is allowed by host here, so adding it would
 * silently break sign-in while appearing to tighten the policy.
 */
export const buildContentSecurityPolicy = (nonce: string | null): string => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const scriptSrc = [
    "'self'",
    nonce ? `'nonce-${nonce}'` : "'unsafe-inline'",
    // The dev overlay evals. Never in a production policy.
    isDevelopment ? "'unsafe-eval'" : '',
    'https://accounts.google.com',
  ].filter(Boolean).join(' ');

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,

    // Still 'unsafe-inline', and that is a considered difference from script-src.
    // Tailwind and next/font inject style elements, styled content cannot carry a
    // nonce through every path that emits it, and injected CSS buys an attacker
    // exfiltration tricks rather than execution. Worth revisiting, not worth
    // blocking this change on.
    "style-src 'self' 'unsafe-inline'",

    // next/font/google self-hosts at build time, so no external font origin.
    "font-src 'self' data:",
    `img-src 'self' data: blob: https://images.unsplash.com ${S3_ORIGIN}`,

    // Listings can carry video, served from the same bucket as the photos. Without
    // this they fall through to default-src and every video on the site stops
    // playing. blob: covers the local preview shown before an upload completes.
    `media-src 'self' blob: ${S3_ORIGIN}`,

    `connect-src 'self' ${API_ORIGIN} ${API_WS_ORIGIN} https://accounts.google.com ${SENTRY_ORIGIN}`.trim(),

    // Google Sign-In renders in an iframe; property pages embed a Maps iframe.
    "frame-src 'self' https://accounts.google.com https://www.google.com",

    // Clickjacking. Also X-Frame-Options in next.config for older browsers.
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "worker-src 'self' blob:",
    'upgrade-insecure-requests',
  ].filter(Boolean).join('; ');
};

/**
 * A fresh nonce.
 *
 * `crypto.getRandomValues` rather than `Buffer`: this runs in the Edge runtime,
 * where Node's Buffer is not guaranteed to exist.
 */
export const createNonce = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
};
