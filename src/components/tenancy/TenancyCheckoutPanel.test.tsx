import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TenancyCheckoutPanel from "./TenancyCheckoutPanel";
import { TenancyStatus } from "@/types/tenancy";

const quote = vi.fn();
const startPayment = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace: vi.fn() }),
    useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/hooks/useTenancy", () => ({
    useTenancy: () => ({
        usePaymentQuote: () => quote(),
        startPayment,
        isStartingPayment: false,
    }),
}));

vi.mock("@/hooks/usePayment", () => ({
    usePayment: () => ({ reconcilePayment: vi.fn(), isReconciling: false }),
}));

const aQuote = (over: Record<string, unknown> = {}) => ({
    data: {
        data: {
            tenancyId: "t1",
            tenancyStatus: TenancyStatus.DocumentsAccepted,
            rentKobo: 350_000_00,
            ownerFeesKobo: 200_000_00,
            commissionKobo: 17_500_00,
            processingFeeKobo: 2_000_00,
            totalKobo: 569_500_00,
            currency: "NGN",
            isPayable: true,
            isAlreadyPaid: false,
            ownerCanBePaid: true,
            fees: [{ id: "f1", name: "Service Charge", description: "Cleaning", amountKobo: 200_000_00 }],
            ...over,
        },
    },
    isLoading: false,
});

describe("TenancyCheckoutPanel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        quote.mockReturnValue(aQuote());
    });

    /**
     * The bug this exists for. The server answered isSuccessful:true with the
     * checkout URL under another name, so authorisationUrl was null — the panel
     * fell to its failure branch and rendered the word "Success." in red while the
     * payer went nowhere. Nothing on either side failed.
     */
    it("sends the payer to the gateway when one is returned", async () => {
        const assign = vi.fn();
        Object.defineProperty(window, "location", {
            value: { href: "", origin: "https://app.test", assign },
            writable: true,
        });

        startPayment.mockResolvedValue({
            isSuccessful: true,
            data: { authorisationUrl: "https://checkout.paystack.com/abc" },
        });

        const { getByRole } = render(<TenancyCheckoutPanel tenancyId="t1" />);
        getByRole("button", { name: /pay/i }).click();

        await vi.waitFor(() => {
            expect(window.location.href).toBe("https://checkout.paystack.com/abc");
        });
    });

    /**
     * A success with nowhere to send the payer is a failure, however the envelope
     * is flagged — and must never render the success message as the error.
     */
    it("does not report success when there is no gateway to go to", async () => {
        startPayment.mockResolvedValue({
            isSuccessful: true,
            message: "Success.",
            data: { authorisationUrl: null },
        });

        const { getByRole } = render(<TenancyCheckoutPanel tenancyId="t1" />);
        getByRole("button", { name: /pay/i }).click();

        await vi.waitFor(() => {
            expect(screen.queryByText("Success.")).not.toBeTruthy();
        });
    });

    /** Our commission is named as ours, before anything is charged. */
    it("itemises what the tenant is paying for", () => {
        render(<TenancyCheckoutPanel tenancyId="t1" />);

        expect(screen.getByText(/housing hub service charge/i)).toBeTruthy();
        expect(screen.getByText(/card processing/i)).toBeTruthy();
        expect(screen.getByText("₦569,500")).toBeTruthy();
    });

    /**
     * The tenant has done nothing wrong and can do nothing about it, so the panel
     * says who is holding it up rather than failing on the button.
     */
    it("explains when the owner has nowhere to be paid", () => {
        quote.mockReturnValue(aQuote({ ownerCanBePaid: false }));

        render(<TenancyCheckoutPanel tenancyId="t1" />);

        expect(screen.getByText(/owner hasn't set up an account/i)).toBeTruthy();
        expect(screen.queryByRole("button", { name: /^pay /i })).toBeFalsy();
    });

    it("shows a paid tenancy as paid rather than offering to charge again", () => {
        quote.mockReturnValue(aQuote({ tenancyStatus: TenancyStatus.Active, isAlreadyPaid: true }));

        render(<TenancyCheckoutPanel tenancyId="t1" />);

        expect(screen.getByText(/the tenancy is running/i)).toBeTruthy();
        expect(screen.queryByRole("button", { name: /^pay /i })).toBeFalsy();
    });
});
