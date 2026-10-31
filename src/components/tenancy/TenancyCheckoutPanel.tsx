"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleAlert, CreditCard, Loader2, Lock } from "lucide-react";
import { useTenancy } from "@/hooks/useTenancy";
import { TenancyStatus } from "@/types/tenancy";
import { formatKobo } from "@/utils/money";
import { resolveMutationError } from "@/utils/errorResolver";

interface TenancyCheckoutPanelProps {
    tenancyId: string;
}

/**
 * The last step: the tenant pays and the let starts.
 *
 * Every line is shown before anything is charged, including our commission, which
 * is named as ours. The tenant agreed to the rent and the owner's fees long before
 * this screen — the commission and the card fee are the parts they have not seen,
 * so they are the parts that have to be spelled out rather than rolled into a
 * total.
 */
export default function TenancyCheckoutPanel({ tenancyId }: TenancyCheckoutPanelProps) {
    const { usePaymentQuote, startPayment, isStartingPayment } = useTenancy();
    const { data: quoteResponse, isLoading } = usePaymentQuote(tenancyId);

    const [error, setError] = useState("");

    const quote = quoteResponse?.data;

    const pay = async () => {
        setError("");

        try {
            const result = await startPayment({
                tenancyId,
                // Back to this page. The server drops it unless it points at one of
                // our own front ends, so there is no harm in sending it.
                callbackUrl: `${window.location.origin}/tenancies/${tenancyId}`,
            });

            if (result.isSuccessful && result.data?.authorisationUrl) {
                // Replaced rather than opened: the gateway is the next step of this
                // flow, not a detour, and a popup here would be blocked anyway.
                window.location.href = result.data.authorisationUrl;
                return;
            }

            setError(result.message || "We couldn't start that payment. Please try again.");
        } catch (failure) {
            setError(resolveMutationError(failure).join(" "));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center rounded-[22px] border border-[#F2F2F2] bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
                <Loader2 className="animate-spin text-[#0095FF]" size={24} />
            </div>
        );
    }

    if (!quote) return null;

    if (quote.isAlreadyPaid || quote.tenancyStatus === TenancyStatus.Active) {
        return (
            <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/60 p-8 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <h2 className="text-[16px] font-black text-emerald-900 dark:text-emerald-300">
                    Paid — the tenancy is running
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-emerald-800/80 dark:text-emerald-200/70">
                    {formatKobo(quote.totalKobo)} received. The rent has gone to the owner and
                    your receipt is in{" "}
                    <Link href="/payments" className="font-bold underline">
                        your payments
                    </Link>
                    .
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-[22px] border border-[#F2F2F2] bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-[16px] font-black text-[#1A1A1A] dark:text-gray-100">
                Pay and move in
            </h2>
            <p className="mt-1 text-[12px] text-gray-400 dark:text-gray-500">
                Everything is agreed. This is the last step.
            </p>

            <dl className="mt-6 space-y-3">
                <Line label="Rent" amountKobo={quote.rentKobo} />

                {quote.fees.map((fee) => (
                    <Line key={fee.id} label={fee.name} note={fee.description} amountKobo={fee.amountKobo} />
                ))}

                {/*
                    Named as ours. A tenant who discovers this on a bank statement
                    disputes it; one who agreed to it on this screen does not.
                */}
                <Line
                    label="Housing Hub service charge"
                    note="What we charge for handling the let"
                    amountKobo={quote.commissionKobo}
                />
                <Line
                    label="Card processing"
                    note="Charged by our payment provider, not by us"
                    amountKobo={quote.processingFeeKobo}
                />
            </dl>

            <div className="mt-5 flex items-center justify-between gap-6 border-t border-gray-100 pt-5 dark:border-gray-800">
                <span className="text-[13px] font-black text-[#1A1A1A] dark:text-gray-100">Total</span>
                <span className="font-montserrat text-[22px] font-black text-[#0B2545] dark:text-[#6BB5FF]">
                    {formatKobo(quote.totalKobo)}
                </span>
            </div>

            {error && (
                <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-[12px] leading-relaxed text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </p>
            )}

            {/*
                The tenant has done nothing wrong and can do nothing about this, so
                it says who is holding it up rather than refusing on the button.
            */}
            {!quote.ownerCanBePaid ? (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/30">
                    <CircleAlert size={16} className="mt-0.5 shrink-0 text-amber-600" />
                    <p className="text-[12px] leading-relaxed text-amber-800 dark:text-amber-300">
                        The owner hasn&apos;t set up an account to be paid into yet. We&apos;ve
                        told them — you&apos;ll be able to pay as soon as they have.
                    </p>
                </div>
            ) : !quote.isPayable ? (
                <p className="mt-6 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">
                    Every document has to be accepted before you can pay.
                </p>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={pay}
                        disabled={isStartingPayment}
                        className="mt-6 flex items-center gap-2 rounded-full bg-primary-dark px-7 py-3.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                        {isStartingPayment
                            ? <Loader2 size={16} className="animate-spin" />
                            : <CreditCard size={16} />}
                        Pay {formatKobo(quote.totalKobo)}
                    </button>

                    <p className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Lock size={12} />
                        You&apos;ll pay on our provider&apos;s secure page. The rent goes straight
                        to the owner — we never hold it.
                    </p>
                </>
            )}
        </div>
    );
}

function Line({ label, note, amountKobo }: { label: string; note?: string; amountKobo: number }) {
    return (
        <div className="flex items-start justify-between gap-6">
            <dt className="min-w-0">
                <span className="block text-[13px] font-bold text-[#1A1A1A] dark:text-gray-200">{label}</span>
                {note && (
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
                        {note}
                    </span>
                )}
            </dt>
            <dd className="shrink-0 text-[13px] font-bold text-[#1A1A1A] dark:text-gray-200">
                {formatKobo(amountKobo)}
            </dd>
        </div>
    );
}
