'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

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

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || 
                             PUBLIC_ROUTE_PATTERNS.some(pattern => pattern.test(pathname));

        if (!isPublicRoute && !isAuthenticated) {
            router.push('/login');
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, pathname, router]);

    if (isChecking) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
                <div className="w-12 h-12 border-4 border-primary-dark border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
