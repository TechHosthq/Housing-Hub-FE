/**
 * The legal entity behind Housing Hub.
 *
 * "Housing Hub" is a product name, not a legal person. A user agreement has to be
 * with somebody who exists, and a privacy policy has to name a data controller
 * somebody can actually write to — so both pages read this rather than each
 * describing the company in their own words and drifting apart.
 *
 * Both fields render only when set, so clearing one omits its sentence rather than
 * showing a placeholder to users.
 */
export const OPERATOR = {
    /** Registered company name. */
    name: "Techhost",

    /** CAC registration number. Rendered with an "RC " prefix, so it is digits only. */
    registrationNumber: "1935335",

    /**
     * Registered address, as filed with CAC.
     *
     * No trailing full stop: both pages append one after this, and two would read
     * as a typo on a page that is meant to be the careful one.
     */
    registeredAddress:
        "The Philippi Centre, Oluwalogbon House, Plot A Obafemi Awolowo Way, Alausa, Ikeja, Lagos",
} as const;

/** "Techhost (RC 1234567)", or just "Techhost" until the number is known. */
export const operatorLegalName = (): string =>
    OPERATOR.registrationNumber
        ? `${OPERATOR.name} (RC ${OPERATOR.registrationNumber})`
        : OPERATOR.name;
