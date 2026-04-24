import apiClient from './apiClient';
import { 
    LoginRequest, 
    LoginResponse, 
    RegisterRequest, 
    RegisterResponse, 
    VerifyEmailRequest, 
    VerifyEmailResponse,
    ForgotPasswordRequest, 
    ForgotPasswordResponse,
    ResetPasswordRequest, 
    ResetPasswordResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
    GoogleAuthRequest,
    GoogleAuthResponse
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

    googleAuth: async (data: GoogleAuthRequest): Promise<GoogleAuthResponse> => {
        const response = await apiClient.post('/api/v1/Auth/google', data);
        return response.data;
    },

    getGoogleLoginUrl: async (returnUrl: string = ''): Promise<{ url: string }> => {
        // Based on the curl provided, it seems it might be a direct redirect or return a URL
        // If it's a GET request that returns a URL:
        const response = await apiClient.get(`/api/v1/Auth/google-login?returnUrl=${returnUrl}`);
        return response.data;
    },

    handleGoogleCallback: async (code: string): Promise<GoogleAuthResponse> => {
        const response = await apiClient.get(`/api/v1/Auth/google-callback?code=${code}`);
        return response.data;
    }
};

export default authService;
