import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import OwnerPaymentPanel from "./OwnerPaymentPanel";
import { TenancyStatus } from "@/types/tenancy";

const quote = vi.fn();

vi.mock("@/hooks/useTenancy", () => ({
    useTenancy: () => ({ usePaymentQuote: () => quote() }),
}));

const aQuote = (over: Record<string, unknown> = {}) => ({
    data: {
        data: {
            tenancyId: "t1",
            tenancyStatus: TenancyStatus.Active,
            rentKobo: 350_000_00,
            ownerFeesKobo: 200_000_00,
            commissionKobo: 17_500_00,
            processingFeeKobo: 2_000_00,
            totalKobo: 569_500_00,
            currency: "NGN",
            isPayable: false,
            isAlreadyPaid: true,
            ownerCanBePaid: true,
            fees: [],
            ...over,
        },
    },
    isLoading: false,
});

describe("OwnerPaymentPanel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        quote.mockReturnValue(aQuote());
    });

    /**
     * The bug this exists for. The owner's screen said "the tenant pays next" after
     * they had been paid, because the message was keyed on the documents rather
     * than on the tenancy.
     */
    it("says they have been paid once the tenancy is active", () => {
        render(<OwnerPaymentPanel tenancyId="t1" tenancyStatus={TenancyStatus.Active} />);

        expect(screen.getByText(/paid — the let is running/i)).toBeTruthy();
        expect(screen.queryByText(/waiting for the tenant/i)).toBeFalsy();
    });

    /**
     * What reached them, not what the tenant was charged. The difference is the
     * part we kept, and showing the total would overstate their bank balance by
     * exactly that much.
     */
    it("reports what landed, not what was charged", () => {
        render(<OwnerPaymentPanel tenancyId="t1" tenancyStatus={TenancyStatus.Active} />);

        expect(screen.getByText(/₦550,000/)).toBeTruthy();
        expect(screen.queryByText(/₦569,500 has been sent/)).toBeFalsy();
    });

    it("waits while the tenant has not paid", () => {
        quote.mockReturnValue(aQuote({ isAlreadyPaid: false }));

        render(<OwnerPaymentPanel tenancyId="t1" tenancyStatus={TenancyStatus.DocumentsAccepted} />);

        expect(screen.getByText(/waiting for the tenant to pay/i)).toBeTruthy();
    });

    /** The one thing only the owner can fix, named on their own screen. */
    it("tells the owner when they are the reason nobody can pay", () => {
        quote.mockReturnValue(aQuote({ isAlreadyPaid: false, ownerCanBePaid: false }));

        render(<OwnerPaymentPanel tenancyId="t1" tenancyStatus={TenancyStatus.DocumentsAccepted} />);

        expect(screen.getByText(/haven't told us where to pay you/i)).toBeTruthy();
    });
});
