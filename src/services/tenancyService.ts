import apiClient from './apiClient';
import {
    TenanciesResponse,
    TenancyCandidatesResponse,
    TenancyResponse,
} from '@/types/tenancy';

/**
 * Choosing a tenant for a property, and backing out of having chosen one.
 *
 * Nothing here sends a caller id — the API derives both parties from the JWT and
 * re-checks which side of the tenancy you are on.
 */
const tenancyService = {
    /**
     * Everyone who completed an inspection for this property.
     *
     * Completed only: booking a viewing and not attending is not seeing a property.
     */
    getCandidates: async (propertyId: string): Promise<TenancyCandidatesResponse> => {
        const response = await apiClient.get(`/api/v1/Tenancy/properties/${propertyId}/candidates`);
        return response.data;
    },

    /**
     * Choose somebody.
     *
     * Creates the tenancy, marks the listing under offer and notifies them. Refused
     * if the property already has a live tenancy — withdraw that one first.
     */
    selectCandidate: async (propertyId: string, customerId: string): Promise<TenancyResponse> => {
        const response = await apiClient.post(
            `/api/v1/Tenancy/properties/${propertyId}/select`,
            { customerId },
        );
        return response.data;
    },

    /** Owner pulls out. The reason is shown to the candidate verbatim. */
    withdraw: async (tenancyId: string, reason: string | null): Promise<TenancyResponse> => {
        const response = await apiClient.put(`/api/v1/Tenancy/${tenancyId}/withdraw`, { reason });
        return response.data;
    },

    /** The chosen candidate says they are not going ahead. */
    decline: async (tenancyId: string): Promise<TenancyResponse> => {
        const response = await apiClient.put(`/api/v1/Tenancy/${tenancyId}/decline`);
        return response.data;
    },

    /** Everything you are party to, as owner or as tenant. */
    getMine: async (): Promise<TenanciesResponse> => {
        const response = await apiClient.get('/api/v1/Tenancy/mine');
        return response.data;
    },

    getById: async (tenancyId: string): Promise<TenancyResponse> => {
        const response = await apiClient.get(`/api/v1/Tenancy/${tenancyId}`);
        return response.data;
    },
};

export default tenancyService;
