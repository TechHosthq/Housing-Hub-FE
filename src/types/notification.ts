import { ApiResponse, PaginatedResponse } from "./auth";

// Must match backend HousingHub.Model.Enums.NotificationType exactly — these are
// serialized/deserialized as raw numbers, not names.
export enum NotificationType {
    InspectionScheduled = 0,
    InspectionConfirmed = 1,
    InspectionDeclined = 2,
    InspectionRescheduled = 3,
    InspectionCancelled = 4,
    NewMessage = 5,
    PropertyMatch = 6,
    VerificationApproved = 7,
    VerificationRejected = 8,
    VerificationExpired = 9,
    VerificationExpiringSoon = 10,
    TenancyCandidateSelected = 11,
    TenancyWithdrawn = 12,
    TenancyDeclinedByCandidate = 13,
    TenancyDocumentsRequested = 14,
    TenancyDocumentSubmitted = 15,
    TenancyDocumentAccepted = 16,
    TenancyDocumentRejected = 17,
    TenancyDocumentsComplete = 18,
}

export interface Notification {
    id: string;
    dateCreated: string;
    recipientId: string;
    inspectionId: string | null;
    type: NotificationType;
    title: string | null;
    message: string | null;
    isRead: boolean;
    propertyId: string | null;
    /**
     * Set on tenancy notifications.
     *
     * Its own field rather than inspectionId, which is what these used to be filed
     * under on the server. A tenancy id in a field called inspectionId reads as an
     * inspection to everything downstream.
     */
    tenancyId: string | null;
}

export interface NotificationQueryParams {
    pageNumber?: number;
    pageSize?: number;
    unreadOnly?: boolean;
}
