import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * Origins the app legitimately talks to. Kept here rather than inline in the CSP
 * string so it is obvious what is allowed and why.
 */
/**
 * Scheme + host + port of a URL, with any path discarded.
 *
 * A CSP source expression may carry a path, and when it does the browser matches
 * on it — a path not ending in `/` matches only that exact path. Since
 * NEXT_PUBLIC_API_BASE_URL is `https://<id>.execute-api.af-south-1.amazonaws.com/dev`,
 * using it verbatim in connect-src permits exactly one URL and refuses every API
 * call beneath it, which shows up as (blocked:csp) on every request.
 *
 * Falls back rather than throwing: a malformed value should degrade the policy,
 * not fail the build.
 */
const toOrigin = (url: string | undefined, fallback: string): string => {
  try {
    return new URL(url ?? fallback).origin;
  } catch {
    return fallback;
  }
};

/**
 * Refuses to build for production without the variables that decide which
 * environment this bundle talks to.
 *
 * These are baked in at build time, so an unset value is not a runtime warning you
 * can fix later — it is a deployed site permanently wired to the wrong backend. The
 * previous fallbacks meant a production deploy that forgot them served dev data to
 * real users and looked entirely healthy doing it.
 *
 * Local development keeps the fallbacks; the friction there buys nothing.
 */
const requiredInProduction = (name: string, value: string | undefined, devFallback: string): string => {
  if (value) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} is not set. Set it on this Vercel environment before building for production.`);
  }
  return devFallback;
};

/*
 * Called for its side effect: refusing to build for production with the API URL
 * unset. The value itself is no longer needed here — the CSP that used it moved to
 * middleware — but the guard is the reason this file knows about the variable at
 * all, and losing it would let a production build ship pointed at dev.
 */
requiredInProduction(
  'NEXT_PUBLIC_API_BASE_URL',
  process.env.NEXT_PUBLIC_API_BASE_URL,
  'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com/dev',
);

/**
 * Origin serving property photos and video.
 *
 * Used in two places that must agree: the CSP (`img-src`/`media-src`) and
 * `images.remotePatterns` below. Getting one right and the other wrong is the
 * likely mistake, and the two failures look different — a wrong remotePattern
 * throws a clear next/image error, while a wrong CSP silently refuses the request
 * and reads as "the images are broken".
 *
 * Derived from a single variable so they cannot drift apart.
 */
const S3_ORIGIN = toOrigin(
  requiredInProduction(
    'NEXT_PUBLIC_S3_ORIGIN',
    process.env.NEXT_PUBLIC_S3_ORIGIN,
    'https://housinghub-files-dev.s3.af-south-1.amazonaws.com',
  ),
  'https://housinghub-files-dev.s3.af-south-1.amazonaws.com',
);

/** Host portion only — next/image's remotePatterns wants a hostname, not an origin. */
const S3_HOSTNAME = new URL(S3_ORIGIN).hostname;

/*
 * The Content Security Policy is NOT here.
 *
 * It lives in src/middleware.ts, built by src/lib/security/csp.ts, because it now
 * carries a per-request nonce so that `'unsafe-inline'` could come out of
 * script-src. A header declared here is static and cannot carry one.
 *
 * SMOKE TEST BEFORE YOU TRUST IT. An enforcing CSP fails closed, and the failure
 * mode is a blank panel or a dead button rather than an error anyone notices in CI.
 * With the console open, walk: sign in with Google, load the homepage and a listing
 * page, play a property video, view the map embed, upload a photo, open messages so
 * SignalR connects. Any `Refused to ...` line is a directive that needs widening.
 */

const securityHeaders = [
  // Content-Security-Policy is set by middleware — see the note above.
  // Two years, matching the preload list's minimum should you ever submit.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Geolocation is allowed for our own origin only — "properties near me" uses it.
  // The rest are unused, and denying them limits what injected script can reach.
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(self), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()',
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  /*
   * There is deliberately no /api/proxy rewrite.
   *
   * It used to forward /api/proxy/:path* to NEXT_PUBLIC_API_BASE_URL/:path*, which
   * made this origin an open, unauthenticated relay into the API for any path and
   * any method. A pen test found it and reported it as an authentication bypass on
   * Property CRUD, which is the right way to read it: nothing about a proxy adds
   * authentication, and the relay let the API be attacked from housinghub.ng rather
   * than from the attacker's own origin — inheriting this domain's reputation and
   * sidestepping anything that reasons about where a request came from.
   *
   * It also silently broke rate limiting. Every request arrived at the API from a
   * Vercel address, so the API's per-IP partition saw one client for the entire
   * internet. Talking to the API directly restores real client addresses.
   *
   * It is not needed. The API sets Cors:AllowedOrigins for this origin with
   * credentials, and the refresh token travels in the request body rather than a
   * cookie, so there is no same-origin requirement to satisfy. Removed outright
   * rather than left behind an environment variable, so it cannot be switched back
   * on without reading this.
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Property/profile photos uploaded to S3 (see S3FileStorageService.UploadFileAsync
        // for the exact URL shape: https://{bucket}.s3.{region}.amazonaws.com/{key}).
        // Shares S3_ORIGIN with the CSP above so the two cannot disagree.
        protocol: 'https',
        hostname: S3_HOSTNAME,
      },
    ],
  },
};

/**
 * Sentry's build-time wrapper: uploads source maps so a stack trace points at
 * `PropertyCard.tsx:42` instead of `main-8f3a.js:1:99213`.
 *
 * Without readable stack traces the events arrive but tell you almost nothing,
 * which is a slow way to discover you have monitoring in name only.
 *
 * Source map upload needs SENTRY_AUTH_TOKEN, SENTRY_ORG and SENTRY_PROJECT at
 * BUILD time (Vercel env vars, not runtime). They are absent locally, so
 * `silent` keeps `npm run build` from printing warnings about it on every dev
 * build. The maps are hidden from the browser afterwards — uploaded to Sentry,
 * not served to users, so the bundle stays unreadable to anyone poking at it.
 */
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: !process.env.CI,
  widenClientFileUpload: true,
  // hideSourceMaps was renamed: this is the same "upload, then delete locally"
  // behavior, just nested under sourcemaps now (and already the default —
  // set explicitly so the intent stays documented here).
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  disableLogger: true,

  /*
   * tunnelRoute is deliberately NOT set.
   *
   * It generates a relay whose destination comes from the `dsn` field of the
   * envelope the client sends. A pen test reported that as server-side request
   * forgery — it reached arbitrary hosts including the AWS instance metadata
   * endpoint — and as an open relay into any Sentry project, unmetered and
   * unauthenticated, from this domain.
   *
   * src/app/monitoring/route.ts serves the same path instead: same purpose (ad
   * blockers drop requests to sentry.io, so reports go through our own origin),
   * but the destination is computed from our own DSN and nothing in the request can
   * influence it. The client is pointed at it by `tunnel` in the Sentry options.
   */
});
