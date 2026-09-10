/**
 * Formatting money for display.
 *
 * Amounts travel and are stored as whole kobo, so this is the only place the
 * conversion to naira happens. Keeping it to one function is the point: a divide
 * by 100 sprinkled through components is how a price ends up rendered a hundred
 * times too small on one screen and correctly on every other.
 */

/** Kobo to naira, e.g. 500000 → "₦5,000". */
export const formatKobo = (kobo: number): string => {
    const naira = kobo / 100;

    // Whole naira for whole amounts — "₦5,000.00" reads like an accounting export
    // rather than a price. Kobo shown only when there are any, which for a
    // configured fee there normally are not.
    const hasKobo = kobo % 100 !== 0;

    return `₦${naira.toLocaleString('en-NG', {
        minimumFractionDigits: hasKobo ? 2 : 0,
        maximumFractionDigits: 2,
    })}`;
};
