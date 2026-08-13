import { VerificationTier } from '@/types/verification';
import { ApiResponse, PaginatedResponse } from "./auth";

export enum PropertyType {
    House = 1,
    Apartment = 2,
    Guesthouse = 3,
    Flat = 4,
    Duplex = 5
}

export enum AvailabilityStatus {
    Available = 1,
    Occupied = 2,
    Sold = 3
}

export enum PropertyLeaseType {
    Rent = 1,
    Sale = 2
}

// Must match backend HousingHub.Model.Enums.PropertyFileType exactly.
export enum PropertyFileType {
    Image = 1,
    Video = 2
}

export interface PropertyFile {
    id: string;
    dateCreated: string;
    dateModified: string;
    fileUrl: string | null;
    type: number;
    dateUploaded: string;
    propertyId: string;
}

export interface PropertyAddress {
    id: string;
    dateCreated: string;
    dateModified: string;
    place: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postalCode: string | null;
    propertyId: string;
}

export interface PropertyDetail {
    id: string;
    dateCreated: string;
    dateModified: string;
    title: string | null;
    description: string | null;
    propertyType: PropertyType;
    price: number;
    availability: AvailabilityStatus;
    propertyLeaseType: PropertyLeaseType;
    features: number;
    contactPersonName: string | null;
    contactPersonEmail: string | null;
    contactPersonPhoneNumber: string | null;
    ownerId: string;
    addressId: string;
    latitude: number | null;
    longitude: number | null;
    viewCount: number;
    isPublished: boolean;
    publishedAt: string | null;
    isVerified: boolean;
    verifiedAt: string | null;
    /**
     * The person who listed this has passed Housing Hub's identity check.
     *
     * Means: a government ID was submitted and an admin matched it to the account
     * holder. Does NOT mean they own the property or have the right to let it —
     * that is title verification, which does not exist yet. Copy rendered from this
     * flag must not imply otherwise.
     */
    isOwnerVerified: boolean;
    /**
     * Highest verification the lister currently holds. Drives the single badge —
     * see VerifiedOwnerBadge for why it is one badge rather than one per check.
     */
    ownerVerificationTier: VerificationTier;
    /** Owner's display name. Populated on single-property reads. */
    ownerName?: string | null;
    files: PropertyFile[];
    /** Count of open (Pending or Rescheduled) inspection requests. Only populated on owner-list endpoints. */
    inspectionCount?: number;
    propertyAddress?: PropertyAddress;
}

export interface PropertyDashboardStats {
    totalProperties: number;
    activeListings: number;
    pendingInspections: number;
    completedInspections: number;
}

export interface CreatePropertyRequest {
    title: string;
    description: string;
    propertyType: PropertyType;
    price: number;
    availability: AvailabilityStatus;
    propertyLeaseType: PropertyLeaseType;
    features: number;
    contactPersonName: string;
    contactPersonEmail: string;
    contactPersonPhoneNumber: string;
    ownerId: string;
    place: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    files: File[];
    /** true = publish immediately, false = save as draft. Defaults to publish. */
    publish?: boolean;
    /** Set true to proceed anyway after the backend warned this looks like a duplicate listing. */
    confirmDuplicate?: boolean;
}

export interface PossibleDuplicate {
    propertyId: string;
    title: string;
    address: string;
}

export interface CreatePropertyResult {
    property: PropertyDetail | null;
    possibleDuplicate: PossibleDuplicate | null;
}

export interface UpdatePropertyRequest {
    id: string;
    title: string | null;
    description: string | null;
    propertyType: PropertyType;
    price: number | null;
    availability: AvailabilityStatus;
    propertyLeaseType: PropertyLeaseType;
    features: number;
    contactPersonName: string | null;
    contactPersonEmail: string | null;
    contactPersonPhoneNumber: string | null;
    propertyAddress: {
        place: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        postalCode: string | null;
    };
    authenticatedUserId: string;
}

export interface PropertyQueryParams {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    features?: number;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    state?: string;
}

export type PropertyResponse = ApiResponse<PropertyDetail>;
export type CreatePropertyResponse = ApiResponse<CreatePropertyResult>;
export type PropertiesResponse = ApiResponse<PaginatedResponse<PropertyDetail>>;
export type PropertyDashboardResponse = ApiResponse<PropertyDashboardStats>;
export type PropertyFilesResponse = ApiResponse<PropertyFile[]>;
export type PropertyAddressResponse = ApiResponse<PropertyAddress>;
