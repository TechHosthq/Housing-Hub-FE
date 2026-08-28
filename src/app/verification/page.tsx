"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Building2, Clock, FileText, Home, Loader2, ShieldCheck, XCircle } from "lucide-react";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/profile/AccountSidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useVerification } from "@/hooks/useVerification";
import { useProperty } from "@/hooks/useProperty";
import { isBusinessAccount } from "@/lib/verificationCatalogue";
import { useToastStore } from "@/store/useToastStore";
import {
    CASE_STATUS_LABELS,
    SUBJECT_TYPE_LABELS,
    VerificationCase,
    VerificationCaseStatus,
    VerificationSubjectType,
} from "@/types/verification";

export default function VerificationHubPage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { showError } = useToastStore();

    const { useMyCases, startCase, isStartingCase } = useVerification();
    const { data: casesResponse, isLoading } = useMyCases();

    const { useMyProperties } = useProperty();
    const { data: propertiesResponse } = useMyProperties();

    const [propertyId, setPropertyId] = useState("");

    const cases = casesResponse?.data ?? [];
    const properties = propertiesResponse?.data?.items ?? [];

    const canVerifyBusiness = isBusinessAccount(user?.customerType);

    // One open business case at a time. Offering "start" again when a draft already
    // exists reads as if the first one was lost.
    const openBusinessCase = cases.find(
        (c) => c.subjectType === VerificationSubjectType.Business && isOpen(c),
    );

    const begin = async (subjectType: VerificationSubjectType, subjectId?: string) => {
        try {
            const result = await startCase({ subjectType, subjectId: subjectId ?? null });
            if (result.isSuccessful && result.data) {
                router.push(`/verification/${result.data.id}`);
            } else {
                showError(result.message || "Could not start verification. Please try again.");
            }
        } catch {
            showError("Could not start verification. Please try again.");
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-gray-950">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-20">
                <div className="flex flex-col lg:flex-row gap-10">
                    <AccountSidebar />

                    <div className="flex-1 min-w-0">
                        <h1 className="text-[26px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-1">
                            Verification
                        </h1>
                        <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500 mb-8">
                            Verified profiles get more enquiries. Renters can see who has been checked.
                        </p>

                        {/* ── Start something new ─────────────────────── */}

                        <div className="grid gap-4 sm:grid-cols-2 mb-10">
                            {canVerifyBusiness && (
                                <div className="rounded-[20px] border border-[#F2F2F2] dark:border-gray-800 p-6">
                                    <Building2 className="text-[#0095FF] mb-3" size={22} />
                                    <h2 className="text-[15px] font-black text-[#1A1A1A] dark:text-gray-100 mb-1">
                                        Verify your business
                                    </h2>
                                    <p className="text-[12px] leading-relaxed text-gray-400 dark:text-gray-500 mb-4">
                                        Your CAC certificate, plus your LASRERA registration if you
                                        operate in Lagos. Shows renters you are a registered company.
                                    </p>

                                    {openBusinessCase ? (
                                        <Link
                                            href={`/verification/${openBusinessCase.id}`}
                                            className="inline-block rounded-full bg-[#0B2545] px-5 py-2.5 text-[12px] font-bold text-white hover:bg-[#071A33]"
                                        >
                                            {openBusinessCase.status === VerificationCaseStatus.Draft
                                                ? "Continue"
                                                : "View progress"}
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => begin(VerificationSubjectType.Business)}
                                            disabled={isStartingCase}
                                            className="rounded-full bg-[#0B2545] px-5 py-2.5 text-[12px] font-bold text-white hover:bg-[#071A33] disabled:opacity-60"
                                        >
                                            {isStartingCase ? "Starting…" : "Start"}
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="rounded-[20px] border border-[#F2F2F2] dark:border-gray-800 p-6">
                                <Home className="text-[#0095FF] mb-3" size={22} />
                                <h2 className="text-[15px] font-black text-[#1A1A1A] dark:text-gray-100 mb-1">
                                    Verify a property
                                </h2>
                                <p className="text-[12px] leading-relaxed text-gray-400 dark:text-gray-500 mb-4">
                                    Title documents for one of your listings. Verification applies to
                                    the property, so each one is checked separately.
                                </p>

                                {properties.length === 0 ? (
                                    <p className="text-[12px] font-semibold text-gray-400">
                                        You have no listings yet.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <select
                                            value={propertyId}
                                            onChange={(e) => setPropertyId(e.target.value)}
                                            className="rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-[12px] font-semibold outline-none focus:border-[#0095FF] max-w-full"
                                        >
                                            <option value="">Choose a listing…</option>
                                            {properties.map((property) => (
                                                <option key={property.id} value={property.id}>
                                                    {property.title}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            disabled={!propertyId || isStartingCase}
                                            onClick={() => begin(VerificationSubjectType.Property, propertyId)}
                                            className="rounded-full bg-[#0B2545] px-5 py-2.5 text-[12px] font-bold text-white hover:bg-[#071A33] disabled:opacity-40"
                                        >
                                            Start
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Existing requests ───────────────────────── */}

                        <h2 className="text-[15px] font-black text-[#1A1A1A] dark:text-gray-100 mb-3">
                            Your requests
                        </h2>

                        {isLoading ? (
                            <div className="flex justify-center py-16">
                                <Loader2 className="animate-spin text-[#0095FF]" size={24} />
                            </div>
                        ) : cases.length === 0 ? (
                            <p className="rounded-[16px] border border-dashed border-gray-200 dark:border-gray-800 p-8 text-center text-[13px] text-gray-400">
                                Nothing yet. Start a verification above.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {cases.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/verification/${item.id}`}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[#F2F2F2] dark:border-gray-800 p-5 hover:border-[#0095FF]/40 transition-colors"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-[14px] font-bold text-[#1A1A1A] dark:text-gray-100">
                                                {SUBJECT_TYPE_LABELS[item.subjectType]} verification
                                            </p>
                                            <p className="mt-0.5 text-[12px] text-gray-400 dark:text-gray-500">
                                                {item.documentCount} document{item.documentCount === 1 ? "" : "s"}
                                                {item.submittedAt
                                                    && ` · submitted ${format(new Date(item.submittedAt), "d MMM yyyy")}`}
                                            </p>
                                        </div>
                                        <StatusChip status={item.status} />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

function isOpen(item: VerificationCase): boolean {
    return item.status === VerificationCaseStatus.Draft
        || item.status === VerificationCaseStatus.Submitted
        || item.status === VerificationCaseStatus.UnderReview;
}

/**
 * The applicant's view of a case's state.
 *
 * EscalatedNameMismatch is shown as "Under review" on purpose. Naming the check
 * that flagged them would tell a would-be impersonator exactly what to change,
 * and the backend deliberately sends no notification for it — the UI must not
 * undo that by labelling it.
 */
function StatusChip({ status }: { status: VerificationCaseStatus }) {
    const config: Record<number, { label: string; tone: string; Icon: typeof Clock }> = {
        [VerificationCaseStatus.Draft]: {
            label: "Draft", tone: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300", Icon: FileText,
        },
        [VerificationCaseStatus.Submitted]: {
            label: "Awaiting review", tone: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400", Icon: Clock,
        },
        [VerificationCaseStatus.UnderReview]: {
            label: "Under review", tone: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400", Icon: Clock,
        },
        [VerificationCaseStatus.EscalatedNameMismatch]: {
            label: "Under review", tone: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400", Icon: Clock,
        },
        [VerificationCaseStatus.Approved]: {
            label: "Verified", tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400", Icon: ShieldCheck,
        },
        [VerificationCaseStatus.Rejected]: {
            label: "Needs attention", tone: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400", Icon: XCircle,
        },
        [VerificationCaseStatus.Expired]: {
            label: "Expired", tone: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400", Icon: Clock,
        },
    };

    const { label, tone, Icon } = config[status]
        ?? { label: CASE_STATUS_LABELS[status] ?? "—", tone: "bg-gray-100 text-gray-600", Icon: Clock };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${tone}`}>
            <Icon size={12} />
            {label}
        </span>
    );
}
