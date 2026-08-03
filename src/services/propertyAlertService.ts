import apiClient from './apiClient';
import { ApiResponse } from '@/types/auth';
import {
    CreatePropertyAlertPreferenceRequest,
    PropertyAlertPreferenceResponse,
    PropertyAlertPreferencesResponse
} from '@/types/propertyAlert';

const propertyAlertService = {
    getMine: async (): Promise<PropertyAlertPreferencesResponse> => {
        const response = await apiClient.get('/api/v1/PropertyAlert');
        return response.data;
    },

    create: async (data: CreatePropertyAlertPreferenceRequest): Promise<PropertyAlertPreferenceResponse> => {
        const response = await apiClient.post('/api/v1/PropertyAlert', data);
        return response.data;
    },

    remove: async (id: string): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.delete(`/api/v1/PropertyAlert/${id}`);
        return response.data;
    }
};

export default propertyAlertService;
