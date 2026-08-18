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

const API_ORIGIN = toOrigin(
  requiredInProduction(
    'NEXT_PUBLIC_API_BASE_URL',
    process.env.NEXT_PUBLIC_API_BASE_URL,
    'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com/dev',
  ),
  'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com',
);

/**
 * Sentry's ingest endpoint, derived from the DSN.
 *
 * The CSP is enforcing, so without this every error report is refused by the
 * browser — and the failure is invisible in the worst possible way: monitoring
 * that looks installed, reports nothing, and leaves you believing there are no
 * errors. Derived from the DSN rather than hardcoded because the ingest host
 * encodes the org id and the region (`o123.ingest.de.sentry.io`), which differ
 * per account.
 *
 * Empty string when no DSN is set, and filtered out of the directive below.
 */
const SENTRY_ORIGIN = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? toOrigin(process.env.NEXT_PUBLIC_SENTRY_DSN, '')
  : '';

// SignalR upgrades to a WebSocket against the same host.
const API_WS_ORIGIN = API_ORIGIN.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:');

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

/**
 * Content Security Policy.
 *
 * NOW ENFORCING. It shipped Report-Only first so violations could be observed
 * without breaking anything; this switches it on.
 *
 * SMOKE TEST BEFORE YOU TRUST IT. An enforcing CSP fails closed, and the failure
 * mode is a blank panel or a dead button rather than an error anyone notices in
 * CI. With the console open, walk: sign in with Google, load the homepage and a
 * listing page, play a property video, view the map embed, upload a photo, open
 * messages so SignalR connects. Any `Refused to ...` line in the console is a
 * directive that needs widening.
 *
 * Known weakness: script-src includes 'unsafe-inline'. Next.js emits inline
 * bootstrap scripts, and layout.tsx has an inline script that sets the dark-mode
 * class before first paint to avoid a flash. Removing 'unsafe-inline' requires
 * per-request nonces via middleware, which is worth doing but is its own change.
 * Until then this policy stops content injection from loading external resources,
 * but not from executing inline script it has managed to inject.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' — see note above. 'unsafe-eval' is needed by the dev overlay only.
  `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''} https://accounts.google.com`,
  // Tailwind and next/font inject inline styles.
  "style-src 'self' 'unsafe-inline'",
  // next/font/google self-hosts at build time, so no external font origin is needed.
  "font-src 'self' data:",
  `img-src 'self' data: blob: https://images.unsplash.com ${S3_ORIGIN}`,
  // Listings can carry video (.mp4/.avi/.mov), served from the same bucket as the
  // photos. Without this they fall through to default-src and every video on the
  // site stops playing — the one break that enforcing this policy would otherwise
  // have caused. blob: covers the local preview shown before an upload completes.
  `media-src 'self' blob: ${S3_ORIGIN}`,
  `connect-src 'self' ${API_ORIGIN} ${API_WS_ORIGIN} https://accounts.google.com ${SENTRY_ORIGIN}`.trim(),
  // Google Sign-In renders in an iframe; property pages embed a Maps iframe.
  "frame-src 'self' https://accounts.google.com https://www.google.com",
  // Clickjacking protection. Also set as X-Frame-Options below for older browsers.
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // Next.js loads some chunks through blob: workers depending on the build.
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].filter(Boolean).join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
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
  async rewrites() {
    if (process.env.NEXT_PUBLIC_ENABLE_PROXY !== 'true') {
      return [];
    }
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
    ];
  },
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

  // Routes browser error reports through our own origin so ad blockers, which
  // block requests to sentry.io by default, do not silently drop them. This is
  // also why SENTRY_ORIGIN in the CSP is a belt-and-braces measure rather than
  // the only thing making reporting work.
  tunnelRoute: '/monitoring',
});
