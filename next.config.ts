import type { NextConfig } from "next";

/**
 * Origins the app legitimately talks to. Kept here rather than inline in the CSP
 * string so it is obvious what is allowed and why.
 */
const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://pk1wr06fr1.execute-api.af-south-1.amazonaws.com';

// SignalR upgrades to a WebSocket against the same host.
const API_WS_ORIGIN = API_ORIGIN.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:');

const S3_ORIGIN = 'https://housinghub-files-dev.s3.af-south-1.amazonaws.com';

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
  `connect-src 'self' ${API_ORIGIN} ${API_WS_ORIGIN} https://accounts.google.com`,
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
        protocol: 'https',
        hostname: 'housinghub-files-dev.s3.af-south-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
