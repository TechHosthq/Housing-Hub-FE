"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
    ArrowLeft, Check, Clock, ExternalLink, Loader2, ShieldCheck, Trash2, Upload, XCircle,
} from "lucide-react";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import { useVerification } from "@/hooks/useVerification";
import verificationService from "@/services/verificationService";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import { DocumentPrompt, promptsFor } from "@/lib/verificationCatalogue";
import {
    DOCUMENT_TYPE_LABELS,
    DocumentReviewStatus,
    SUBJECT_TYPE_LABELS,
    VerificationCaseStatus,
    VerificationDocumentType,
} from "@/types/verification";

export default function VerificationCasePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const user = useAuthStore((state) => state.user);
    const { showSuccess, showError } = useToastStore();

    const {
        useMyCase, addDocument, isAddingDocument,
        removeDocument, submitCase, isSubmittingCase,
        cancelCase, isCancellingCase,
    } = useVerification();

    const { data: response, isLoading } = useMyCase(id);

    const router = useRouter();
    const [openPrompt, setOpenPrompt] = useState<VerificationDocumentType | null>(null);
    const [openingDocumentId, setOpeningDocumentId] = useState<string | null>(null);

    const detail = response?.data;
    const verificationCase = detail?.case;
    const documents = detail?.documents ?? [];
    const missing = detail?.missingRequiredDocuments ?? [];

    const isDraft = verificationCase?.status === VerificationCaseStatus.Draft;
    const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

    // Cancelling deletes the uploaded documents, so it asks first. Two clicks rather
    // than a modal: this is a draft nobody has reviewed, not a destructive action on
    // anything a decision rests on.
    const handleCancel = async () => {
        try {
            await cancelCase(id);
            router.push("/verification");
        } catch {
            setIsConfirmingCancel(false);
        }
    };
    const canSubmit = isDraft && missing.length === 0 && documents.length > 0;

    const prompts = verificationCase
        ? promptsFor(verificationCase.subjectType, user?.customerType)
        : [];

    const documentFor = (type: VerificationDocumentType) =>
        documents.find((d) => d.documentType === type);

    /**
     * Opens a document via a freshly minted link.
     *
     * Fetched on click and discarded — never held in state or put in an href. The
     * URL is a credential, and leaving it in the page leaves it for anyone who
     * inspects the DOM later.
     */
    const openDocument = async (documentId: string) => {
        setOpeningDocumentId(documentId);
        try {
            const result = await verificationService.getDocumentUrl(id, documentId);
            if (result.isSuccessful && result.data) {
                window.open(result.data, "_blank", "noopener,noreferrer");
            } else {
                showError("Could not open that document. Please try again.");
            }
        } finally {
            setOpeningDocumentId(null);
        }
    };

    const handleSubmit = async () => {
        try {
            const result = await submitCase(id);
            if (result.isSuccessful) {
                showSuccess("Submitted. We'll email you when it has been reviewed.");
            } else {
                // The server names what is missing, so pass its message through rather
                // than replacing it with something generic.
                showError(result.message || "Could not submit. Please try again.");
            }
        } catch {
            showError("Could not submit. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white dark:bg-gray-950">
                <DashboardNavbar />
                <div className="flex justify-center py-40">
                    <Loader2 className="animate-spin text-[#0095FF]" size={26} />
                </div>
                <Footer />
            </main>
        );
    }

    if (!verificationCase) {
        return (
            <main className="min-h-screen bg-white dark:bg-gray-950">
                <DashboardNavbar />
                <div className="max-w-3xl mx-auto px-6 pt-32 pb-20 text-center">
                    <p className="text-[15px] font-bold text-[#1A1A1A] dark:text-gray-100">
                        We couldn&apos;t find that request
                    </p>
                    <Link href="/verification" className="mt-4 inline-block text-[13px] font-bold text-[#0095FF]">
                        Back to verification
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white dark:bg-gray-950">
            <DashboardNavbar />

            <div className="max-w-3xl mx-auto px-6 md:px-8 pt-28 pb-20">
                <Link
                    href="/verification"
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold text-gray-400 hover:text-gray-600 mb-6"
                >
                    <ArrowLeft size={15} /> Back
                </Link>

                <h1 className="text-[24px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-1">
                    {SUBJECT_TYPE_LABELS[verificationCase.subjectType]} verification
                </h1>

                <StatusBanner
                    status={verificationCase.status}
                    note={verificationCase.decisionNote}
                    decidedAt={verificationCase.decidedAt}
                />

                {/* ── Documents ───────────────────────────────────────── */}

                <div className="space-y-3 mt-8">
                    {prompts.map((prompt) => {
                        const existing = documentFor(prompt.type);
                        const isOpenForm = openPrompt === prompt.type;

                        return (
                            <div
                                key={prompt.type}
                                className="rounded-[18px] border border-[#F2F2F2] dark:border-gray-800 p-5"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="flex flex-wrap items-center gap-2 text-[14px] font-bold text-[#1A1A1A] dark:text-gray-100">
                                            {prompt.label}
                                            {prompt.required && (
                                                <span className="rounded-full bg-[#0B2545] px-2 py-0.5 text-[10px] font-bold text-white">
                                                    Required
                                                </span>
                                            )}
                                        </p>
                                        <p className="mt-1 text-[12px] leading-relaxed text-gray-400 dark:text-gray-500">
                                            {prompt.help}
                                        </p>
                                    </div>

                                    {existing && <DocumentStatusChip status={existing.status} />}
                                </div>

                                {existing ? (
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <span className="text-[12px] text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
                                            {existing.originalFileName ?? "Uploaded"}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => openDocument(existing.id)}
                                            disabled={openingDocumentId === existing.id}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 px-3.5 py-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            {openingDocumentId === existing.id
                                                ? <Loader2 size={12} className="animate-spin" />
                                                : <ExternalLink size={12} />}
                                            View
                                        </button>

                                        {isDraft && (
                                            <button
                                                type="button"
                                                onClick={() => removeDocument({ caseId: id, documentId: existing.id })}
                                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 size={12} /> Remove
                                            </button>
                                        )}

                                        {existing.status === DocumentReviewStatus.Rejected
                                            && existing.rejectionReason && (
                                            <p className="w-full text-[12px] text-amber-700 dark:text-amber-400">
                                                {existing.rejectionReason}
                                            </p>
                                        )}
                                    </div>
                                ) : isDraft ? (
                                    isOpenForm ? (
                                        <UploadForm
                                            prompt={prompt}
                                            busy={isAddingDocument}
                                            onCancel={() => setOpenPrompt(null)}
                                            onUpload={async (file, metadata) => {
                                                try {
                                                    const result = await addDocument({
                                                        caseId: id, metadata, file,
                                                    });
                                                    if (result.isSuccessful) {
                                                        setOpenPrompt(null);
                                                        showSuccess("Document added.");
                                                    } else {
                                                        // Carries the real reason: wrong file type,
                                                        // too large, contents don't match the extension.
                                                        showError(result.message || "Could not add that document.");
                                                    }
                                                } catch {
                                                    showError("Could not add that document.");
                                                }
                                            }}
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setOpenPrompt(prompt.type)}
                                            className="mt-4 inline-flex items-center gap-1.5 rounded-full border-2 border-[#0B2545] px-4 py-2 text-[12px] font-bold text-[#0B2545] hover:bg-[#0B2545]/5"
                                        >
                                            <Upload size={13} /> Upload
                                        </button>
                                    )
                                ) : null}
                            </div>
                        );
                    })}
                </div>

                {/* ── Submit ──────────────────────────────────────────── */}

                {isDraft && (
                    <div className="mt-8 rounded-[18px] bg-gray-50 dark:bg-gray-900/50 p-6">
                        {missing.length > 0 ? (
                            <p className="mb-4 text-[13px] font-semibold text-amber-700 dark:text-amber-400">
                                Still needed:{" "}
                                {missing.map((m) => DOCUMENT_TYPE_LABELS[m] ?? "a document").join(", ")}
                            </p>
                        ) : (
                            <p className="mb-4 text-[13px] font-semibold text-emerald-700 dark:text-emerald-400">
                                Everything required is attached.
                            </p>
                        )}

                        <p className="mb-4 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">
                            Once you submit, your documents are locked while we review them. We&apos;ll
                            email you and post a notification here when there&apos;s a decision.
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!canSubmit || isSubmittingCase}
                                className="rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#071A33] disabled:opacity-40"
                            >
                                {isSubmittingCase ? "Submitting…" : "Submit for review"}
                            </button>

                            {isConfirmingCancel ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={isCancellingCase}
                                        className="rounded-full border-[2px] border-[#FF3B30] px-6 py-3 text-[13px] font-bold text-[#FF3B30] hover:bg-red-50 disabled:opacity-40"
                                    >
                                        {isCancellingCase ? "Cancelling…" : "Yes, cancel and delete"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsConfirmingCancel(false)}
                                        className="text-[12px] font-semibold text-gray-400 hover:text-gray-600"
                                    >
                                        Keep it
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmingCancel(true)}
                                    className="text-[12px] font-semibold text-gray-400 underline hover:text-[#FF3B30]"
                                >
                                    Cancel this request
                                </button>
                            )}
                        </div>

                        {isConfirmingCancel && (
                            <p className="mt-3 text-[12px] font-medium text-[#FF3B30]">
                                This deletes the documents you have uploaded. You can start a new
                                request afterwards.
                            </p>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}

/**
 * Upload form for one document type.
 *
 * The metadata fields are the point, not decoration — `nameOnDocument` in
 * particular is what the reviewer compares against the account holder, and it is
 * the check that catches a genuine document submitted by someone unconnected to
 * it. Asking for it explicitly is better than hoping to read it off a scan.
 */
function UploadForm({
    prompt, busy, onCancel, onUpload,
}: {
    prompt: DocumentPrompt;
    busy: boolean;
    onCancel: () => void;
    onUpload: (file: File, metadata: {
        documentType: VerificationDocumentType;
        documentNumber?: string | null;
        nameOnDocument?: string | null;
        expiresAt?: string | null;
    }) => void;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [documentNumber, setDocumentNumber] = useState("");
    const [nameOnDocument, setNameOnDocument] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    const input = "w-full rounded-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-[13px] outline-none focus:border-[#0095FF]";

    return (
        <div className="mt-4 space-y-3">
            <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-[12px] text-gray-500 file:mr-3 file:rounded-full file:border-0 file:bg-[#0B2545] file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-white"
            />
            <p className="text-[11px] text-gray-400">JPG, PNG, WebP or PDF, up to 15MB.</p>

            <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-500">
                    Name exactly as printed on the document
                </label>
                <input
                    value={nameOnDocument}
                    onChange={(e) => setNameOnDocument(e.target.value)}
                    placeholder="e.g. Adeyemi Properties Limited"
                    className={input}
                />
                <p className="mt-1 text-[11px] text-gray-400">
                    Copy it as written, even if it differs slightly from your account name.
                </p>
            </div>

            {prompt.numberLabel && (
                <div>
                    <label className="mb-1 block text-[11px] font-bold text-gray-500">
                        {prompt.numberLabel}
                    </label>
                    <input
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                        className={input}
                    />
                </div>
            )}

            {prompt.asksExpiry && (
                <div>
                    <label className="mb-1 block text-[11px] font-bold text-gray-500">
                        Expiry date
                    </label>
                    <input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className={input}
                    />
                    <p className="mt-1 text-[11px] text-gray-400">
                        We&apos;ll remind you before it lapses so your badge doesn&apos;t drop off.
                    </p>
                </div>
            )}

            <div className="flex gap-2 pt-1">
                <button
                    type="button"
                    disabled={!file || busy}
                    onClick={() => file && onUpload(file, {
                        documentType: prompt.type,
                        documentNumber: documentNumber.trim() || null,
                        nameOnDocument: nameOnDocument.trim() || null,
                        expiresAt: expiresAt || null,
                    })}
                    className="rounded-full bg-[#0B2545] px-5 py-2.5 text-[12px] font-bold text-white hover:bg-[#071A33] disabled:opacity-40"
                >
                    {busy ? "Uploading…" : "Add document"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-full px-4 py-2.5 text-[12px] font-bold text-gray-400 hover:text-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

/**
 * What the applicant is told about where their case stands.
 *
 * EscalatedNameMismatch is shown as ordinary "under review". The backend sends no
 * notification for it on purpose — naming the check that flagged them would tell a
 * would-be impersonator what to change — and this must not undo that.
 */
function StatusBanner({
    status, note, decidedAt,
}: {
    status: VerificationCaseStatus;
    note: string | null;
    decidedAt: string | null;
}) {
    if (status === VerificationCaseStatus.Draft) {
        return (
            <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500">
                Attach your documents below, then submit for review.
            </p>
        );
    }

    if (status === VerificationCaseStatus.Approved) {
        return (
            <div className="mt-4 flex gap-3 rounded-[16px] border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30 p-4">
                <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                <div>
                    <p className="text-[13px] font-bold text-emerald-800 dark:text-emerald-300">
                        Verified
                        {decidedAt && ` on ${format(new Date(decidedAt), "d MMMM yyyy")}`}
                    </p>
                    <p className="mt-0.5 text-[12px] text-emerald-900/70 dark:text-emerald-200/70">
                        Your badge is live and visible to renters.
                    </p>
                </div>
            </div>
        );
    }

    if (status === VerificationCaseStatus.Rejected) {
        return (
            <div className="mt-4 flex gap-3 rounded-[16px] border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4">
                <XCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div>
                    <p className="text-[13px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                        Not approved this time
                    </p>
                    {note && (
                        <p className="text-[12px] leading-relaxed text-amber-900/80 dark:text-amber-200/70">
                            {note}
                        </p>
                    )}
                    <p className="mt-2 text-[12px] text-amber-900/80 dark:text-amber-200/70">
                        You can start a new request with corrected documents — there&apos;s no
                        limit on attempts.
                    </p>
                </div>
            </div>
        );
    }

    if (status === VerificationCaseStatus.Expired) {
        return (
            <div className="mt-4 flex gap-3 rounded-[16px] border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4">
                <Clock className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <p className="text-[12px] leading-relaxed text-amber-900/80 dark:text-amber-200/70">
                    One of your documents has expired, so this verification has lapsed. Start a
                    new request with a current document to restore your badge.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-4 flex gap-3 rounded-[16px] border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 p-4">
            <Clock className="text-blue-600 shrink-0 mt-0.5" size={18} />
            <div>
                <p className="text-[13px] font-bold text-blue-900 dark:text-blue-300">
                    With our team
                </p>
                <p className="mt-0.5 text-[12px] text-blue-900/70 dark:text-blue-200/70">
                    Your documents are locked while we check them. We&apos;ll email you as soon
                    as there&apos;s a decision.
                </p>
            </div>
        </div>
    );
}

function DocumentStatusChip({ status }: { status: DocumentReviewStatus }) {
    const config: Record<number, { label: string; tone: string }> = {
        [DocumentReviewStatus.Pending]: {
            label: "Awaiting review", tone: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
        },
        [DocumentReviewStatus.Approved]: {
            label: "Accepted", tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
        },
        [DocumentReviewStatus.Rejected]: {
            label: "Needs replacing", tone: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
        },
        [DocumentReviewStatus.Expired]: {
            label: "Expired", tone: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
        },
    };

    const { label, tone } = config[status];

    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${tone}`}>
            {status === DocumentReviewStatus.Approved && <Check size={11} />}
            {label}
        </span>
    );
}
