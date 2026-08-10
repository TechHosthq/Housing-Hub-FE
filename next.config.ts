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
 * Shipped in Report-Only first — an enforcing CSP that is even slightly wrong takes
 * the app down, and there is no way to be certain from source alone that every
 * runtime request is covered. Watch the violation reports in the browser console,
 * then rename the header to `Content-Security-Policy` to enforce.
 *
 * Known weakness: script-src includes 'unsafe-inline'. Next.js emits inline
 * bootstrap scripts, and layout.tsx has an inline script that sets the dark-mode
 * class before first paint to avoid a flash. Removing 'unsafe-inline' requires
 * per-request nonces via middleware, which is worth doing but is its own change.
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
  `connect-src 'self' ${API_ORIGIN} ${API_WS_ORIGIN} https://accounts.google.com`,
  // Google Sign-In renders in an iframe; property pages embed a Maps iframe.
  "frame-src 'self' https://accounts.google.com https://www.google.com",
  // Clickjacking protection. Also set as X-Frame-Options below for older browsers.
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].filter(Boolean).join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy },
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
