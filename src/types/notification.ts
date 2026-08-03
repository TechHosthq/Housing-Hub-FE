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
}

export interface NotificationQueryParams {
    pageNumber?: number;
    pageSize?: number;
    unreadOnly?: boolean;
}
