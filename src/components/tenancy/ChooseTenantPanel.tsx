"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CircleAlert, Loader2, ShieldCheck, UserCheck, Users } from "lucide-react";
import { useTenancy } from "@/hooks/useTenancy";
import { useToastStore } from "@/store/useToastStore";
import {
    TENANCY_STATUS_LABELS,
    Tenancy,
    TenancyCandidate,
    isTenancyLive,
} from "@/types/tenancy";
import { formatKobo } from "@/utils/money";
import { resolveApiError } from "@/utils/errorResolver";

interface ChooseTenantPanelProps {
    propertyId: string;
}

/**
 * Picking somebody, or showing who was picked.
 *
 * The live tenancy comes from the caller's own list rather than a per-property
 * lookup: there is no endpoint for "the tenancy on this property" and there should
 * not be, because the answer is only any of your business if you are a party to it.
 */
export default function ChooseTenantPanel({ propertyId }: ChooseTenantPanelProps) {
    const { showSuccess, showError } = useToastStore();
    const {
        useCandidates, useMyTenancies,
        selectCandidate, isSelecting,
        withdrawTenancy, isWithdrawing,
    } = useTenancy();

    const { data: candidatesResponse, isLoading: isLoadingCandidates } = useCandidates(propertyId);
    const { data: tenanciesResponse, isLoading: isLoadingTenancies } = useMyTenancies();

    const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);
    const [withdrawReason, setWithdrawReason] = useState("");

    const candidates = candidatesResponse?.data ?? [];
    const live = (tenanciesResponse?.data ?? []).find(
        (t) => t.propertyId === propertyId && isTenancyLive(t.status),
    );

    const handleSelect = async (candidate: TenancyCandidate) => {
        try {
            const result = await selectCandidate({ propertyId, customerId: candidate.customerId });
            if (result.isSuccessful) {
                showSuccess(result.message || "Chosen. We've let them know.");
                return;
            }
            // The server's message names the actual obstacle — already chosen, no
            // price on the listing, never inspected — all of which the owner can act
            // on. Replacing it with something generic would not help.
            showError(result.message || "Could not choose that person.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    const handleWithdraw = async (tenancy: Tenancy) => {
        try {
            const result = await withdrawTenancy({
                tenancyId: tenancy.id,
                reason: withdrawReason.trim() || null,
            });
            if (result.isSuccessful) {
                showSuccess(result.message || "Withdrawn. The listing is available again.");
                setConfirmingWithdraw(false);
                setWithdrawReason("");
                return;
            }
            showError(result.message || "Could not withdraw.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    if (isLoadingCandidates || isLoadingTenancies) {
        return (
            <div className="flex items-center justify-center rounded-[22px] border border-[#F2F2F2] bg-white py-20 dark:border-gray-800 dark:bg-gray-900">
                <Loader2 className="animate-spin text-[#0095FF]" size={26} />
            </div>
        );
    }

    // ── Somebody is already chosen ───────────────────────────────

    if (live) {
        return (
            <div className="rounded-[22px] border border-[#F2F2F2] bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-start gap-3">
                    <UserCheck size={20} className="mt-0.5 shrink-0 text-emerald-600" />
                    <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-black text-[#1A1A1A] dark:text-gray-100">
                            {live.tenantName ?? "Your chosen tenant"}
                        </p>
                        <p className="mt-0.5 text-[12px] text-gray-400 dark:text-gray-500">
                            Chosen {format(new Date(live.selectedAt), "d MMM yyyy")} · rent{" "}
                            {formatKobo(live.agreedRentKobo)}
                        </p>
                        <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            {TENANCY_STATUS_LABELS[live.status] ?? "In progress"}
                        </span>
                    </div>
                </div>

                {/*
                    The rent is the figure captured when they were chosen, not the
                    listing's current price. Saying so here is what stops an owner
                    editing the listing and expecting the agreement to follow.
                */}
                <p className="mt-5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                    The rent above was fixed when you chose them. Editing the listing price
                    won&apos;t change it — this is what the agreement and the payment will be
                    based on.
                </p>

                <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
                    {confirmingWithdraw ? (
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Why are you withdrawing? (optional)
                            </label>
                            <textarea
                                value={withdrawReason}
                                onChange={(e) => setWithdrawReason(e.target.value)}
                                rows={2}
                                placeholder="e.g. Taking the property off the market"
                                className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[13px] placeholder:text-gray-300 focus:border-[#0B2545] focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600"
                            />
                            <p className="text-[11px] text-gray-400">
                                Shown to them word for word. The listing goes back on the market.
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleWithdraw(live)}
                                    disabled={isWithdrawing}
                                    className="flex items-center gap-2 rounded-full border-[2px] border-[#FF3B30] px-6 py-3 text-[13px] font-bold text-[#FF3B30] hover:bg-red-50 disabled:opacity-40"
                                >
                                    {isWithdrawing && <Loader2 size={14} className="animate-spin" />}
                                    Yes, withdraw
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmingWithdraw(false)}
                                    className="text-[12px] font-semibold text-gray-400 hover:text-gray-600"
                                >
                                    Keep them
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConfirmingWithdraw(true)}
                            className="text-[12px] font-semibold text-gray-400 underline hover:text-[#FF3B30]"
                        >
                            Withdraw and choose someone else
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── Nobody chosen yet ────────────────────────────────────────

    if (candidates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-[22px] border border-[#F2F2F2] bg-white py-20 text-center dark:border-gray-800 dark:bg-gray-900">
                <Users className="mb-4 text-gray-300" size={38} />
                <p className="mb-1 text-[15px] font-bold text-[#1A1A1A] dark:text-gray-100">
                    Nobody to choose from yet
                </p>
                <p className="max-w-sm text-[12px] leading-relaxed text-gray-400 dark:text-gray-500">
                    People appear here once they&apos;ve completed an inspection. Someone who
                    booked a viewing but didn&apos;t attend hasn&apos;t seen the property, so
                    they aren&apos;t listed.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-[22px] border border-[#F2F2F2] bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-[16px] font-black text-[#1A1A1A] dark:text-gray-100">
                {candidates.length === 1 ? "1 person has viewed this" : `${candidates.length} people have viewed this`}
            </h2>
            <p className="mt-1 text-[12px] text-gray-400 dark:text-gray-500">
                Choosing somebody marks the listing under offer and tells them. You can
                withdraw afterwards if it doesn&apos;t work out.
            </p>

            <ul className="mt-6 divide-y divide-gray-100 dark:divide-gray-800">
                {candidates.map((candidate) => (
                    <li key={candidate.customerId} className="flex flex-wrap items-center justify-between gap-4 py-4">
                        <div className="min-w-0">
                            <p className="text-[14px] font-bold text-[#1A1A1A] dark:text-gray-100">
                                {candidate.name ?? "Housing Hub user"}
                            </p>
                            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                                Viewed {format(new Date(candidate.inspectedOn), "d MMM yyyy")}
                            </p>

                            {/*
                                Identity, not creditworthiness, and the wording has to keep
                                those apart. It means an admin checked a government ID
                                against the account holder — it says nothing about whether
                                they can afford the rent.
                            */}
                            {candidate.isIdentityVerified ? (
                                <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                                    <ShieldCheck size={13} />
                                    Identity verified
                                </span>
                            ) : (
                                <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                                    <CircleAlert size={13} />
                                    Identity not yet verified
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => handleSelect(candidate)}
                            disabled={isSelecting}
                            className="flex shrink-0 items-center gap-2 rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#071A33] disabled:opacity-40"
                        >
                            {isSelecting && <Loader2 size={14} className="animate-spin" />}
                            Choose
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
