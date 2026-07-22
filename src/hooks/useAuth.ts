import { useMutation } from '@tanstack/react-query';
import authService from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { 
    LoginRequest, 
    RegisterRequest, 
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    ResendOtpRequest,
    ChangePasswordRequest,
    CustomerType
} from '@/types/auth';

export const useAuth = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const loginMutation = useMutation({
        mutationFn: (data: LoginRequest) => authService.login(data),
        onSuccess: (response) => {
            if (response.isSuccessful && response.data.token) {
                const { token, ...user } = response.data;
                setAuth(user, token);
            }
        },
    });

    const registerMutation = useMutation({
        mutationFn: (data: RegisterRequest) => authService.register(data),
    });

    const verifyEmailMutation = useMutation({
        mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
    });

    const resendOtpMutation = useMutation({
        mutationFn: (data: ResendOtpRequest) => authService.resendOtp(data),
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    });

    const resetPasswordMutation = useMutation({
        mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    });

    const changePasswordMutation = useMutation({
        mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
    });

    const logout = () => {
        clearAuth();
    };

    return {
        user: useAuthStore((state) => state.user),
        isAuthenticated: useAuthStore((state) => state.isAuthenticated),
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        
        register: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,
        registerSuccess: registerMutation.isSuccess && registerMutation.data?.isSuccessful,

        verifyEmail: verifyEmailMutation.mutate,
        isVerifyingEmail: verifyEmailMutation.isPending,

        resendOtp: resendOtpMutation.mutate,
        isResendingOtp: resendOtpMutation.isPending,
        resendOtpSuccess: resendOtpMutation.isSuccess,
        resendOtpMessage: resendOtpMutation.data?.message ?? null,

        forgotPassword: forgotPasswordMutation.mutate,
        isSendingForgotEmail: forgotPasswordMutation.isPending,
        forgotPasswordSuccess: forgotPasswordMutation.isSuccess,
        forgotPasswordMessage: forgotPasswordMutation.data?.message ?? null,

        resetPassword: resetPasswordMutation.mutate,
        isResettingPassword: resetPasswordMutation.isPending,
        resetPasswordSuccess: resetPasswordMutation.isSuccess,

        changePassword: changePasswordMutation.mutate,
        isChangingPassword: changePasswordMutation.isPending,

        logout,
    };
};

/**
 * Google sign-in / sign-up.
 *
 * Uses the ID-token flow: the browser obtains a Google ID token via Google
 * Identity Services and we exchange it at POST /api/v1/Auth/google for our JWT.
 * Sign-in and sign-up are the same call — the backend creates the customer on
 * first use.
 */
export const useGoogleAuth = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    const googleAuthMutation = useMutation({
        mutationFn: (idToken: string) => authService.googleAuth({ idToken }),
        onSuccess: (response) => {
            if (response.isSuccessful && response.data?.token) {
                const { token, ...user } = response.data;
                setAuth(user, token);
            }
        },
        // Failures (HTTP errors and isSuccessful:false) are surfaced by the
        // apiClient response interceptor, which already shows a toast for POSTs.
    });

    return {
        signInWithGoogle: googleAuthMutation.mutate,
        isGoogleAuthing: googleAuthMutation.isPending,
        googleAuthError: googleAuthMutation.error,
    };
};

/**
 * One-time onboarding step: assigns the account type for Google accounts, which are
 * created as CustomerType.Unset. The backend returns a new JWT carrying the updated
 * customer_type claim, so we must replace the stored token — otherwise the new role
 * won't be honoured by the API.
 */
export const useAccountType = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    const setAccountTypeMutation = useMutation({
        mutationFn: (customerType: CustomerType) => authService.setAccountType(customerType),
        onSuccess: (response) => {
            if (response.isSuccessful && response.data?.token) {
                const { token, ...user } = response.data;
                setAuth(user, token);
            }
        },
    });

    return {
        setAccountType: setAccountTypeMutation.mutateAsync,
        isSettingAccountType: setAccountTypeMutation.isPending,
    };
};
