import apiClient from './apiClient';
import { ApiResponse } from '@/types/auth';
import {
    TenanciesResponse,
    TenancyCandidatesResponse,
    TenancyDocumentMode,
    TenancyDocumentPackResponse,
    TenancyDocumentResponse,
    TenancyFeeInput,
    TenancyFeesResponse,
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

    // ── Documents and fees ───────────────────────────────────────

    /** Everything asked for, every fee and the total. Either party. */
    getDocumentPack: async (tenancyId: string): Promise<TenancyDocumentPackResponse> => {
        const response = await apiClient.get(`/api/v1/Tenancy/${tenancyId}/documents`);
        return response.data;
    },

    /**
     * Adds one document to a request the owner is still composing.
     *
     * Multipart because a document the tenant signs arrives with the file attached.
     * An upload-mode document carries no file and the server refuses one rather than
     * ignoring it, so this only appends `File` when there is one.
     */
    addDocument: async (
        tenancyId: string,
        document: {
            name: string;
            mode: TenancyDocumentMode;
            isAgreement: boolean;
            instructions?: string | null;
        },
        file?: File | null,
    ): Promise<TenancyDocumentResponse> => {
        const formData = new FormData();
        formData.append('Name', document.name);
        formData.append('Mode', String(document.mode));
        formData.append('IsAgreement', String(document.isAgreement));
        if (document.instructions) formData.append('Instructions', document.instructions);
        if (file) formData.append('File', file);

        const response = await apiClient.post(
            `/api/v1/Tenancy/${tenancyId}/documents`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return response.data;
    },

    removeDocument: async (tenancyId: string, documentId: string): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.delete(`/api/v1/Tenancy/${tenancyId}/documents/${documentId}`);
        return response.data;
    },

    /** Replaces the fee list wholesale — the server holds no partial update. */
    setFees: async (tenancyId: string, fees: TenancyFeeInput[]): Promise<TenancyFeesResponse> => {
        const response = await apiClient.put(`/api/v1/Tenancy/${tenancyId}/fees`, { fees });
        return response.data;
    },

    /** Sends the whole request. Once only, and nothing can be changed afterwards. */
    sendDocuments: async (tenancyId: string): Promise<TenancyDocumentPackResponse> => {
        const response = await apiClient.post(`/api/v1/Tenancy/${tenancyId}/documents/send`);
        return response.data;
    },

    /** The tenant returns a file — their own document, or a signed scan. */
    submitDocument: async (
        tenancyId: string, documentId: string, file: File,
    ): Promise<TenancyDocumentResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post(
            `/api/v1/Tenancy/${tenancyId}/documents/${documentId}/submit`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return response.data;
    },

    /**
     * The tenant signs in the app.
     *
     * Sends no body. The address and user agent that make up the audit trail are
     * read from the request by the server — a signer supplying their own would be
     * attesting to whatever they liked.
     */
    signDocument: async (tenancyId: string, documentId: string): Promise<TenancyDocumentResponse> => {
        const response = await apiClient.post(
            `/api/v1/Tenancy/${tenancyId}/documents/${documentId}/sign`,
        );
        return response.data;
    },

    /** The owner accepts a document, or sends it back with a reason. */
    reviewDocument: async (
        tenancyId: string, documentId: string, accept: boolean, rejectionReason?: string | null,
    ): Promise<TenancyDocumentResponse> => {
        const response = await apiClient.put(
            `/api/v1/Tenancy/${tenancyId}/documents/${documentId}/review`,
            { accept, rejectionReason: rejectionReason ?? null },
        );
        return response.data;
    },

    /**
     * A short-lived link to a document's file.
     *
     * Treat the URL as a credential rather than an address: anybody holding it can
     * read the document until it expires. Fetched on click and discarded — never
     * stored in state or put in a query key.
     */
    getDocumentUrl: async (
        tenancyId: string, documentId: string, submitted: boolean,
    ): Promise<ApiResponse<string>> => {
        const response = await apiClient.get(
            `/api/v1/Tenancy/${tenancyId}/documents/${documentId}/url`,
            { params: { submitted } },
        );
        return response.data;
    },
};

export default tenancyService;
