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

/**
 * Naira typed by a person to whole kobo.
 *
 * Multiplying a float by 100 is the trap here: 2500.15 * 100 is 250014.99999…,
 * which truncates to a kobo less than the person typed. Rounding closes that, and
 * every amount on the wire stays an integer.
 *
 * Returns null for anything that is not a non-negative number, so a caller has to
 * decide what an unparseable field means rather than silently sending zero.
 */
export const nairaToKobo = (naira: string | number): number | null => {
    const value = typeof naira === 'number' ? naira : Number(naira.replace(/,/g, '').trim());

    if (!Number.isFinite(value) || value < 0) return null;

    return Math.round(value * 100);
};

/** Kobo to a plain editable naira string, e.g. 250015 → "2500.15". No symbol, no separators. */
export const koboToNairaInput = (kobo: number): string =>
    (kobo % 100 === 0 ? kobo / 100 : (kobo / 100).toFixed(2)).toString();
