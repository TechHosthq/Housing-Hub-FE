'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

/**
 * Catches render errors that escape every other boundary.
 *
 * Next.js replaces the entire document when this renders — the root layout is
 * gone, so this file must supply its own `<html>` and `<body>` and cannot rely on
 * providers, fonts or global styles being present. That is why the styling here is
 * inline rather than Tailwind classes: at this point the stylesheet may not have
 * loaded, and a broken page that also looks broken is worse than a plain one.
 *
 * This is the last place an error can be captured before the user sees a white
 * screen and leaves. During a beta, that user does not file a bug report — so
 * without this, the most severe class of failure is also the most invisible.
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '1.5rem',
          margin: 0,
          background: '#ffffff',
          color: '#1A1A1A',
        }}
      >
        <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#666', marginBottom: '1.75rem' }}>
            Sorry — that page failed to load. The problem has been reported to our
            team automatically. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: '#0B2545',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              padding: '0.875rem 2rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reload page
          </button>

          {/* The digest is what ties this user's report to the event in Sentry.
              Worth showing — a beta tester quoting it saves a long search. */}
          {error.digest && (
            <p style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: '#aaa' }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
