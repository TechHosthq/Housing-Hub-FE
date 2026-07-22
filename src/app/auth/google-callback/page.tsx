'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';
import { postAuthRoute } from '@/utils/authRouting';

/**
 * Landing page for the optional server-side Google flow.
 *
 * The backend (GET /api/v1/Auth/google-callback) completes the OAuth exchange and
 * redirects here with either `?token=<jwt>` or `?error=<code>`.
 *
 * The primary sign-in path is the ID-token flow on the login/register forms, which
 * never reaches this page.
 */
function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            router.replace(`/login?error=${encodeURIComponent(error)}`);
            return;
        }

        if (!token) {
            router.replace('/login');
            return;
        }

        try {
            // The JWT payload carries the customer claims we need for the store.
            const payload = JSON.parse(
                atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
            );

            const customerType = Number(payload.customer_type ?? 0);

            setAuth(
                {
                    id: payload.sub ?? payload.nameid ?? '',
                    firstName: payload.given_name ?? null,
                    lastName: payload.family_name ?? null,
                    email: payload.email ?? null,
                    phoneNumber: payload.phone_number ?? null,
                    customerType,
                    dateCreated: new Date().toISOString(),
                },
                token
            );

            router.replace(postAuthRoute(customerType));
        } catch {
            router.replace('/login?error=google_token_invalid');
        }
    }, [searchParams, router, setAuth]);

    return (
        <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary-dark mx-auto" />
            <p className="text-lg font-medium text-gray-700">Completing sign-in...</p>
        </div>
    );
}

export default function GoogleCallbackPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Suspense fallback={
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary-dark mx-auto" />
                    <p className="text-lg font-medium text-gray-700">Loading...</p>
                </div>
            }>
                <CallbackHandler />
            </Suspense>
        </div>
    );
}
