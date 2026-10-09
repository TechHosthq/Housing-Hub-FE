"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
    CheckCircle2, Clock, Download, Eye, Loader2, PenLine, Upload,
} from "lucide-react";
import { useTenancy } from "@/hooks/useTenancy";
import { useToastStore } from "@/store/useToastStore";
import {
    TENANCY_DOCUMENT_STATUS_LABELS,
    TenancyDocument,
    TenancyDocumentMode,
    TenancyDocumentPack,
    TenancyDocumentStatus,
} from "@/types/tenancy";
import { resolveApiError } from "@/utils/errorResolver";
import CostsSummary from "./CostsSummary";
import { DOCUMENT_ACCEPT, DOCUMENT_MODE_COPY, DocumentStatusPill, rejectFile } from "./documentPresentation";
import { useOpenDocument } from "./useOpenDocument";

interface TenantDocumentsPanelProps {
    tenancyId: string;
    pack: TenancyDocumentPack;
}

/** Requested and Returned are the tenant's to act on; the rest are waiting on the owner. */
const isWithTenant = (document: TenancyDocument) =>
    document.status === TenancyDocumentStatus.Requested
    || document.status === TenancyDocumentStatus.Rejected;

/**
 * Everything the tenant has been asked for.
 *
 * The costs come first on the page, before any document. They are carried in the
 * same response as the documents precisely so they can be seen before anything is
 * signed, and putting them underneath would undo that.
 */
