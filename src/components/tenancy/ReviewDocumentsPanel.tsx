"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Download, Eye, Loader2, PenLine } from "lucide-react";
import { useTenancy } from "@/hooks/useTenancy";
import { useToastStore } from "@/store/useToastStore";
import {
    TENANCY_DOCUMENT_STATUS_LABELS,
    TenancyDocument,
    TenancyDocumentFile,
    TenancyDocumentPack,
    TenancyDocumentStatus,
} from "@/types/tenancy";
import { resolveApiError } from "@/utils/errorResolver";
import { DOCUMENT_MODE_COPY, DocumentStatusPill } from "./documentPresentation";
import { useOpenDocument } from "./useOpenDocument";

interface ReviewDocumentsPanelProps {
    tenancyId: string;
    pack: TenancyDocumentPack;
}

/**
 * The owner's side once the request has gone out.
 *
 * Read and decide, nothing else. The documents and the fees are fixed at send —
 * letting an owner add a fee after the tenant has agreed to a total would make the
 * total meaningless, which is the thing showing it early was for.
 */
export default function ReviewDocumentsPanel({ tenancyId, pack }: ReviewDocumentsPanelProps) {
    const { showSuccess, showError } = useToastStore();
    const { reviewDocument, isReviewingDocument } = useTenancy();
    const { openDocument, openingId } = useOpenDocument(tenancyId);

    const [returningId, setReturningId] = useState<string | null>(null);
    const [reason, setReason] = useState("");

    const accepted = pack.documents.filter((d) => d.status === TenancyDocumentStatus.Accepted).length;

    const handleAccept = async (document: TenancyDocument) => {
        try {
            const result = await reviewDocument({ tenancyId, documentId: document.id, accept: true });
            if (result.isSuccessful) {
                showSuccess(result.message || "Accepted.");
                return;
            }
            showError(result.message || "Could not accept that.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    const handleReturn = async (document: TenancyDocument) => {
        if (!reason.trim()) {
            showError("Say what's wrong with it — they can only fix what you tell them.");
            return;
        }

        try {
            const result = await reviewDocument({
                tenancyId,
                documentId: document.id,
                accept: false,
                rejectionReason: reason.trim(),
            });

            if (result.isSuccessful) {
                showSuccess(result.message || "Sent back.");
                setReturningId(null);
                setReason("");
                return;
            }
            showError(result.message || "Could not send that back.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    return (
        <section className="rounded-[22px] border border-[#F2F2F2] bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-[15px] font-black text-[#1A1A1A] dark:text-gray-100">
                        Their documents
                    </h2>
                    <p className="mt-1 text-[12px] text-gray-400 dark:text-gray-500">
                        {accepted} of {pack.documents.length} accepted
                    </p>
                </div>
            </div>

            {pack.isComplete && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                    <p className="text-[12px] leading-relaxed text-emerald-800 dark:text-emerald-300">
                        Everything is accepted. The tenant pays next — we&apos;ll tell you when
                        the money has landed.
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
                                <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                                    {DOCUMENT_MODE_COPY[document.mode]?.label}
                                    {document.submittedAt
                                        && ` · returned ${format(new Date(document.submittedAt), "d MMM yyyy")}`}
                                </p>
                            </div>

                            <DocumentStatusPill
                                status={document.status}
                                label={TENANCY_DOCUMENT_STATUS_LABELS[document.status] ?? "Waiting"}
                            />
                        </div>

                        {document.signedAt && (
                            <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                                <PenLine size={13} />
                                Signed in the app on {format(new Date(document.signedAt), "d MMM yyyy, HH:mm")}
                            </p>
                        )}

                        {document.status === TenancyDocumentStatus.Rejected && document.rejectionReason && (
                            <p className="mt-2 rounded-xl bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                                You sent this back: {document.rejectionReason}
                            </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-4">
                            {document.hasSourceFile && (
                                <button
                                    type="button"
                                    onClick={() => openDocument(document.id, TenancyDocumentFile.Source)}
                                    disabled={openingId === document.id}
                                    className="flex items-center gap-1.5 text-[12px] font-bold text-[#0095FF] hover:text-primary-dark disabled:opacity-40"
                                >
                                    {openingId === document.id
                                        ? <Loader2 size={13} className="animate-spin" />
                                        : <Eye size={13} />}
                                    What you sent
                                </button>
                            )}

                            {document.hasSubmittedFile && (
                                <button
                                    type="button"
                                    onClick={() => openDocument(document.id, TenancyDocumentFile.Submitted)}
                                    disabled={openingId === document.id}
                                    className="flex items-center gap-1.5 text-[12px] font-bold text-[#0095FF] hover:text-primary-dark disabled:opacity-40"
                                >
                                    {openingId === document.id
                                        ? <Loader2 size={13} className="animate-spin" />
                                        : <Eye size={13} />}
                                    What they sent
                                </button>
                            )}

                            {/*
                                The stamped copy, with the signature on its face and
                                the certificate behind it. This is the one to keep —
                                the others are what each side put in.
                            */}
                            {document.hasSignedPdf && (
                                <button
                                    type="button"
                                    onClick={() => openDocument(document.id, TenancyDocumentFile.Signed)}
                                    disabled={openingId === document.id}
                                    className="flex items-center gap-1.5 text-[12px] font-bold text-[#0095FF] hover:text-primary-dark disabled:opacity-40"
                                >
                                    {openingId === document.id
                                        ? <Loader2 size={13} className="animate-spin" />
                                        : <Download size={13} />}
                                    Signed copy
                                </button>
                            )}
                        </div>

                        {document.status === TenancyDocumentStatus.Submitted && (
                            returningId === document.id ? (
                                <div className="mt-4 space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        What needs fixing?
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows={2}
                                        placeholder="e.g. The second page is missing"
                                        className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[13px] placeholder:text-gray-300 focus:border-[#0B2545] focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600"
                                    />
                                    <p className="text-[11px] text-gray-400">
                                        Shown to them word for word.
                                        {document.signedAt
                                            && " Sending it back clears their signature — they'll need to sign again."}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleReturn(document)}
                                            disabled={isReviewingDocument}
                                            className="flex items-center gap-2 rounded-full border-[2px] border-[#0B2545] px-5 py-2.5 text-[12px] font-bold text-[#0B2545] hover:bg-[#0B2545] hover:text-white disabled:opacity-40 dark:border-gray-700 dark:text-gray-200"
                                        >
                                            {isReviewingDocument && <Loader2 size={13} className="animate-spin" />}
                                            Send it back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setReturningId(null); setReason(""); }}
                                            className="text-[12px] font-semibold text-gray-400 hover:text-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleAccept(document)}
                                        disabled={isReviewingDocument}
                                        className="flex items-center gap-2 rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#071A33] disabled:opacity-40"
                                    >
                                        {isReviewingDocument && <Loader2 size={13} className="animate-spin" />}
                                        Accept
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setReturningId(document.id); setReason(""); }}
                                        className="text-[12px] font-semibold text-gray-400 underline hover:text-gray-600"
                                    >
                                        Send it back
                                    </button>
                                </div>
                            )
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}
