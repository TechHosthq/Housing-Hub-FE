import { resolveApiError } from './errorResolver';

export interface GoogleAuthErrorInfo {
    message: string;
    /** True when the email already exists as an email/password account. */
    suggestPasswordLogin: boolean;
}

/**
 * Turns a Google sign-in failure into copy the user can act on.
 *
 * The backend rejects a Google attempt on an email/password account with
 * "This account uses email/password sign-in..." — surfaced inline with a nudge
 * toward the password form rather than as an anonymous toast.
 */
export const resolveGoogleAuthError = (error: unknown): GoogleAuthErrorInfo | null => {
    if (!error) return null;

    // The apiClient rejects with the raw response for isSuccessful:false payloads,
    // and with an axios error for HTTP failures — normalise both.
    const hasData = typeof error === 'object' && error !== null && 'data' in error;
    const messages = resolveApiError(hasData ? { response: error } : error);
    const combined = messages.join(' ');

    if (/email\/password sign-in/i.test(combined)) {
        return {
            message:
                'This email is already registered with a password. Log in with your email and password instead.',
            suggestPasswordLogin: true,
        };
    }

    return {
        message: messages[0] || 'Google sign-in failed. Please try again.',
        suggestPasswordLogin: false,
    };
};