export default function TenantDocumentsPanel({ tenancyId, pack }: TenantDocumentsPanelProps) {
    const { showSuccess, showError } = useToastStore();
    const { submitDocument, isSubmittingDocument, signDocument, isSigningDocument } = useTenancy();
    const { openDocument, openingId } = useOpenDocument(tenancyId);

    const [confirmingSignId, setConfirmingSignId] = useState<string | null>(null);

    const handleUpload = async (document: TenancyDocument, file: File) => {
        const problem = rejectFile(file);
        if (problem) {
            showError(problem);
            return;
        }

        try {
            const result = await submitDocument({ tenancyId, documentId: document.id, file });
            if (result.isSuccessful) {
                showSuccess(result.message || "Sent to the owner.");
                return;
            }
            showError(result.message || "Could not send that.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    const handleSign = async (document: TenancyDocument) => {
        try {
            const result = await signDocument({ tenancyId, documentId: document.id });
            if (result.isSuccessful) {
                showSuccess(result.message || "Signed.");
                setConfirmingSignId(null);
                return;
            }
            showError(result.message || "Could not sign that.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    const outstanding = pack.documents.filter(isWithTenant).length;

    return (
        <div className="space-y-6">
            <CostsSummary
                rentKobo={pack.agreedRentKobo}
                fees={pack.fees}
                totalKobo={pack.totalKobo}
                audience="tenant"
            />

            <section className="rounded-[22px] border border-[#F2F2F2] bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="text-[15px] font-black text-[#1A1A1A] dark:text-gray-100">
                    What the owner needs
                </h2>
                <p className="mt-1 text-[12px] text-gray-400 dark:text-gray-500">
                    {outstanding === 0
                        ? "Nothing waiting on you right now."
                        : outstanding === 1
                            ? "1 thing is waiting on you."
                            : `${outstanding} things are waiting on you.`}
                </p>

                {pack.isComplete && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                        <p className="text-[12px] leading-relaxed text-emerald-800 dark:text-emerald-300">
                            Everything&apos;s accepted. Paying is the last step — we&apos;ll open
                            it here once it&apos;s ready.
                        </p>
                    </div>
                )}

                <ul className="mt-6 divide-y divide-gray-100 dark:divide-gray-800">
                    {pack.documents.map((document) => (
                        <li key={document.id} className="py-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-[14px] font-bold text-[#1A1A1A] dark:text-gray-100">
                                        {document.name}
                                        {document.isAgreement && (
                                            <span className="ml-2 rounded-full bg-[#0B2545] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                                                Agreement
                                            </span>
                                        )}
                                    </p>
                                    <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
                                        {DOCUMENT_MODE_COPY[document.mode]?.blurb}
                                    </p>
                                    {document.instructions && (
                                        <p className="mt-1.5 text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                                            {document.instructions}
                                        </p>
                                    )}
                                </div>

                                <DocumentStatusPill
                                    status={document.status}
                                    label={TENANCY_DOCUMENT_STATUS_LABELS[document.status] ?? "Waiting"}
                                />
                            </div>

                            {document.status === TenancyDocumentStatus.Rejected && document.rejectionReason && (
                                <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                                    The owner sent this back: {document.rejectionReason}
                                </p>
                            )}

                            {document.signedAt && document.status !== TenancyDocumentStatus.Rejected && (
                                <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                                    <PenLine size={13} />
                                    You signed this on {format(new Date(document.signedAt), "d MMM yyyy, HH:mm")}
                                </p>
                            )}

                            {document.status === TenancyDocumentStatus.Submitted && (
                                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                                    <Clock size={13} />
                                    The owner is looking at it.
                                </p>
                            )}

                            {/* The document to read, download or sign — whatever the owner attached. */}
                            {document.hasSourceFile && (
                                <button
                                    type="button"
                                    onClick={() => openDocument(document.id, false)}
                                    disabled={openingId === document.id}
                                    className="mt-3 flex items-center gap-1.5 text-[12px] font-bold text-[#0095FF] hover:text-primary-dark disabled:opacity-40"
                                >
                                    {openingId === document.id
                                        ? <Loader2 size={13} className="animate-spin" />
                                        : document.mode === TenancyDocumentMode.SignOffline
                                            ? <Download size={13} />
                                            : <Eye size={13} />}
                                    {document.mode === TenancyDocumentMode.SignOffline
                                        ? "Download it to sign"
                                        : "Read the document"}
                                </button>
                            )}

                            {isWithTenant(document) && document.mode === TenancyDocumentMode.SignInApp && (
                                confirmingSignId === document.id ? (
                                    <div className="mt-4 space-y-3 rounded-2xl bg-[#FAFAFA] p-5 dark:bg-gray-950/40">
                                        {/*
                                            Said plainly because it is true and because somebody
                                            signing a tenancy agreement on a phone deserves to
                                            know what the record will say about them.
                                        */}
                                        <p className="text-[12px] leading-relaxed text-[#1A1A1A] dark:text-gray-200">
                                            Signing is binding. We record the date, your IP address and
                                            your device against this document as proof it was you.
                                        </p>
                                        <p className="text-[11px] text-gray-400">
                                            Read it first if you haven&apos;t. If the owner sends it
                                            back for a correction, your signature is cleared and
                                            you&apos;ll sign the corrected version.
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleSign(document)}
                                                disabled={isSigningDocument}
                                                className="flex items-center gap-2 rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#071A33] disabled:opacity-40"
                                            >
                                                {isSigningDocument
                                                    ? <Loader2 size={13} className="animate-spin" />
                                                    : <PenLine size={13} />}
                                                I agree — sign it
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setConfirmingSignId(null)}
                                                className="text-[12px] font-semibold text-gray-400 hover:text-gray-600"
                                            >
                                                Not yet
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setConfirmingSignId(document.id)}
                                        className="mt-4 flex items-center gap-2 rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#071A33]"
                                    >
                                        <PenLine size={13} />
                                        Sign it
                                    </button>
                                )
                            )}

                            {isWithTenant(document) && document.mode !== TenancyDocumentMode.SignInApp && (
                                <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#071A33]">
                                    {isSubmittingDocument
                                        ? <Loader2 size={13} className="animate-spin" />
                                        : <Upload size={13} />}
                                    {document.mode === TenancyDocumentMode.SignOffline
                                        ? "Upload the signed copy"
                                        : "Upload it"}
                                    <input
                                        type="file"
                                        accept={DOCUMENT_ACCEPT}
                                        className="hidden"
                                        disabled={isSubmittingDocument}
                                        onChange={(e) => {
                                            const chosen = e.target.files?.[0];
                                            // Cleared either way: picking the same file twice after a
                                            // failure fires no change event otherwise.
                                            e.target.value = "";
                                            if (chosen) handleUpload(document, chosen);
                                        }}
                                    />
                                </label>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
