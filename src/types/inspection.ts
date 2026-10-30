import { ApiResponse } from "./auth";

// Must match backend HousingHub.Model.Enums.InspectionStatus exactly — these are
// serialized/deserialized as raw numbers, not names.
export enum InspectionStatus {
    Pending = 0,
    Confirmed = 1,
    Declined = 2,
    Rescheduled = 3,
    Completed = 4,
    Cancelled = 5,
    /**
     * We asked the renter whether the viewing happened and never heard back.
     *
     * Not the same as cancelled — cancelled means somebody decided. Terminal: to
     * go ahead after this, book again.
     */
    Expired = 6
}

export interface Inspection {
    id: string;
    inspectionId: string | null;
    dateCreated: string;
    dateModified: string;
    customerId: string;
    propertyId: string;
    propertyName?: string;
    latitude?: number;
    longitude?: number;
    scheduledDate: string;
    scheduledTime: string;
    note: string | null;
    status: InspectionStatus;
    declineNote: string | null;
    rescheduledDate: string | null;
    rescheduledTime: string | null;
    rescheduleNote: string | null;
    /** Who proposed the pending reschedule. The *other* party is the one who answers it. */
    rescheduleRequestedById: string | null;
    propertyImageUrl?: string | null;
    propertyOwnerId?: string | null;
    customerName?: string | null;
    /**
     * Where the viewer is based — city and state, never the street.
     *
     * Set only on the single-inspection read, not on lists. Null when they have not
     * given an address, which is why nothing renders rather than "Unknown".
     */
    customerLocation?: string | null;
    /** When the renter confirmed the viewing happened. */
    completedAt?: string | null;
    /**
     * What the renter said about the viewing, if anything.
     *
     * Shown to both sides. It is the only written account of what happened, and an
     * owner deciding whether to put them forward should read it.
     */
    completionComment?: string | null;
    propertyOwnerName?: string | null;
    handedOffAt?: string | null;
    assignedStaffId?: string | null;
    assignedStaffName?: string | null;
}

export interface CreateInspectionRequest {
    propertyId: string;
    scheduledDate: string;
    scheduledTime: string;
    note: string | null;
    authenticatedUserId: string;
}

export interface RespondToInspectionRequest {
    inspectionId: string;
    accept: boolean;
    note: string | null;
    authenticatedUserId: string;
}

export interface RescheduleInspectionRequest {
    inspectionId: string;
    rescheduledDate: string;
    rescheduledTime: string;
    note: string | null;
    authenticatedUserId: string;
}

export interface PaginatedInspections {
    items: Inspection[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export type InspectionResponse = ApiResponse<Inspection>;
export type InspectionsResponse = ApiResponse<PaginatedInspections>;
