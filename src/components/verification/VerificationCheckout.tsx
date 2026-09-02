"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, CircleAlert } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { useToastStore } from "@/store/useToastStore";
import { PaymentStatus } from "@/types/payment";
import { formatKobo } from "@/utils/money";
import { resolveApiError } from "@/utils/errorResolver";

interface VerificationCheckoutProps {
    caseId: string;
    /** True once every required document is attached. */
    canSubmit: boolean;
    onSubmit: () => void | Promise<void>;
    isSubmitting: boolean;
}

/**
 * The primary action on a draft verification request: pay, or submit.
 *
 * Which one is shown is the server's decision, not this component's guess. The
 * quote reports whether charging is switched on at all, and whether this case has
 * already been paid for — so the same code renders a free environment and a paid
 * one without a build-time flag.
 *
 * It also handles the return from the gateway. Coming back with `?reference=` in
 * the URL proves nothing on its own: the payer controls that redirect. So the
 * component asks the server about the payment and only treats it as paid once the
 * server says the provider's signed webhook has settled it.
 */
export default function VerificationCheckout({
    caseId, canSubmit, onSubmit, isSubmitting,
}: VerificationCheckoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { showError } = useToastStore();

    const {
        useVerificationQuote, usePaymentByReference,
        initialisePayment, isInitialisingPayment,
    } = usePayment();

    // Paystack appends `reference` and `trxref` to the callback URL itself, so the
    // return address we give it is just this page.
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");

    const { data: quoteResponse, isLoading: isLoadingQuote } = useVerificationQuote(caseId);
    const { data: paymentResponse, isFetching: isCheckingPayment } = usePaymentByReference(reference);

    const quote = quoteResponse?.data;
    const payment = paymentResponse?.data;

    /**
     * Submits once, automatically, after a payment settles.
     *
     * A ref rather than state: this must fire exactly once per settled payment, and
     * a state flag would re-arm on any re-render that reset it. Without the guard,
     * every poll tick that sees a settled payment would fire another submission.
     */
    const hasAutoSubmitted = useRef(false);

    useEffect(() => {
        if (hasAutoSubmitted.current) return;
        if (payment?.status !== PaymentStatus.Successful) return;
        if (!canSubmit) return;

        hasAutoSubmitted.current = true;

        // Clear the reference so a refresh does not look like a fresh return from
        // the gateway, then submit. Order matters only in that the URL should be
        // clean by the time the case reloads as submitted.
        router.replace(pathname);
        void onSubmit();
    }, [payment?.status, canSubmit, onSubmit, router, pathname]);

    const handlePay = async () => {
        try {
            const result = await initialisePayment({
                caseId,
                // Back to this page. The API drops any callback URL that is not on
                // an origin it already trusts, so this is checked server-side too.
                callbackUrl: `${window.location.origin}${pathname}`,
            });

            if (result.isSuccessful && result.data?.authorisationUrl) {
                window.location.href = result.data.authorisationUrl;
                return;
            }

            showError(result.message || "We couldn't start that payment. Please try again.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    if (isLoadingQuote) {
        return (
            <div className="flex items-center gap-2 py-2 text-[12px] font-semibold text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                Checking what this costs…
            </div>
        );
    }

    // ── Returning from the gateway ───────────────────────────────

    if (reference && payment) {
        if (payment.status === PaymentStatus.Pending) {
            return (
                <div className="rounded-[14px] border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-[#0B2545] dark:text-blue-200">
                        <Loader2 size={15} className="animate-spin" />
                        Confirming your payment…
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                        This usually takes a few seconds. Your bank confirms it to us separately
                        from sending you back here, so keep this page open.
                    </p>
                </div>
            );
        }

        /*
            Flagged is deliberately not worded as a failure. It means the provider
            confirmed a payment that did not match what we asked for — money may
            well have left the payer's account. Telling them it failed would be
            wrong in the direction that loses trust, and it would be wrong at the
            worst possible moment.
        */
        if (payment.status === PaymentStatus.Flagged) {
            return (
                <div className="rounded-[14px] border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-amber-800 dark:text-amber-300">
                        <CircleAlert size={15} />
                        We&apos;re checking this payment
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-amber-800/80 dark:text-amber-200/80">
                        Something about the amount didn&apos;t match, so we&apos;ve held it for
                        someone to look at rather than guessing. Nothing further is needed from
                        you — we&apos;ll email you. Your reference is{" "}
                        <span className="font-bold">{payment.reference}</span>.
                    </p>
                </div>
            );
        }

        if (payment.status === PaymentStatus.Failed || payment.status === PaymentStatus.Abandoned) {
            return (
                <div className="space-y-3">
                    <p className="text-[12px] font-semibold text-[#FF3B30]">
                        That payment didn&apos;t go through, and you haven&apos;t been charged.
                    </p>
                    <PayButton
                        totalKobo={quote?.totalKobo ?? 0}
                        onClick={handlePay}
                        disabled={isInitialisingPayment}
                        isBusy={isInitialisingPayment}
                        label="Try again"
                    />
                </div>
            );
        }
    }

    // Settled, and the submission is on its way.
    if (reference && payment?.status === PaymentStatus.Successful && isSubmitting) {
        return (
            <div className="flex items-center gap-2 py-2 text-[13px] font-bold text-emerald-700 dark:text-emerald-400">
                <Loader2 size={15} className="animate-spin" />
                Paid. Sending your request to our review team…
            </div>
        );
    }

    if (reference && isCheckingPayment && !payment) {
        return (
            <div className="flex items-center gap-2 py-2 text-[12px] font-semibold text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                Checking your payment…
            </div>
        );
    }

    // ── Nothing to pay ───────────────────────────────────────────

    // Either charging is off entirely, or this case is already paid for. In both
    // cases the action is a plain submit, and the quote figures are meaningless.
    if (!quote || !quote.isPaymentRequired || quote.isAlreadyPaid) {
        return (
            <div className="space-y-3">
                {quote?.isAlreadyPaid && (
                    <p className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck size={14} />
                        Paid. This is ready to submit.
                    </p>
                )}
                <button
                    type="button"
                    onClick={() => void onSubmit()}
                    disabled={!canSubmit || isSubmitting}
                    className="rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#071A33] disabled:opacity-40"
                >
                    {isSubmitting ? "Submitting…" : "Submit for review"}
                </button>
            </div>
        );
    }

    // ── Payable ──────────────────────────────────────────────────

    return (
        <div className="space-y-4">
            <div className="rounded-[14px] border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    What this costs
                </p>

                <dl className="space-y-2">
                    <Line label="Verification review" value={formatKobo(quote.purposeFeeKobo)} />

                    {/*
                        Shown as its own line, and only when it is actually being
                        charged. Someone who has already been ID-verified sees no
                        identity line at all, which is the point of the one-off rule
                        — the alternative is a total they cannot account for.
                    */}
                    {quote.includesIdentityVerification && (
                        <Line
                            label="Identity check (one-off)"
                            value={formatKobo(quote.identityFeeKobo)}
                            hint="Charged once. Any future verification reuses it at no cost."
                        />
                    )}

                    <div className="flex items-baseline justify-between border-t border-gray-100 pt-2 dark:border-gray-800">
                        <dt className="text-[13px] font-black text-[#1A1A1A] dark:text-gray-100">Total</dt>
                        <dd className="text-[15px] font-black text-[#0B2545] dark:text-blue-200">
                            {formatKobo(quote.totalKobo)}
                        </dd>
                    </div>
                </dl>
            </div>

            {/*
                Stated before payment, not after, and in plain words. The provider
                bills us whether the documents pass or not, so the fee covers the
                review rather than the outcome — and a payer who learns that from a
                support reply raises a chargeback instead.
            */}
            <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                This pays for the review itself, so it isn&apos;t refundable once we&apos;ve
                started — including if your documents are rejected. Check what you&apos;ve
                attached before paying. We never ask for payment any other way, and we never
                ask for it by email or phone.
            </p>

            <PayButton
                totalKobo={quote.totalKobo}
                onClick={handlePay}
                disabled={!canSubmit || isInitialisingPayment}
                isBusy={isInitialisingPayment}
            />

            {!canSubmit && (
                <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                    Attach everything above first — we&apos;ll only take payment once your
                    request is complete.
                </p>
            )}
        </div>
    );
}

function Line({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[12px] font-semibold text-gray-600 dark:text-gray-400">
                {label}
                {hint && (
                    <span className="mt-0.5 block text-[10px] font-medium text-gray-400 dark:text-gray-500">
                        {hint}
                    </span>
                )}
            </dt>
            <dd className="shrink-0 text-[13px] font-bold text-[#1A1A1A] dark:text-gray-100">{value}</dd>
        </div>
    );
}

function PayButton({
    totalKobo, onClick, disabled, isBusy, label,
}: {
    totalKobo: number;
    onClick: () => void;
    disabled: boolean;
    isBusy: boolean;
    label?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-2 rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#071A33] disabled:opacity-40"
        >
            {isBusy && <Loader2 size={14} className="animate-spin" />}
            {isBusy ? "Taking you to pay…" : label ?? `Pay ${formatKobo(totalKobo)} and submit`}
        </button>
    );
}
