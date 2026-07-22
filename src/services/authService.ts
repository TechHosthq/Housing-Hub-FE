import apiClient, { API_BASE_URL } from './apiClient';
import { 
    LoginRequest, 
    LoginResponse, 
    RegisterRequest, 
    RegisterResponse, 
    VerifyEmailRequest,
    VerifyEmailResponse,
    ResendOtpRequest,
    ResendOtpResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest, 
    ResetPasswordResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
    GoogleAuthRequest,
    GoogleAuthResponse,
    CustomerType
} from '@/types/auth';

const authService = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await apiClient.post('/api/v1/Auth/register', data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post('/api/v1/Auth/login', data);
        return response.data;
    },

    verifyEmail: async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
        const response = await apiClient.post('/api/v1/Auth/verify-email', data);
        return response.data;
    },

    resendOtp: async (data: ResendOtpRequest): Promise<ResendOtpResponse> => {
        const response = await apiClient.post('/api/v1/Auth/resend-otp', data);
        return response.data;
    },

    forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
        const response = await apiClient.post('/api/v1/Auth/forgot-password', data);
        return response.data;
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        const response = await apiClient.post('/api/v1/Auth/reset-password', data);
        return response.data;
    },

    changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
        const response = await apiClient.post('/api/v1/Auth/change-password', data);
        return response.data;
    },

    /**
     * Exchanges a Google ID token (from Google Identity Services) for a Housing Hub JWT.
     * Handles both sign-in and sign-up — the backend creates the customer on first use.
     */
    googleAuth: async (data: GoogleAuthRequest): Promise<GoogleAuthResponse> => {
        const response = await apiClient.post('/api/v1/Auth/google', data);
        return response.data;
    },

    /**
     * One-time onboarding step for Google accounts (which start as CustomerType.Unset).
     * Returns a fresh JWT — the customer_type claim drives authorization, so the old
     * token must be replaced or the new role won't take effect.
     */
    setAccountType: async (customerType: CustomerType): Promise<LoginResponse> => {
        const response = await apiClient.put('/api/v1/Auth/account-type', { customerType });
        return response.data;
    },

    /**
     * Absolute URL for the optional server-side (redirect) Google flow.
     *
     * NOTE: this must be a full-page navigation (window.location.href) — it returns a
     * 302 to Google's consent screen and cannot be fetched with XHR/axios. It also
     * bypasses the Next.js /api/proxy rewrite on purpose, since the browser itself
     * must follow the redirect chain.
     */
    buildGoogleLoginUrl: (): string => {
        const returnUrl = `${window.location.origin}/auth/google-callback`;
        return `${API_BASE_URL}/api/v1/Auth/google-login?returnUrl=${encodeURIComponent(returnUrl)}`;
    }
};

export default authService;
