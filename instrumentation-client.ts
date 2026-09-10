import * as Sentry from '@sentry/nextjs';
import { BROWSER_TUNNEL_PATH, sharedOptions } from '@/lib/sentry/options';

/**
 * Browser-side Sentry. Runs before the app becomes interactive.
 *
 * Deliberately minimal for the free plan. No Session Replay: it is metered
 * separately (50 replays/month), and more importantly it records the DOM — which
 * on this product means capturing a KYC upload screen or a national ID number as
 * it is typed. Not worth it for a beta.
 */
Sentry.init({
  ...sharedOptions,

  // Through our own origin rather than straight to sentry.io, which ad blockers
  // drop by default. See src/app/monitoring/route.ts.
  tunnel: BROWSER_TUNNEL_PATH,

  // Client-side errors are the ones a beta tester will never report, so sample
  // all of them. The ignore list in options.ts is what keeps this affordable.
  sampleRate: 1.0,
});

/** Lets Sentry tie an error to the navigation that led to it. */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
