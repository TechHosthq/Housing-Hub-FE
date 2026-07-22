import { CustomerType } from '@/types/auth';

/**
 * Accounts created through Google start as CustomerType.Unset — they have no
 * permissions until the user completes the one-time onboarding step.
 */
export const needsAccountTypeSelection = (customerType?: number | null): boolean =>
    (customerType ?? CustomerType.Unset) === CustomerType.Unset;

/** Where a freshly authenticated user should land. */
export const postAuthRoute = (customerType?: number | null): string =>
    needsAccountTypeSelection(customerType) ? '/onboarding/account-type' : '/dashboard';
