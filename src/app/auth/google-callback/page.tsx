'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import authService from '@/services/authService';
import { Loader2 } from 'lucide-react';

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            if (code) {
                try {
                    const response = await authService.handleGoogleCallback(code);
                    if (response.isSuccessful && response.data.token) {
                        const { token, ...user } = response.data;
                        setAuth(user, token);
                        router.push('/dashboard');
                    } else {
                        router.push('/login?error=google_login_failed');
                    }
                } catch (error) {
                    console.error('Google login failed:', error);
                    router.push('/login?error=google_login_failed');
                }
            } else {
                router.push('/login');
            }
        };

        handleCallback();
    }, [searchParams, router, setAuth]);

    return (
        <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary-dark mx-auto" />
            <p className="text-lg font-medium text-gray-700">Completing login...</p>
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
