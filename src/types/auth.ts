/**
 * Mirrors HousingHub.Model.Enums.CustomerType on the backend — keep in sync.
 * `Unset` is assigned to accounts created via Google before the user has chosen
 * how they intend to use Housing Hub; it carries no permissions.
 */
export enum CustomerType {
    Unset = 0,
    HouseOwner = 1,
    Agent = 2,
    Customer = 4,
    Admin = 8,
}

export interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    customerType: number;
    dateCreated: string;
}

export interface ApiResponse<T> {
    isSuccessful: boolean;
    data: T;
    message: string | null;
    errors: {
        propertyMessage: string | null;
        errorMessage: string | null;
    }[] | null;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface AuthData extends User {
    token: string | null;
}

export interface LoginRequest {
    emailOrPhone: string | null;
    password: string | null;
}

export type LoginResponse = ApiResponse<AuthData>;

export interface RegisterRequest {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    password: string | null;
    customerType: number;
}

export interface RegisterData {
    id: string;
    dateCreated: string;
    dateModified: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    customerType: number;
    dateOfBirth: string | null;
}

export type RegisterResponse = ApiResponse<RegisterData>;

export interface VerifyEmailRequest {
    email: string | null;
    token: string | null;
}

export type VerifyEmailResponse = ApiResponse<boolean>;

export interface ResendOtpRequest {
    email: string | null;
}

export type ResendOtpResponse = ApiResponse<boolean>;

export interface ForgotPasswordRequest {
    email: string | null;
}

export type ForgotPasswordResponse = ApiResponse<null>;

export interface ResetPasswordRequest {
    email: string | null;
    token: string | null;
    newPassword: string | null;
}

export type ResetPasswordResponse = ApiResponse<boolean>;

export interface ChangePasswordRequest {
    currentPassword: string | null;
    newPassword: string | null;
}

export type ChangePasswordResponse = ApiResponse<boolean>;

export interface GoogleAuthRequest {
    idToken: string | null;
}

export type GoogleAuthResponse = ApiResponse<AuthData>;
