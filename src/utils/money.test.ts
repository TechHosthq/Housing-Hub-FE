import { describe, expect, it } from "vitest";
import { formatKobo, koboToNairaInput, nairaToKobo } from "./money";

/**
 * Money is stored and sent as whole kobo, and every screen divides by a hundred
 * in exactly one place. These are the assertions that keep it one place.
 */
describe("formatKobo", () => {
    it("renders whole naira without decimals", () => {
        expect(formatKobo(350_000_00)).toBe("₦350,000");
    });

    it("shows kobo only when there are any", () => {
        expect(formatKobo(1_234_56)).toBe("₦1,234.56");
    });

    it("renders nothing as nothing", () => {
        expect(formatKobo(0)).toBe("₦0");
    });

    /** The figures on a tenancy run to millions; the grouping has to survive it. */
    it("groups large amounts", () => {
        expect(formatKobo(5_777_000_00)).toBe("₦5,777,000");
    });
});

describe("nairaToKobo", () => {
    it("converts whole naira", () => {
        expect(nairaToKobo("2500")).toBe(250_000);
    });

    /**
     * The trap this function exists for: 2500.15 * 100 is 250014.99999… in binary
     * floating point, which truncates to a kobo less than the person typed.
     */
    it("does not lose a kobo to floating point", () => {
        expect(nairaToKobo("2500.15")).toBe(250_015);
    });

    it("accepts the separators people type", () => {
        expect(nairaToKobo("1,250,000")).toBe(125_000_000);
    });

    /**
     * Null rather than zero, so a caller has to decide what an unparseable field
     * means instead of silently sending nothing.
     */
    it.each(["", "   ", "abc", "-100", "₦500"])("refuses %o", (input) => {
        expect(nairaToKobo(input)).toBeNull();
    });
});

describe("koboToNairaInput", () => {
    it("round-trips through nairaToKobo", () => {
        for (const kobo of [0, 100, 250_015, 350_000_00, 5_777_000_00]) {
            expect(nairaToKobo(koboToNairaInput(kobo))).toBe(kobo);
        }
    });

    it("carries no symbol or separators, since it goes back into an input", () => {
        expect(koboToNairaInput(1_250_000_00)).toBe("1250000");
    });
});
