import { ApiResponse } from "./auth";
import { PropertyType } from "./property";

export interface PropertyAlertPreference {
    id: string;
    dateCreated: string;
    propertyType: PropertyType | null;
    minPrice: number | null;
    maxPrice: number | null;
    city: string | null;
    state: string | null;
    features: number | null;
    isActive: boolean;
}

export interface CreatePropertyAlertPreferenceRequest {
    propertyType?: PropertyType | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    city?: string | null;
    state?: string | null;
    features?: number | null;
}

export type PropertyAlertPreferencesResponse = ApiResponse<PropertyAlertPreference[]>;
export type PropertyAlertPreferenceResponse = ApiResponse<PropertyAlertPreference>;
