import { describe, expect, it } from "vitest";
import {
    TENANCY_DOCUMENT_STATUS_LABELS,
    TENANCY_STATUS_LABELS,
    TenancyDocumentStatus,
    TenancyStatus,
    isTenancyLive,
} from "./tenancy";

/**
 * These numbers are the persisted integers from the server's enums. A value that
 * drifts here mislabels a tenancy on every screen without failing anywhere.
 */
describe("TenancyStatus", () => {
    it("matches the persisted values", () => {
        expect(TenancyStatus.CandidateSelected).toBe(1);
        expect(TenancyStatus.DocumentsRequested).toBe(2);
        expect(TenancyStatus.DocumentsAccepted).toBe(3);
        expect(TenancyStatus.AwaitingPayment).toBe(4);
        expect(TenancyStatus.Active).toBe(5);
        expect(TenancyStatus.Ended).toBe(6);
        // Terminal values sit in their own band from 10.
        expect(TenancyStatus.Withdrawn).toBe(10);
        expect(TenancyStatus.DeclinedByCandidate).toBe(11);
    });

    it("labels every status", () => {
        for (const value of Object.values(TenancyStatus)) {
            if (typeof value === "number") expect(TENANCY_STATUS_LABELS[value]).toBeTruthy();
        }
    });
});

describe("isTenancyLive", () => {
    /** A live tenancy still holds the property off the market. */
    it.each([
        TenancyStatus.CandidateSelected,
        TenancyStatus.DocumentsRequested,
        TenancyStatus.DocumentsAccepted,
        TenancyStatus.AwaitingPayment,
        TenancyStatus.Active,
    ])("holds the property for %o", (status) => {
        expect(isTenancyLive(status)).toBe(true);
    });

    it.each([TenancyStatus.Withdrawn, TenancyStatus.DeclinedByCandidate, TenancyStatus.Ended])(
        "releases it for %o",
        (status) => {
            expect(isTenancyLive(status)).toBe(false);
        },
    );
});

describe("TenancyDocumentStatus", () => {
    it("matches the persisted values", () => {
        expect(TenancyDocumentStatus.Requested).toBe(1);
        expect(TenancyDocumentStatus.Submitted).toBe(2);
        expect(TenancyDocumentStatus.Accepted).toBe(3);
        expect(TenancyDocumentStatus.Rejected).toBe(4);
    });

    /** "Returned", not "rejected" — it is a correction, not a refusal. */
    it("words a rejection as the tenant will read it", () => {
        expect(TENANCY_DOCUMENT_STATUS_LABELS[TenancyDocumentStatus.Rejected]).toBe("Returned to you");
    });
});
