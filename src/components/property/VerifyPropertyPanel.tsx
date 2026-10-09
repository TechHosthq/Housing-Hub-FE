"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Clock, Loader2, ShieldCheck } from "lucide-react";
import { useVerification } from "@/hooks/useVerification";
import { useToastStore } from "@/store/useToastStore";
import {
    VerificationSubjectType,
    VerificationTier,
    isCaseOpen,
} from "@/types/verification";

interface VerifyPropertyPanelProps {
    propertyId: string;
    /** The tier already held on this listing, from PropertyDetail. */
    verificationTier: VerificationTier;
}

/**
 * The owner's way into title verification, on the listing it concerns.
 *
 * It lived only on /verification, behind a dropdown of every property they own —
 * which meant the one moment an owner is looking at a particular listing was the
 * one place they could not act on it.
 *
 * Render this only for the owner. It queries the caller's own verification cases,
 * and the property page is public, so mounting it for a visitor would fire an
 * authenticated request on a page anyone can open.
 */
export default function VerifyPropertyPanel({ propertyId, verificationTier }: VerifyPropertyPanelProps) {
    const router = useRouter();
    const { showError } = useToastStore();
    const { useMyCases, startCase, isStartingCase } = useVerification();

    const { data: casesResponse, isLoading } = useMyCases();

    const openCase = (casesResponse?.data ?? []).find(
        (item) => item.subjectType === VerificationSubjectType.Property
            && item.subjectId === propertyId
            && isCaseOpen(item),
    );

    const begin = async () => {
        try {
            const result = await startCase({
                subjectType: VerificationSubjectType.Property,
                subjectId: propertyId,
            });

            if (result.isSuccessful && result.data) {
                router.push(`/verification/${result.data.id}`);
                return;
            }

            showError(result.message || "We couldn't start verification. Please try again.");
        } catch {
            showError("We couldn't start verification. Please try again.");
        }
    };

    // Already verified: nothing to start, and a button offering to do it again
    // would read as if the badge had lapsed.
    if (verificationTier >= VerificationTier.TitleVerified) {
        return (
            <div className="mb-8 flex items-start gap-3 rounded-[18px] border border-emerald-100 bg-emerald-50/60 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <BadgeCheck size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                <div>
                    <p className="text-[13px] font-bold text-emerald-900 dark:text-emerald-300">
                        Title verified
                    </p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-emerald-800/80 dark:text-emerald-200/70">
                        Renters see this badge on your listing. It&apos;s the strongest signal
                        we show.
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="mb-8 flex items-center justify-center rounded-[18px] border border-[#F2F2F2] py-8 dark:border-gray-800">
                <Loader2 className="animate-spin text-[#0095FF]" size={20} />
            </div>
        );
    }

    // A case is already in flight. Starting a second one for the same property is
    // refused by the server, so the way forward is the one that exists.
    if (openCase) {
        return (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-[#F2F2F2] bg-[#FAFAFA] p-5 dark:border-gray-800 dark:bg-gray-950/40">
                <div className="flex items-start gap-3">
                    <Clock size={18} className="mt-0.5 shrink-0 text-[#0095FF]" />
                    <div>
                        <p className="text-[13px] font-bold text-[#1A1A1A] dark:text-gray-100">
                            Verification under way
                        </p>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">
                            {openCase.documentCount === 0
                                ? "You haven't attached any documents yet."
                                : `${openCase.documentCount} document${openCase.documentCount === 1 ? "" : "s"} attached.`}
                        </p>
                    </div>
                </div>

                <Link
                    href={`/verification/${openCase.id}`}
                    className="shrink-0 rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white transition-colors hover:bg-[#071A33]"
                >
                    Continue
                </Link>
            </div>
        );
    }

    return (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-[#F2F2F2] bg-[#FAFAFA] p-5 dark:border-gray-800 dark:bg-gray-950/40">
            <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#0095FF]" />
                <div>
                    <p className="text-[13px] font-bold text-[#1A1A1A] dark:text-gray-100">
                        Verify this property
                    </p>
                    {/*
                        Says what the owner gets, not what we need. The documents are
                        the cost; the badge renters see is the reason to pay it.
                    */}
                    <p className="mt-0.5 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">
                        Send us the title documents and we&apos;ll show a verified badge on
                        this listing.
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={begin}
                disabled={isStartingCase}
                className="flex shrink-0 items-center gap-2 rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white transition-colors hover:bg-[#071A33] disabled:opacity-40"
            >
                {isStartingCase && <Loader2 size={14} className="animate-spin" />}
                Start verification
            </button>
        </div>
    );
}
