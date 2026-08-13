import apiClient from './apiClient';
import {
    AddDocumentMetadata,
    ApiResponse,
    StartCaseRequest,
    VerificationCase,
    VerificationCaseDetail,
    VerificationDocument,
} from '@/types/verification';

const verificationService = {
    /**
     * Opens a verification request, or returns the draft already in progress.
     *
     * Safe to call repeatedly — the server returns the existing draft rather than
     * creating a second one, so a user who navigates away mid-upload and comes back
     * finds their documents rather than an empty form beside an orphan.
     */
    startCase: async (data: StartCaseRequest): Promise<ApiResponse<VerificationCase>> => {
        const response = await apiClient.post('/api/v1/Verification/cases', data);
        return response.data;
    },

    getMyCases: async (): Promise<ApiResponse<VerificationCase[]>> => {
        const response = await apiClient.get('/api/v1/Verification/cases');
        return response.data;
    },

    getMyCase: async (caseId: string): Promise<ApiResponse<VerificationCaseDetail>> => {
        const response = await apiClient.get(`/api/v1/Verification/cases/${caseId}`);
        return response.data;
    },

    /**
     * Attaches a document to a draft.
     *
     * Multipart, because the metadata travels with the file. The field name must be
     * `File` with a capital F — the controller falls back to the first form file if
     * binding misses, but matching the expected name avoids relying on that.
     */
    addDocument: async (
        caseId: string, metadata: AddDocumentMetadata, file: File,
    ): Promise<ApiResponse<VerificationDocument>> => {
        const formData = new FormData();
        formData.append('File', file);
        formData.append('DocumentType', String(metadata.documentType));

        if (metadata.documentNumber) formData.append('DocumentNumber', metadata.documentNumber);
        if (metadata.nameOnDocument) formData.append('NameOnDocument', metadata.nameOnDocument);
        if (metadata.issuingAuthority) formData.append('IssuingAuthority', metadata.issuingAuthority);
        if (metadata.issuedAt) formData.append('IssuedAt', metadata.issuedAt);
        if (metadata.expiresAt) formData.append('ExpiresAt', metadata.expiresAt);

        const response = await apiClient.post(
            `/api/v1/Verification/cases/${caseId}/documents`, formData,
        );
        return response.data;
    },

    removeDocument: async (caseId: string, documentId: string): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.delete(
            `/api/v1/Verification/cases/${caseId}/documents/${documentId}`,
        );
        return response.data;
    },

    /**
     * A ten-minute link to view your own uploaded document.
     *
     * Treat the URL as a credential rather than an address — anyone holding it can
     * read the document until it expires.
     */
    getDocumentUrl: async (caseId: string, documentId: string): Promise<ApiResponse<string>> => {
        const response = await apiClient.get(
            `/api/v1/Verification/cases/${caseId}/documents/${documentId}/url`,
        );
        return response.data;
    },

    /** Hands the case to review. Documents can no longer be changed afterwards. */
    submitCase: async (caseId: string): Promise<ApiResponse<VerificationCase>> => {
        const response = await apiClient.put(`/api/v1/Verification/cases/${caseId}/submit`);
        return response.data;
    },
};

export default verificationService;
