/**
 * Types mirroring the payout DTOs in HousingHub.Service.
 *
 * The account number never comes back in full and the provider's subaccount code
 * never comes back at all — it addresses money and has no use in a browser.
 */

import { ApiResponse } from './auth';

export interface Bank {
    name: string;
    code: string;
}

export interface PayoutAccount {
    id: string;
    bankName: string;
    bankCode: string;
    /** Last four digits only, so an owner can tell two of their accounts apart. */
    accountNumberMasked: string;
    /** The name the bank returned, which is what was checked against their identity. */
    resolvedAccountName: string;
    dateCreated: string;
}

/** The bank's answer, before anything is created. */
export interface ResolvedAccount {
    accountName: string;
    matchesYourIdentity: boolean;
}

export type BanksResponse = ApiResponse<Bank[]>;
export type PayoutAccountResponse = ApiResponse<PayoutAccount | null>;
export type ResolvedAccountResponse = ApiResponse<ResolvedAccount>;
