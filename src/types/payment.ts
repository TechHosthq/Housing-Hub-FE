/**
 * Types mirroring the payment DTOs in HousingHub.Service.
 *
 * Enum values are the persisted integers from HousingHub.Model.Enums.Payment and
 * must match exactly. A mismatch here would not fail — it would mislabel a
 * payment's state, which on this screen means telling somebody their money did or
 * did not arrive, incorrectly.
 */

import { ApiResponse, PaginatedResponse } from './auth';

export enum PaymentPurpose {
    IdentityVerification = 1,
    BusinessVerification = 2,
    PropertyVerification = 3,
}

export enum PaymentStatus {
    Pending = 1,
    Successful = 2,
    Failed = 3,
    Abandoned = 4,
    /**
     * The gateway confirmed a payment that does not match what was asked for.
     *
     * Money may well have moved and nothing was handed over. Never render this as
     * a plain failure — the payer has not simply had a card declined, and telling
     * them so would be wrong in the direction that loses trust.
     */
    Flagged = 5,
}

export const PAYMENT_STATUS_LABELS: Record<number, string> = {
    [PaymentStatus.Pending]: 'Awaiting payment',
    [PaymentStatus.Successful]: 'Paid',
    [PaymentStatus.Failed]: 'Failed',
    [PaymentStatus.Abandoned]: 'Not completed',
    [PaymentStatus.Flagged]: 'Needs checking',
};

export const PAYMENT_PURPOSE_LABELS: Record<number, string> = {
    [PaymentPurpose.IdentityVerification]: 'Identity verification',
    [PaymentPurpose.BusinessVerification]: 'Business verification',
    [PaymentPurpose.PropertyVerification]: 'Property title verification',
};

export interface Payment {
    id: string;
    reference: string;
    purpose: PaymentPurpose;
    subjectId: string | null;
    /** Kobo, not naira. Divide by 100 only at the point of display — see utils/money. */
    amountKobo: number;
    purposeFeeKobo: number;
    identityFeeKobo: number;
    includesIdentityVerification: boolean;
    currency: string;
    status: PaymentStatus;
    channel: string | null;
    paidAt: string | null;
    dateCreated: string;
    /** Where to send the payer. Null once the attempt is no longer payable. */
    authorisationUrl: string | null;
}

export interface PaymentQuote {
    purpose: PaymentPurpose;
    purposeFeeKobo: number;
    identityFeeKobo: number;
    totalKobo: number;
    currency: string;
    includesIdentityVerification: boolean;
    isAlreadyPaid: boolean;
    /**
     * False when charging is switched off entirely, in which case every other
     * figure is zero and the case can be submitted without paying.
     *
     * Check this before rendering any price. It is the difference between "this is
     * free" and "we could not work out what it costs".
     */
    isPaymentRequired: boolean;
}

export type PaymentResponse = ApiResponse<Payment>;
export type PaymentQuoteResponse = ApiResponse<PaymentQuote>;
export type PaymentsResponse = ApiResponse<Payment[]>;
export type PaginatedPaymentsResponse = ApiResponse<PaginatedResponse<Payment>>;
