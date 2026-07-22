import { resolveApiError } from './errorResolver';

export interface GoogleAuthErrorInfo {
    message: string;
    /** True when the email already exists as an email/password account. */
    suggestPasswordLogin: boolean;
}

/**
 * Turns a Google sign-in failure into copy the user can act on.
 *
 * An existing email/password account is no longer a failure — the backend links the
 * Google identity onto it, so both methods reach the same user. What remains is the
 * case where Google hasn't verified the address, which we refuse to link (it would
 * allow account takeover). There, the password form is the way in.
 */
export const resolveGoogleAuthError = (error: unknown): GoogleAuthErrorInfo | null => {
    if (!error) return null;

    // The apiClient rejects with the raw response for isSuccessful:false payloads,
    // and with an axios error for HTTP failures — normalise both.
    const hasData = typeof error === 'object' && error !== null && 'data' in error;
    const messages = resolveApiError(hasData ? { response: error } : error);
    const combined = messages.join(' ');

    if (/hasn't verified this email|has not verified this email/i.test(combined)) {
        return {
            message:
                "Google hasn't verified this email address, so we can't link it to your Housing Hub account. Verify it with Google, or log in with your email and password.",
            suggestPasswordLogin: true,
        };
    }

    return {
        message: messages[0] || 'Google sign-in failed. Please try again.',
        suggestPasswordLogin: false,
    };
};
