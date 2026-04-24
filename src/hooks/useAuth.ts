import { useMutation, useQuery } from '@tanstack/react-query';
import authService from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { 
    LoginRequest, 
    RegisterRequest, 
    ForgotPasswordRequest, 
    ResetPasswordRequest, 
    VerifyEmailRequest,
    ChangePasswordRequest
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
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        
        register: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,
        registerSuccess: registerMutation.isSuccess && registerMutation.data?.isSuccessful,

        verifyEmail: verifyEmailMutation.mutate,
        isVerifyingEmail: verifyEmailMutation.isPending,

        forgotPassword: forgotPasswordMutation.mutate,
        isSendingForgotEmail: forgotPasswordMutation.isPending,
        forgotPasswordSuccess: forgotPasswordMutation.isSuccess,

        resetPassword: resetPasswordMutation.mutate,
        isResettingPassword: resetPasswordMutation.isPending,
        resetPasswordSuccess: resetPasswordMutation.isSuccess,

        changePassword: changePasswordMutation.mutate,
        isChangingPassword: changePasswordMutation.isPending,

        logout,
    };
};

export const useGoogleAuth = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    const googleAuthMutation = useMutation({
        mutationFn: (idToken: string) => authService.googleAuth({ idToken }),
        onSuccess: (response) => {
            if (response.isSuccessful && response.data.token) {
                const { token, ...user } = response.data;
                setAuth(user, token);
            }
        },
    });

    const getGoogleLoginUrlQuery = useQuery({
        queryKey: ['google-login-url'],
        queryFn: () => authService.getGoogleLoginUrl(),
        enabled: false, // Manual trigger
    });

    return {
        googleAuth: googleAuthMutation.mutate,
        isGoogleAuthing: googleAuthMutation.isPending,
        getGoogleLoginUrl: getGoogleLoginUrlQuery.refetch,
    };
};
