'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useHasHydrated } from '@/hooks/useHasHydrated';

// Routes that don't require authentication.
// Anonymous visitors can browse listings to get a feel for the marketplace; anything
// tied to an account (profile, inspections, messages, owner listings) stays private.
//
// NOTE: '/properties' is the OWNER's "my listings" page and must stay private —
// browsing happens on '/' and '/property/[id]'.
const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/create-new-password',
    '/verify-email',
    '/list-properties',
    '/faq',
    '/privacy',
];

// Patterns for dynamic public routes (e.g., /property/123).
// Deliberately excludes /property/[id]/inspection — booking requires an account.
const PUBLIC_ROUTE_PATTERNS = [
    /^\/property\/[^/]+$/,
    /^\/api\/seed.*$/,
];

const Spinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <div className="w-12 h-12 border-4 border-primary-dark border-t-transparent rounded-full animate-spin"></div>
    </div>
);

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasHydrated = useHasHydrated();
    const router = useRouter();
    const pathname = usePathname();

    const isPublicRoute = useMemo(
        () =>
            PUBLIC_ROUTES.includes(pathname) ||
            PUBLIC_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname)),
        [pathname]
    );

    useEffect(() => {
        // Wait for the persisted token to be restored before deciding. Without this
        // the store is still empty on first render, so refreshing any protected page
        // bounced a signed-in user to /login.
        if (!hasHydrated) return;

        if (!isPublicRoute && !isAuthenticated) {
            // Send them back where they were headed once they sign in.
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [hasHydrated, isPublicRoute, isAuthenticated, pathname, router]);

    if (!hasHydrated) return <Spinner />;

    // Redirect is in flight — don't flash protected content.
    if (!isPublicRoute && !isAuthenticated) return <Spinner />;

    return <>{children}</>;
}
