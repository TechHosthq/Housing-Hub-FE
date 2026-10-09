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

/**
 * How a requested document gets completed.
 *
 * Must match HousingHub.Model.Enums.TenancyDocumentMode exactly.
 */
export enum TenancyDocumentMode {
    /** The tenant supplies something they already have. The owner attaches nothing. */
    Upload = 1,
    /** The owner attaches the document; the tenant signs it electronically. */
    SignInApp = 2,
    /** The owner attaches it; the tenant prints, signs and uploads the scan. */
    SignOffline = 3,
}

/** Must match HousingHub.Model.Enums.TenancyDocumentStatus exactly. */
export enum TenancyDocumentStatus {
    Requested = 1,
    Submitted = 2,
    Accepted = 3,
    Rejected = 4,
}

/**
 * Wording is from the tenant's side, because they are the ones acting on it.
 *
 * "Returned" rather than "rejected": the document is coming back for a correction,
 * not being refused, and the two read very differently to somebody waiting on a
 * place to live.
 */
export const TENANCY_DOCUMENT_STATUS_LABELS: Record<number, string> = {
    [TenancyDocumentStatus.Requested]: 'Not done yet',
    [TenancyDocumentStatus.Submitted]: 'With the owner',
    [TenancyDocumentStatus.Accepted]: 'Accepted',
    [TenancyDocumentStatus.Rejected]: 'Returned to you',
};

export interface TenancyDocument {
    id: string;
    tenancyId: string;
    name: string;
    instructions: string | null;
    mode: TenancyDocumentMode;
    isAgreement: boolean;
    status: TenancyDocumentStatus;
    /** Whether the owner attached a file to be signed. Never a storage key — see getDocumentUrl. */
    hasSourceFile: boolean;
    hasSubmittedFile: boolean;
    submittedAt: string | null;
    reviewedAt: string | null;
    rejectionReason: string | null;
    signedAt: string | null;
    dateCreated: string;
}

/** A cost on top of the rent, named and described by the owner. */
export interface TenancyFee {
    id: string;
    name: string;
    description: string;
    amountKobo: number;
}

/**
 * Everything being asked for and everything it costs, in one response.
 *
 * The fees arrive with the documents on purpose: they exist to be seen before
 * anything is signed, and fetching them separately is how a screen ends up
 * rendering the documents without them.
 */
export interface TenancyDocumentPack {
    tenancyId: string;
    tenancyStatus: TenancyStatus;
    propertyTitle: string | null;
    agreedRentKobo: number;
    documents: TenancyDocument[];
    fees: TenancyFee[];
    /** Rent plus every fee. What the tenant is agreeing to, in one number. */
    totalKobo: number;
    isComplete: boolean;
}

/** One fee as the owner enters it. No id — the list is replaced wholesale. */
export interface TenancyFeeInput {
    name: string;
    description: string;
    amountKobo: number;
}

export type TenancyDocumentPackResponse = ApiResponse<TenancyDocumentPack>;
export type TenancyDocumentResponse = ApiResponse<TenancyDocument>;
export type TenancyFeesResponse = ApiResponse<TenancyFee[]>;
