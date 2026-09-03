/**
 * The legal entity behind Housing Hub.
 *
 * "Housing Hub" is a product name, not a legal person. A user agreement has to be
 * with somebody who exists, and a privacy policy has to name a data controller
 * somebody can actually write to — so both pages read this rather than each
 * describing the company in their own words and drifting apart.
 *
 * **TODO before beta: fill in `registrationNumber` and `registeredAddress`.**
 * Both render only when set, so an incomplete entry omits the sentence rather than
 * showing a placeholder to users. A published agreement should carry them.
 */
export const OPERATOR = {
    /** Registered company name. */
    name: "Techhost",

    /** CAC registration number, e.g. "1234567". Empty until confirmed. */
    registrationNumber: "",

    /** Registered address, as filed. Empty until confirmed. */
    registeredAddress: "",
} as const;

/** "Techhost (RC 1234567)", or just "Techhost" until the number is known. */
export const operatorLegalName = (): string =>
    OPERATOR.registrationNumber
        ? `${OPERATOR.name} (RC ${OPERATOR.registrationNumber})`
        : OPERATOR.name;
