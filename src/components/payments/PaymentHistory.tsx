"use client";

import { format } from "date-fns";
import { ArrowUpRight, Loader2, Receipt, RotateCcw, ShieldCheck } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import {
    PAYMENT_STATUS_LABELS,
    Payment,
    PaymentStatus,
    describePaymentPurpose,
} from "@/types/payment";
import { formatKobo } from "@/utils/money";

const STATUS_STYLES: Record<number, string> = {
    [PaymentStatus.Successful]: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    [PaymentStatus.Pending]: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    [PaymentStatus.Failed]: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    [PaymentStatus.Abandoned]: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    [PaymentStatus.Flagged]: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    [PaymentStatus.RefundPending]: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
    [PaymentStatus.Refunded]: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

/**
 * A payer's own receipts.
 *
 * Exists because a payer who cannot find what they paid emails support, and
 * because the reference shown here is the thing that makes that email answerable.
 */
export default function PaymentHistory() {
    const { useMyPayments } = usePayment();
    const { data: response, isLoading } = useMyPayments();

    const payments = response?.data ?? [];

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center rounded-[22px] border border-[#F2F2F2] bg-white py-24 dark:border-gray-800 dark:bg-gray-900">
                <Loader2 className="animate-spin text-[#0095FF]" size={26} />
            </div>
        );
    }

    return (
        <div className="flex-1 w-full rounded-[22px] border border-[#F2F2F2] bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-1 text-[19px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat">
                Payments
            </h2>
            <p className="mb-7 text-[12px] font-medium text-gray-400 dark:text-gray-500">
                Everything you&apos;ve paid Housing Hub. Keep the reference — it&apos;s what we
                need if you ever have to ask us about one.
            </p>

            {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Receipt className="mb-4 text-gray-300" size={36} />
                    <p className="mb-1 text-[14px] font-bold text-[#1A1A1A] dark:text-gray-100">
                        No payments yet
                    </p>
                    <p className="max-w-sm text-[12px] leading-relaxed text-gray-400 dark:text-gray-500">
                        When you pay for a verification, the receipt will appear here. We never ask
                        for payment by email, phone or bank transfer — only on this website.
                    </p>
                </div>
            ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {payments.map((payment) => (
                        <PaymentRow key={payment.id} payment={payment} />
                    ))}
                </ul>
            )}
        </div>
    );
}

function PaymentRow({ payment }: { payment: Payment }) {
    const isRefund = payment.status === PaymentStatus.Refunded
        || payment.status === PaymentStatus.RefundPending;

    return (
        <li className="py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#1A1A1A] dark:text-gray-100">
                        {describePaymentPurpose(payment.purpose)}
                    </p>

                    {/*
                        The identity line is only ever shown when it was charged. It is
                        also the answer to "why was this more than the advertised
                        price", so it goes on the receipt rather than being implied.
                    */}
                    {payment.includesIdentityVerification && (
                        <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                            Includes the one-off identity check ({formatKobo(payment.identityFeeKobo)})
                        </p>
                    )}

                    <p className="mt-1.5 font-mono text-[11px] text-gray-400 dark:text-gray-500">
                        {payment.reference}
                    </p>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-[15px] font-black text-[#1A1A1A] dark:text-gray-100">
                        {formatKobo(payment.amountKobo)}
                    </p>
                    <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            STATUS_STYLES[payment.status] ?? STATUS_STYLES[PaymentStatus.Failed]
                        }`}
                    >
                        {PAYMENT_STATUS_LABELS[payment.status] ?? "Unknown"}
                    </span>
                    <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                        {format(new Date(payment.paidAt ?? payment.dateCreated), "d MMM yyyy")}
                        {payment.channel && ` · ${payment.channel.replace(/_/g, " ")}`}
                    </p>
                </div>
            </div>

            {/*
                A pending attempt keeps its link, so somebody who closed the gateway
                tab can finish rather than starting again — the server hands back the
                same attempt, so this is not a second charge.
            */}
            {payment.status === PaymentStatus.Pending && payment.authorisationUrl && (
                <a
                    href={payment.authorisationUrl}
                    className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#0095FF] hover:underline"
                >
                    Finish this payment
                    <ArrowUpRight size={13} />
                </a>
            )}

            {/*
                Worded so it cannot be read as a failure. Money may have left their
                account and nothing was handed over, so this says what we are doing
                about it rather than implying they need to try again.
            */}
            {payment.status === PaymentStatus.Flagged && (
                <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
                    <ShieldCheck size={13} className="mt-0.5 shrink-0" />
                    We&apos;re checking this one — the amount didn&apos;t match what we asked for,
                    so we held it for someone to look at. Nothing is needed from you.
                </p>
            )}

            {isRefund && (
                <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                    <RotateCcw size={13} className="mt-0.5 shrink-0" />
                    {payment.status === PaymentStatus.Refunded
                        ? "Refunded to the card or account you paid from. Your bank decides when it shows on your statement."
                        : "The refund has been sent to your bank and will appear on your statement shortly."}
                </p>
            )}
        </li>
    );
}
