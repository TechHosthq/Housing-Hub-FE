import apiClient from './apiClient';
import { ApiResponse, PaginatedResponse } from '@/types/auth';
import { 
    PropertyDetail, 
    PropertyDashboardStats, 
    PropertyFile,
    CreatePropertyRequest,
    UpdatePropertyRequest,
    PropertyQueryParams,
    PropertyResponse,
    PropertiesResponse,
    PropertyDashboardResponse,
    PropertyFilesResponse,
    PropertyAddressResponse
} from '@/types/property';
import { Property } from "@/types";
import propertiesData from "@/data/properties.json";

export const propertyService = {
    // Mock methods preserved for the homepage until fully migrated
    getMockProperties: (): Property[] => {
        return propertiesData.properties;
    },
    getMockTrendingProperties: (): Property[] => {
        return propertiesData.properties.filter(p => p.tag === "Trending");
    },

    // Real API Endpoints
    getAllProperties: async (params: PropertyQueryParams): Promise<PropertiesResponse> => {
        const response = await apiClient.get<PropertiesResponse>('/api/v1/Property/all', { params });
        return response.data;
    },

    getProperty: async (id: string): Promise<PropertyResponse> => {
        const response = await apiClient.get<PropertyResponse>(`/api/v1/Property/${id}`);
        return response.data;
    },

    createProperty: async (data: CreatePropertyRequest): Promise<PropertyResponse> => {
        const formData = new FormData();
        formData.append('Title', data.title);
        formData.append('Description', data.description);
        formData.append('PropertyType', data.propertyType.toString());
        formData.append('Price', data.price.toString());
        formData.append('Availability', data.availability.toString());
        formData.append('PropertyLeaseType', data.propertyLeaseType.toString());
        formData.append('Features', data.features.toString());
        formData.append('ContactPersonName', data.contactPersonName);
        formData.append('ContactPersonEmail', data.contactPersonEmail);
        formData.append('ContactPersonPhoneNumber', data.contactPersonPhoneNumber);
        formData.append('OwnerId', data.ownerId);
        formData.append('PropertyAddress.Place', data.place);
        formData.append('PropertyAddress.City', data.city);
        formData.append('PropertyAddress.State', data.state);
        formData.append('PropertyAddress.Country', data.country);
        formData.append('PropertyAddress.PostalCode', data.postalCode);
        
        data.files.forEach((file) => {
            formData.append('Files', file);
        });

        const response = await apiClient.post<PropertyResponse>('/api/v1/Property', formData);
        return response.data;
    },

    updateProperty: async (id: string, data: UpdatePropertyRequest): Promise<PropertyResponse> => {
        const response = await apiClient.put<PropertyResponse>(`/api/v1/Property/${id}`, data);
        return response.data;
    },

    deleteProperty: async (id: string): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.delete<ApiResponse<boolean>>(`/api/v1/Property/${id}`);
        return response.data;
    },

    getMyProperties: async (): Promise<ApiResponse<PropertyDetail[]>> => {
        const response = await apiClient.get<ApiResponse<PropertyDetail[]>>('/api/v1/Property/my');
        return response.data;
    },

    getDashboardStats: async (): Promise<PropertyDashboardResponse> => {
        const response = await apiClient.get<PropertyDashboardResponse>('/api/v1/Property/dashboard');
        return response.data;
    },

    getNewProperties: async (count: number = 10): Promise<ApiResponse<PropertyDetail[]>> => {
        const response = await apiClient.get<ApiResponse<PropertyDetail[]>>(`/api/v1/Property/new?count=${count}`);
        return response.data;
    },

    getTrendingProperties: async (count: number = 10, skip: number = 0): Promise<ApiResponse<PropertyDetail[]>> => {
        const response = await apiClient.get<ApiResponse<PropertyDetail[]>>(`/api/v1/Property/trending`, {
            params: { count, skip }
        });
        return response.data;
    },

    getNearbyProperties: async (lat: number, lng: number, radius: number = 10, count: number = 10, skip: number = 0): Promise<ApiResponse<PropertyDetail[]>> => {
        const response = await apiClient.get<ApiResponse<PropertyDetail[]>>(`/api/v1/Property/nearby`, {
            params: { latitude: lat, longitude: lng, radiusKm: radius, count, skip }
        });
        return response.data;
    },


    // File Management
    getPropertyFiles: async (id: string): Promise<PropertyFilesResponse> => {
        const response = await apiClient.get<PropertyFilesResponse>(`/api/v1/Property/${id}/files`);
        return response.data;
    },

    uploadPropertyFiles: async (id: string, files: File[]): Promise<PropertyFilesResponse> => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('Files', file);
        });
        const response = await apiClient.post<PropertyFilesResponse>(`/api/v1/Property/${id}/files`, formData);
        return response.data;
    },

    deletePropertyFile: async (propertyId: string, fileId: string): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.delete<ApiResponse<boolean>>(`/api/v1/Property/${propertyId}/files/${fileId}`);
        return response.data;
    },

    // Legacy/Proxy methods
    getPropertyAddressByProperty: async (propertyId: string): Promise<PropertyAddressResponse> => {
        const response = await apiClient.get<PropertyAddressResponse>(`/api/v1/PropertyAddress/property/${propertyId}`);
        return response.data;
    }
};
