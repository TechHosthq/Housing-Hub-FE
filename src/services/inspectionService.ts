import apiClient from './apiClient';
import { 
    InspectionResponse, 
    InspectionsResponse, 
    CreateInspectionRequest,
    RespondToInspectionRequest,
    RescheduleInspectionRequest
} from '@/types/inspection';
import { ApiResponse } from '@/types/auth';

const inspectionService = {
    createInspection: async (data: CreateInspectionRequest): Promise<InspectionResponse> => {
        const response = await apiClient.post('/api/v1/Inspection', data);
        return response.data;
    },

    getInspection: async (id: string): Promise<InspectionResponse> => {
        const response = await apiClient.get(`/api/v1/Inspection/${id}`);
        return response.data;
    },

    deleteInspection: async (id: string): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.delete(`/api/v1/Inspection/${id}`);
        return response.data;
    },

    getInspectionsByProperty: async (propertyId: string, pageNumber: number = 1, pageSize: number = 10, status?: number): Promise<InspectionsResponse> => {
        const response = await apiClient.get(`/api/v1/Inspection/property/${propertyId}`, {
            params: { pageNumber, pageSize, status }
        });
        return response.data;
    },

    getMyInspections: async (pageNumber: number = 1, pageSize: number = 10, status?: number): Promise<InspectionsResponse> => {
        const response = await apiClient.get('/api/v1/Inspection/my', {
            params: { pageNumber, pageSize, status }
        });
        return response.data;
    },

    getOwnerInspections: async (pageNumber: number = 1, pageSize: number = 10, status?: number): Promise<InspectionsResponse> => {
        const response = await apiClient.get('/api/v1/Inspection/owner', {
            params: { pageNumber, pageSize, status }
        });
        return response.data;
    },

    respondToInspection: async (id: string, data: RespondToInspectionRequest): Promise<InspectionResponse> => {
        const response = await apiClient.put(`/api/v1/Inspection/${id}/respond`, data);
        return response.data;
    },

    rescheduleInspection: async (id: string, data: RescheduleInspectionRequest): Promise<InspectionResponse> => {
        const response = await apiClient.put(`/api/v1/Inspection/${id}/reschedule`, data);
        return response.data;
    },

    respondToReschedule: async (id: string, accept: boolean): Promise<InspectionResponse> => {
        const response = await apiClient.put(`/api/v1/Inspection/${id}/respond-reschedule?accept=${accept}`);
        return response.data;
    }
};

export default inspectionService;
