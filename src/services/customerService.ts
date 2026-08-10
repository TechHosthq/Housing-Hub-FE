import apiClient from './apiClient';
import {
    CustomerResponse,
    UpdateProfileRequest,
    SubmitKycRequest,
    KycResponse,
    DocumentUploadResponse,
    ApiResponse,
    AddressResponse,
    AddressRequest
} from '@/types/customer';

/**
 * Consumer-app customer API.
 *
 * Administrative operations (listing all customers, approving KYC, deleting
 * accounts) deliberately live only in the separate admin application. They are
 * not exposed here so they cannot be called from a consumer session.
 */
const customerService = {
    getCustomer: async (id: string): Promise<CustomerResponse> => {
        const response = await apiClient.get(`/api/v1/Customer/${id}`);
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<CustomerResponse> => {
        const response = await apiClient.put('/api/v1/Customer/profile', data);
        return response.data;
    },

    /**
     * Short-lived viewing link for the signed-in user's own KYC document.
     *
     * The document lives behind a private bucket prefix, so `idDocumentUrl` is an
     * opaque object key and cannot be rendered directly. Fetched on demand rather
     * than on page load so the ten-minute link isn't half spent before use.
     */
    getMyKycDocumentUrl: async (): Promise<ApiResponse<string>> => {
        const response = await apiClient.get('/api/v1/Customer/me/kyc/document-url');
        return response.data;
    },

    submitKyc: async (data: SubmitKycRequest): Promise<KycResponse> => {
        const response = await apiClient.post('/api/v1/Customer/kyc', data);
        return response.data;
    },

    uploadKycDocument: async (file: File): Promise<DocumentUploadResponse> => {
        const formData = new FormData();
        formData.append('File', file);
        const response = await apiClient.post('/api/v1/Customer/kyc/document', formData);
        return response.data;
    },

    // Returns the stored image URL (ApiResponse<string>).
    uploadProfilePhoto: async (file: File): Promise<ApiResponse<string | null>> => {
        const formData = new FormData();
        formData.append('File', file);
        const response = await apiClient.post('/api/v1/Customer/profile/photo', formData);
        return response.data;
    },

    removeProfilePhoto: async (): Promise<ApiResponse<string | null>> => {
        const response = await apiClient.delete('/api/v1/Customer/profile/photo');
        return response.data;
    },

    // Address Endpoints
    getMyAddress: async (): Promise<AddressResponse> => {
        const response = await apiClient.get('/api/v1/CustomerAddress/my');
        return response.data;
    },

    getAddressById: async (id: string): Promise<AddressResponse> => {
        const response = await apiClient.get(`/api/v1/CustomerAddress/${id}`);
        return response.data;
    },

    updateAddress: async (data: AddressRequest): Promise<AddressResponse> => {
        const response = await apiClient.post('/api/v1/CustomerAddress', data);
        return response.data;
    }
};

export default customerService;
