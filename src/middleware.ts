import { NextRequest, NextResponse } from 'next/server';
import { buildContentSecurityPolicy, createNonce } from '@/lib/security/csp';

/**
 * Sets the Content Security Policy, with a fresh nonce per request.
 *
 * This exists to get `'unsafe-inline'` out of `script-src`. With it, a CSP stops
 * injected content from *loading* anything external but not from *executing* inline
 * script it managed to inject — which, on an app that keeps a session token in
 * localStorage, is the whole attack. A nonce allows exactly the scripts we emit.
 *
 * Two headers are set, and both matter:
 *
 *   - on the **request**, so Next.js finds the policy and stamps its own streaming
 *     scripts with the nonce. Without this the framework's inline scripts are
 *     refused and nothing renders.
 *   - on the **response**, so the browser enforces it.
 *
 * `x-nonce` is how the root layout reaches the same value for our own inline theme
 * script.
 *
 * **The cost:** reading a header in the root layout opts every route into dynamic
 * rendering, so the statically generated pages (terms, privacy, FAQ) are now
 * rendered per request. That is the accepted price — a nonce is per response, and a
 * cached HTML document cannot carry one that matches a fresh header. These pages are
 * cheap to render and the data-heavy routes were already dynamic.
 */
export function middleware(request: NextRequest) {
  const nonce = createNonce();
  const csp = buildContentSecurityPolicy(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  /*
   * Documents only.
   *
   * Static assets and images are not documents and cannot execute script, so a
   * policy on them buys nothing and running middleware for every chunk costs on
   * every page load. `/monitoring` is excluded because it is a machine-to-machine
   * relay for Sentry envelopes — it returns no HTML, and running this on it would
   * add a header to every error report for no reason.
   *
   * Anything matched here gets the policy; anything not matched gets no CSP, which
   * is why the pattern excludes by kind rather than listing routes. A new page is
   * covered automatically.
   */
  matcher: [
    '/((?!_next/static|_next/image|monitoring|favicon.ico|icon.png|apple-icon.png|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp4|webm|woff|woff2|ttf|txt|xml|json)$).*)',
  ],
};
