import { ApiResponse, PaginatedResponse } from "./auth";

export enum NotificationType {
    InspectionScheduled = 0,
    InspectionConfirmed = 1,
    InspectionDeclined = 2,
    InspectionRescheduled = 3,
    InspectionCancelled = 4,
    KYCApproved = 5,
    KYCRejected = 6,
    // Add other types as they are discovered
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
}

export interface NotificationQueryParams {
    pageNumber?: number;
    pageSize?: number;
    unreadOnly?: boolean;
}
