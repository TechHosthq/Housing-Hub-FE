/**
 * Types mirroring the tenancy DTOs in HousingHub.Service.
 *
 * Enum values are the persisted integers from HousingHub.Model.Enums.TenancyStatus
 * and must match exactly. Lifecycle values run from 1; terminal values sit in their
 * own band from 10 so a stage can be added later without renumbering.
 */

import { ApiResponse } from './auth';
import { PropertyLeaseType } from './property';

export enum TenancyStatus {
    CandidateSelected = 1,
    DocumentsRequested = 2,
    DocumentsAccepted = 3,
    AwaitingPayment = 4,
    Active = 5,
    Ended = 6,
    /** The owner pulled out. */
    Withdrawn = 10,
    /** The candidate is no longer interested. */
    DeclinedByCandidate = 11,
}

export const TENANCY_STATUS_LABELS: Record<number, string> = {
    [TenancyStatus.CandidateSelected]: 'Chosen',
    [TenancyStatus.DocumentsRequested]: 'Documents with tenant',
    [TenancyStatus.DocumentsAccepted]: 'Documents agreed',
    [TenancyStatus.AwaitingPayment]: 'Awaiting payment',
    [TenancyStatus.Active]: 'Let running',
    [TenancyStatus.Ended]: 'Ended',
    [TenancyStatus.Withdrawn]: 'Withdrawn',
    [TenancyStatus.DeclinedByCandidate]: 'Declined',
};

/** Terminal states release the property; everything else still holds it. */
export const isTenancyLive = (status: TenancyStatus): boolean =>
    status !== TenancyStatus.Withdrawn
    && status !== TenancyStatus.DeclinedByCandidate
    && status !== TenancyStatus.Ended;

export interface Tenancy {
    id: string;
    propertyId: string;
    propertyTitle: string | null;
    landlordCustomerId: string;
    landlordName: string | null;
    tenantCustomerId: string;
    tenantName: string | null;
    status: TenancyStatus;
    /** Kobo, snapshotted when the candidate was chosen — see utils/money. */
    agreedRentKobo: number;
    leaseType: PropertyLeaseType;
    selectedFromInspectionId: string;
    selectedAt: string;
    withdrawnReason: string | null;
    closedAt: string | null;
    dateCreated: string;
}

/**
 * Somebody the owner could choose.
 *
 * Carries no contact details on purpose — the owner picks on who viewed the
 * property and whether their identity is verified, and talks to them in-app. An
 * address or a phone number before anyone has agreed anything is a leak, not a
 * feature.
 */
export interface TenancyCandidate {
    customerId: string;
    name: string | null;
    inspectionId: string;
    inspectedOn: string;
    isIdentityVerified: boolean;
}

export type TenancyResponse = ApiResponse<Tenancy>;
export type TenanciesResponse = ApiResponse<Tenancy[]>;
export type TenancyCandidatesResponse = ApiResponse<TenancyCandidate[]>;
