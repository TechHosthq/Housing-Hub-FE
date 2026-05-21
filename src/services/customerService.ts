import apiClient from './apiClient';
import { 
    CustomerResponse, 
    CustomersResponse, 
    UpdateProfileRequest, 
    CreateCustomerRequest,
    SubmitKycRequest, 
    KycResponse,
    DocumentUploadResponse,
    ApiResponse,
    AddressResponse,
    AddressRequest
} from '@/types/customer';

const customerService = {
    getCustomer: async (id: string): Promise<CustomerResponse> => {
        const response = await apiClient.get(`/api/v1/Customer/${id}`);
        return response.data;
    },

    getAllCustomers: async (pageNumber: number = 1, pageSize: number = 20): Promise<CustomersResponse> => {
        const response = await apiClient.get('/api/v1/Customer/all', {
            params: { pageNumber, pageSize }
        });
        return response.data;
    },

    createCustomer: async (data: CreateCustomerRequest): Promise<CustomerResponse> => {
        const response = await apiClient.post('/api/v1/Customer', data);
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<CustomerResponse> => {
        const response = await apiClient.put('/api/v1/Customer/profile', data);
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

    verifyKyc: async (id: string, approve: boolean): Promise<KycResponse> => {
        const response = await apiClient.put(`/api/v1/Customer/${id}/kyc/verify?approve=${approve}`);
        return response.data;
    },

    deleteCustomer: async (id: string): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.delete(`/api/v1/Customer/${id}`);
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
