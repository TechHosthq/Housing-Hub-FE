"use client";

import Link from "next/link";
import { BadgeCheck, Clock, Loader2 } from "lucide-react";
import { useTenancy } from "@/hooks/useTenancy";
import { TenancyStatus } from "@/types/tenancy";
import { formatKobo } from "@/utils/money";

interface OwnerPaymentPanelProps {
    tenancyId: string;
    tenancyStatus: TenancyStatus;
}

/**
 * The money, from the owner's side.
 *
 * The documents panel used to carry this, keyed on every document being accepted —
 * so it said "the tenant pays next" for as long as the tenancy existed, including
 * after they had paid. Whether somebody has paid is a fact about the tenancy, not
 * about its paperwork, and this reads it from there.
 */
export default function OwnerPaymentPanel({ tenancyId, tenancyStatus }: OwnerPaymentPanelProps) {
    const { usePaymentQuote } = useTenancy();
    const { data: quoteResponse, isLoading } = usePaymentQuote(tenancyId);

    const quote = quoteResponse?.data;

    if (isLoading) {
        return (
            <div className="mt-6 flex items-center justify-center rounded-[22px] border border-[#F2F2F2] bg-white py-12 dark:border-gray-800 dark:bg-gray-900">
                <Loader2 className="animate-spin text-[#0095FF]" size={22} />
            </div>
        );
    }

    if (!quote) return null;

    const isPaid = tenancyStatus === TenancyStatus.Active || quote.isAlreadyPaid;

    if (isPaid) {
        return (
            <div className="mt-6 rounded-[22px] border border-emerald-100 bg-emerald-50/60 p-8 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <p className="flex items-center gap-2 text-[15px] font-black text-emerald-900 dark:text-emerald-300">
                    <BadgeCheck size={18} />
                    Paid — the let is running
                </p>

                {/*
                    What reached the owner, not what the tenant was charged. Our
                    commission and the card fee were added on top and never belonged
                    to them, so showing the total here would overstate what landed.
                */}
                <p className="mt-2 text-[13px] leading-relaxed text-emerald-800/90 dark:text-emerald-200/80">
                    {formatKobo(quote.rentKobo + quote.ownerFeesKobo)} has been sent to your
                    payout account — the rent plus your fees, in full. It goes straight from
                    the tenant to your bank; we never hold it.
                </p>

                <p className="mt-3 text-[11px] text-emerald-800/70 dark:text-emerald-200/60">
                    The tenant paid {formatKobo(quote.totalKobo)}. The difference is our
                    service charge and the card fee, both of which they bore.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-6 rounded-[22px] border border-[#F2F2F2] bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <p className="flex items-center gap-2 text-[15px] font-black text-[#1A1A1A] dark:text-gray-100">
                <Clock size={18} className="text-[#0095FF]" />
                {tenancyStatus === TenancyStatus.AwaitingPayment
                    ? "They've started paying"
                    : "Waiting for the tenant to pay"}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#666666] dark:text-gray-400">
                You&apos;ll be paid {formatKobo(quote.rentKobo + quote.ownerFeesKobo)} — the
                rent and your fees in full — as soon as it goes through. We&apos;ll tell you
                when it lands.
            </p>

            {/*
                The tenant cannot pay until there is somewhere to send it, and they
                have no way to fix that. Named here because it is the owner's to do.
            */}
            {!quote.ownerCanBePaid && (
                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                    You haven&apos;t told us where to pay you yet, so your tenant can&apos;t
                    pay.{" "}
                    <Link href="/payout" className="font-bold underline">
                        Add a payout account
                    </Link>
                    .
                </p>
            )}
        </div>
    );
}
