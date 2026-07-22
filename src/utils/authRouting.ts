import { CustomerType } from '@/types/auth';

/**
 * Accounts created through Google start as CustomerType.Unset — they have no
 * permissions until the user completes the one-time onboarding step.
 */
export const needsAccountTypeSelection = (customerType?: number | null): boolean =>
    (customerType ?? CustomerType.Unset) === CustomerType.Unset;

/**
 * Where a freshly authenticated user should land.
 *
 * `redirect` (e.g. from `/login?redirect=/property/123/inspection`) is honoured only
 * when it's a relative in-app path — never an absolute URL, which would let a crafted
 * link bounce a freshly signed-in user off-site.
 */
export const postAuthRoute = (customerType?: number | null, redirect?: string | null): string => {
    if (needsAccountTypeSelection(customerType)) return '/onboarding/account-type';
    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) return redirect;
    return '/dashboard';
};
