"use client";

import { use, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Loader2 } from "lucide-react";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import ComposeDocumentsPanel from "@/components/tenancy/ComposeDocumentsPanel";
import ReviewDocumentsPanel from "@/components/tenancy/ReviewDocumentsPanel";
import TenantDocumentsPanel from "@/components/tenancy/TenantDocumentsPanel";
import { useTenancy } from "@/hooks/useTenancy";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import { TENANCY_STATUS_LABELS, TenancyStatus, isTenancyLive } from "@/types/tenancy";
import { formatKobo } from "@/utils/money";
import { resolveApiError } from "@/utils/errorResolver";

/**
 * One tenancy, from whichever side you are on.
 *
 * A single route rather than an owner route and a tenant route. Which side you are
 * on is a fact about the tenancy, not about the URL, and two routes would mean
 * either guessing before navigating or letting somebody open the other party's
 * screen and find it empty.
 */
export default function TenancyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const { showSuccess, showError } = useToastStore();
    const currentUserId = useAuthStore((state) => state.user?.id);
    const {
        useTenancyDetail, useDocumentPack,
        declineTenancy, isDeclining,
    } = useTenancy();

    const { data: tenancyResponse, isLoading: isLoadingTenancy } = useTenancyDetail(id);
    const { data: packResponse, isLoading: isLoadingPack } = useDocumentPack(id);

    const [confirmingDecline, setConfirmingDecline] = useState(false);

    const tenancy = tenancyResponse?.data;
    const pack = packResponse?.data;
    const isOwner = !!tenancy && !!currentUserId && tenancy.landlordCustomerId === currentUserId;

    const handleDecline = async () => {
        try {
            const result = await declineTenancy(id);
            if (result.isSuccessful) {
                showSuccess(result.message || "We've told the owner.");
                setConfirmingDecline(false);
                return;
            }
            showError(result.message || "Could not do that.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    const isLoading = isLoadingTenancy || isLoadingPack;

    return (
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950">
            <DashboardNavbar />

            <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
                <Link
                    href="/tenancies"
                    className="mb-8 flex items-center gap-2 text-[11px] font-semibold text-[#6BB5FF] transition-colors hover:text-primary-dark"
                >
                    <ArrowLeft size={16} />
                    Back to my tenancies
                </Link>

                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="animate-spin text-[#0095FF]" size={28} />
                    </div>
                ) : !tenancy || !pack ? (
                    <div className="rounded-[22px] border border-[#F2F2F2] bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-[15px] font-bold text-[#1A1A1A] dark:text-gray-100">
                            We couldn&apos;t find that tenancy
                        </p>
                        <p className="mt-1 text-[12px] text-gray-400 dark:text-gray-500">
                            It may have been closed, or it isn&apos;t one of yours.
                        </p>
                    </div>
                ) : (
                    <>
                        <header className="mb-8">
                            <h1 className="font-montserrat text-[26px] font-black text-[#1A1A1A] dark:text-gray-100">
                                {tenancy.propertyTitle ?? pack.propertyTitle ?? "This property"}
                            </h1>
                            <p className="mt-1 text-[13px] font-medium text-gray-400 dark:text-gray-500">
                                {isOwner
                                    ? `You're letting this to ${tenancy.tenantName ?? "your chosen tenant"}`
                                    : `${tenancy.landlordName ?? "The owner"} chose you on ${format(new Date(tenancy.selectedAt), "d MMM yyyy")}`}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <span className="rounded-full bg-[#0B2545] px-3 py-1.5 text-[11px] font-bold text-white">
                                    {TENANCY_STATUS_LABELS[tenancy.status] ?? "In progress"}
                                </span>
                                <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400">
                                    Rent {formatKobo(tenancy.agreedRentKobo)}
                                </span>
                            </div>
                        </header>

                        {!isTenancyLive(tenancy.status) ? (
                            <div className="rounded-[22px] border border-[#F2F2F2] bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                                <p className="text-[15px] font-bold text-[#1A1A1A] dark:text-gray-100">
                                    {tenancy.status === TenancyStatus.Withdrawn
                                        ? "The owner withdrew"
                                        : tenancy.status === TenancyStatus.DeclinedByCandidate
                                            ? "This was declined"
                                            : "This tenancy has ended"}
                                </p>
                                {/* Shown verbatim — it is the whole difference between a reason and silence. */}
                                {tenancy.withdrawnReason && (
                                    <p className="mt-2 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">
                                        &ldquo;{tenancy.withdrawnReason}&rdquo;
                                    </p>
                                )}
                                <p className="mt-3 text-[12px] text-gray-400 dark:text-gray-500">
                                    The listing is back on the market.
                                </p>
                            </div>
                        ) : isOwner ? (
                            <>
                                {tenancy.status === TenancyStatus.CandidateSelected ? (
                                    <ComposeDocumentsPanel
                                        tenancyId={id}
                                        pack={pack}
                                        leaseType={tenancy.leaseType}
                                    />
                                ) : (
                                    <ReviewDocumentsPanel tenancyId={id} pack={pack} />
                                )}

                                <p className="mt-6 text-[12px] text-gray-400 dark:text-gray-500">
                                    Changed your mind?{" "}
                                    <Link
                                        href={`/properties/${tenancy.propertyId}/tenancy`}
                                        className="font-semibold text-[#0095FF] hover:text-primary-dark"
                                    >
                                        Withdraw and choose someone else
                                    </Link>
                                </p>
                            </>
                        ) : (
                            <>
                                {tenancy.status === TenancyStatus.CandidateSelected ? (
                                    <div className="rounded-[22px] border border-[#F2F2F2] bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                                        <p className="text-[15px] font-bold text-[#1A1A1A] dark:text-gray-100">
                                            You&apos;ve been chosen for this property
                                        </p>
                                        <p className="mt-2 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">
                                            The owner is putting the paperwork together. You&apos;ll get an
                                            email the moment it&apos;s ready, with everything it will cost
                                            before you agree to anything.
                                        </p>
                                    </div>
                                ) : (
                                    <TenantDocumentsPanel tenancyId={id} pack={pack} />
                                )}

                                {/*
                                    Exists so a selection cannot get stuck. Without it an owner
                                    whose candidate has moved on waits indefinitely while the
                                    property sits under offer.
                                */}
                                {tenancy.status !== TenancyStatus.Active && (
                                    <div className="mt-6 rounded-[22px] border border-[#F2F2F2] bg-white p-7 dark:border-gray-800 dark:bg-gray-900">
                                        {confirmingDecline ? (
                                            <div className="space-y-3">
                                                <p className="text-[13px] leading-relaxed text-[#1A1A1A] dark:text-gray-200">
                                                    We&apos;ll tell the owner and the property goes back on
                                                    the market. You can&apos;t undo this — they&apos;d have
                                                    to choose you again.
                                                </p>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={handleDecline}
                                                        disabled={isDeclining}
                                                        className="flex items-center gap-2 rounded-full border-[2px] border-[#FF3B30] px-6 py-3 text-[13px] font-bold text-[#FF3B30] hover:bg-red-50 disabled:opacity-40"
                                                    >
                                                        {isDeclining && <Loader2 size={14} className="animate-spin" />}
                                                        Yes, I&apos;m out
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmingDecline(false)}
                                                        className="text-[12px] font-semibold text-gray-400 hover:text-gray-600"
                                                    >
                                                        Keep going
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setConfirmingDecline(true)}
                                                className="text-[12px] font-semibold text-gray-400 underline hover:text-[#FF3B30]"
                                            >
                                                I&apos;m no longer interested
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </main>
    );
}
