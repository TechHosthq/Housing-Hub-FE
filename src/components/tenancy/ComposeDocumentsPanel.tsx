"use client";

import { useState } from "react";
import { Loader2, Paperclip, Plus, Send, Trash2, TriangleAlert } from "lucide-react";
import { useTenancy } from "@/hooks/useTenancy";
import { useToastStore } from "@/store/useToastStore";
import { PropertyLeaseType } from "@/types/property";
import { TenancyDocumentMode, TenancyDocumentPack } from "@/types/tenancy";
import { formatKobo, koboToNairaInput, nairaToKobo } from "@/utils/money";
import { resolveApiError } from "@/utils/errorResolver";
import { DOCUMENT_ACCEPT, DOCUMENT_MODE_COPY, SIGNABLE_ACCEPT, rejectFile } from "./documentPresentation";

interface ComposeDocumentsPanelProps {
    tenancyId: string;
    pack: TenancyDocumentPack;
    leaseType: PropertyLeaseType;
}

interface FeeRow {
    name: string;
    description: string;
    /** Held as the string the owner typed. Converted to kobo once, on save. */
    naira: string;
}

const MODES = [
    TenancyDocumentMode.Upload,
    TenancyDocumentMode.SignInApp,
    TenancyDocumentMode.SignOffline,
];

/**
 * Building the request before it goes anywhere.
 *
 * Compose-then-send, like the verification pipeline: a half-built set of documents
 * landing in somebody's inbox is worse than no documents at all. Nothing here is
 * visible to the tenant until Send.
 */
export default function ComposeDocumentsPanel({ tenancyId, pack, leaseType }: ComposeDocumentsPanelProps) {
    const { showSuccess, showError } = useToastStore();
    const {
        addDocument, isAddingDocument,
        removeDocument, isRemovingDocument,
        setFees, isSettingFees,
        sendDocuments, isSendingDocuments,
    } = useTenancy();

    const hasAgreement = pack.documents.some((d) => d.isAgreement);

    // Nigeria's Evidence Act keeps land instruments off electronic signature, so a
    // lease over three years or a sale can only be signed on paper. The option is
    // shown disabled with the reason rather than hidden — an owner who expected to
    // find it should learn why it isn't there.
    const canESign = leaseType === PropertyLeaseType.Rent;

    const [name, setName] = useState("");
    const [mode, setMode] = useState<TenancyDocumentMode>(TenancyDocumentMode.SignOffline);
    const [isAgreement, setIsAgreement] = useState(!hasAgreement);
    const [instructions, setInstructions] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [feeRows, setFeeRows] = useState<FeeRow[]>(
        pack.fees.map((f) => ({ name: f.name, description: f.description, naira: koboToNairaInput(f.amountKobo) })),
    );

    const [confirmingSend, setConfirmingSend] = useState(false);

    const needsFile = mode !== TenancyDocumentMode.Upload;
    const accept = mode === TenancyDocumentMode.SignInApp ? SIGNABLE_ACCEPT : DOCUMENT_ACCEPT;

    const resetForm = () => {
        setName("");
        setMode(TenancyDocumentMode.SignOffline);
        setIsAgreement(false);
        setInstructions("");
        setFile(null);
    };

    const handleAdd = async () => {
        if (!name.trim()) {
            showError("Give the document a name so the tenant knows what you're asking for.");
            return;
        }

        if (needsFile && !file) {
            showError("Attach the document the tenant is going to sign.");
            return;
        }

        try {
            const result = await addDocument({
                tenancyId,
                document: {
                    name: name.trim(),
                    mode,
                    isAgreement,
                    instructions: instructions.trim() || null,
                },
                // Only for the signing modes. The server refuses a file on an upload
                // request rather than ignoring it, so sending one anyway would fail.
                file: needsFile ? file : null,
            });

            if (result.isSuccessful) {
                showSuccess(result.message || "Added.");
                resetForm();
                return;
            }
            showError(result.message || "Could not add that document.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    const handleRemove = async (documentId: string) => {
        try {
            const result = await removeDocument({ tenancyId, documentId });
            if (!result.isSuccessful) showError(result.message || "Could not remove that.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    const handleSaveFees = async () => {
        const fees = [];

        for (const row of feeRows) {
            if (!row.name.trim()) {
                showError("Every fee needs a name.");
                return;
            }
            if (!row.description.trim()) {
                showError(`Say what "${row.name.trim()}" covers — the tenant sees this.`);
                return;
            }

            const amountKobo = nairaToKobo(row.naira);
            if (amountKobo === null || amountKobo <= 0) {
                showError(`"${row.name.trim()}" needs an amount.`);
                return;
            }

            fees.push({ name: row.name.trim(), description: row.description.trim(), amountKobo });
        }

        try {
            const result = await setFees({ tenancyId, fees });
            if (result.isSuccessful) {
                showSuccess(result.message || "Fees saved.");
                return;
            }
            showError(result.message || "Could not save the fees.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    const handleSend = async () => {
        try {
            const result = await sendDocuments(tenancyId);
            if (result.isSuccessful) {
                showSuccess(result.message || "Sent. We've emailed them the details.");
                setConfirmingSend(false);
                return;
            }
            showError(result.message || "Could not send.");
        } catch (error) {
            showError(resolveApiError(error));
        }
    };

    // The typed rows, not the saved fees — so the total reflects what is on screen
    // and an owner can see the effect of a figure before committing to it.
    const draftFeesKobo = feeRows.reduce((sum, row) => sum + (nairaToKobo(row.naira) ?? 0), 0);

    return (
        <div className="space-y-6">
            {/* ── Documents ──────────────────────────────────────── */}
            <section className="rounded-[22px] border border-[#F2F2F2] bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="text-[15px] font-black text-[#1A1A1A] dark:text-gray-100">
                    What you need from them
                </h2>
                <p className="mt-1 text-[12px] text-gray-400 dark:text-gray-500">
                    Nothing here reaches the tenant until you send it.
                </p>

                {pack.documents.length > 0 && (
                    <ul className="mt-6 divide-y divide-gray-100 dark:divide-gray-800">
                        {pack.documents.map((document) => (
                            <li key={document.id} className="flex items-start justify-between gap-4 py-4">
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
                                        {document.hasSourceFile && " · file attached"}
                                    </p>
                                    {document.instructions && (
                                        <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                                            {document.instructions}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemove(document.id)}
                                    disabled={isRemovingDocument}
                                    aria-label={`Remove ${document.name}`}
                                    className="shrink-0 rounded-full p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-[#FF3B30] disabled:opacity-40"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* ── Add one ─────────────────────────────────────── */}
                <div className="mt-6 space-y-4 rounded-2xl bg-[#FAFAFA] p-5 dark:bg-gray-950/40">
                    <div>
                        <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Document name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Tenancy agreement, Employment letter"
                            className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[13px] placeholder:text-gray-300 focus:border-[#0B2545] focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400">
                            How it gets done
                        </label>
                        <div className="space-y-2">
                            {MODES.map((option) => {
                                const blocked = option === TenancyDocumentMode.SignInApp && !canESign;
                                return (
                                    <label
                                        key={option}
                                        className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${blocked
                                            ? "cursor-not-allowed border-[#EEEEEE] opacity-50 dark:border-gray-800"
                                            : "cursor-pointer border-[#E5E5E5] hover:border-[#0B2545] dark:border-gray-800"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="document-mode"
                                            checked={mode === option}
                                            disabled={blocked}
                                            onChange={() => { setMode(option); setFile(null); }}
                                            className="mt-1"
                                        />
                                        <span className="min-w-0">
                                            <span className="block text-[13px] font-bold text-[#1A1A1A] dark:text-gray-100">
                                                {DOCUMENT_MODE_COPY[option].label}
                                            </span>
                                            <span className="mt-0.5 block text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
                                                {DOCUMENT_MODE_COPY[option].blurb}
                                            </span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        {!canESign && (
                            <p className="mt-2 text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
                                Signing in the app isn&apos;t available for this listing. Nigerian law
                                keeps land instruments off electronic signature, so a lease over three
                                years or a sale has to be signed on paper and uploaded.
                            </p>
                        )}
                    </div>

                    {needsFile && (
                        <div>
                            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400">
                                The document itself
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#CCCCCC] bg-white px-4 py-3 text-[13px] text-gray-500 hover:border-[#0B2545] dark:border-gray-700 dark:bg-gray-900">
                                <Paperclip size={16} className="shrink-0 text-gray-400" />
                                <span className="truncate">{file ? file.name : "Choose a PDF or photo (max 4MB)"}</span>
                                <input
                                    type="file"
                                    accept={accept}
                                    className="hidden"
                                    onChange={(e) => {
                                        const chosen = e.target.files?.[0] ?? null;
                                        const problem = chosen ? rejectFile(chosen, accept) : null;
                                        if (problem) {
                                            showError(problem);
                                            e.target.value = "";
                                            return;
                                        }
                                        setFile(chosen);
                                    }}
                                />
                            </label>
                        </div>
                    )}

                    <label className={`flex items-start gap-3 ${hasAgreement ? "opacity-50" : "cursor-pointer"}`}>
                        <input
                            type="checkbox"
                            checked={isAgreement}
                            disabled={hasAgreement}
                            onChange={(e) => setIsAgreement(e.target.checked)}
                            className="mt-1"
                        />
                        <span className="text-[12px] leading-relaxed text-gray-600 dark:text-gray-400">
                            This is the tenancy agreement.
                            {hasAgreement && " You've already marked one — remove it first to change which."}
                        </span>
                    </label>

                    <div>
                        <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Anything they should know (optional)
                        </label>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            rows={2}
                            placeholder="e.g. Must be dated within the last 3 months"
                            className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[13px] placeholder:text-gray-300 focus:border-[#0B2545] focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={isAddingDocument}
                        className="flex items-center gap-2 rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#071A33] disabled:opacity-40"
                    >
                        {isAddingDocument ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                        Add document
                    </button>
                </div>
            </section>

            {/* ── Fees ───────────────────────────────────────────── */}
            <section className="rounded-[22px] border border-[#F2F2F2] bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="text-[15px] font-black text-[#1A1A1A] dark:text-gray-100">
                    Fees on top of the rent
                </h2>
                <p className="mt-1 text-[12px] leading-relaxed text-gray-400 dark:text-gray-500">
                    The tenant sees these the moment you send, before they sign anything.
                    Say what each one covers — a figure with no explanation is what gets
                    argued about later.
                </p>

                <div className="mt-6 space-y-4">
                    {feeRows.map((row, index) => (
                        <div key={index} className="rounded-2xl bg-[#FAFAFA] p-4 dark:bg-gray-950/40">
                            <div className="flex items-start gap-3">
                                <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_140px]">
                                    <input
                                        value={row.name}
                                        onChange={(e) => setFeeRows(
                                            feeRows.map((r, i) => (i === index ? { ...r, name: e.target.value } : r)),
                                        )}
                                        placeholder="Fee name, e.g. Agency fee"
                                        className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[13px] placeholder:text-gray-300 focus:border-[#0B2545] focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600"
                                    />
                                    <input
                                        value={row.naira}
                                        onChange={(e) => setFeeRows(
                                            feeRows.map((r, i) => (i === index ? { ...r, naira: e.target.value } : r)),
                                        )}
                                        inputMode="decimal"
                                        placeholder="Amount ₦"
                                        className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[13px] placeholder:text-gray-300 focus:border-[#0B2545] focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFeeRows(feeRows.filter((_, i) => i !== index))}
                                    aria-label="Remove fee"
                                    className="mt-1 shrink-0 rounded-full p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-[#FF3B30]"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <input
                                value={row.description}
                                onChange={(e) => setFeeRows(
                                    feeRows.map((r, i) => (i === index ? { ...r, description: e.target.value } : r)),
                                )}
                                placeholder="What does it cover?"
                                className="mt-3 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[13px] placeholder:text-gray-300 focus:border-[#0B2545] focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setFeeRows([...feeRows, { name: "", description: "", naira: "" }])}
                        className="flex items-center gap-2 text-[12px] font-bold text-[#0095FF] hover:text-primary-dark"
                    >
                        <Plus size={14} />
                        Add a fee
                    </button>

                    <button
                        type="button"
                        onClick={handleSaveFees}
                        disabled={isSettingFees}
                        className="flex items-center gap-2 rounded-full border-[2px] border-[#0B2545] px-5 py-2.5 text-[12px] font-bold text-[#0B2545] hover:bg-[#0B2545] hover:text-white disabled:opacity-40 dark:border-gray-700 dark:text-gray-200"
                    >
                        {isSettingFees && <Loader2 size={13} className="animate-spin" />}
                        Save fees
                    </button>
                </div>

                <div className="mt-6 flex items-center justify-between gap-6 border-t border-gray-100 pt-5 dark:border-gray-800">
                    <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400">
                        Rent {formatKobo(pack.agreedRentKobo)} plus fees
                    </span>
                    <span className="font-montserrat text-[18px] font-black text-[#0B2545] dark:text-[#6BB5FF]">
                        {formatKobo(pack.agreedRentKobo + draftFeesKobo)}
                    </span>
                </div>
            </section>

            {/* ── Send ───────────────────────────────────────────── */}
            <section className="rounded-[22px] border border-[#F2F2F2] bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                {!hasAgreement && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/30">
                        <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber-600" />
                        <p className="text-[12px] leading-relaxed text-amber-800 dark:text-amber-300">
                            Add the tenancy agreement before you send. Every let has one, so we
                            won&apos;t send a request without it.
                        </p>
                    </div>
                )}

                {confirmingSend ? (
                    <div className="space-y-4">
                        <p className="text-[13px] leading-relaxed text-[#1A1A1A] dark:text-gray-200">
                            We&apos;ll email the tenant with the documents and the total of{" "}
                            <strong>{formatKobo(pack.totalKobo)}</strong>. You can&apos;t change the
                            documents or the fees afterwards — only accept or return what they send
                            back.
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            Saved fees are what gets sent. If you&apos;ve edited the rows above,
                            save them first.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={isSendingDocuments}
                                className="flex items-center gap-2 rounded-full bg-[#0B2545] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#071A33] disabled:opacity-40"
                            >
                                {isSendingDocuments ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                Yes, send it
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmingSend(false)}
                                className="text-[12px] font-semibold text-gray-400 hover:text-gray-600"
                            >
                                Not yet
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setConfirmingSend(true)}
                        disabled={!hasAgreement || pack.documents.length === 0}
                        className="flex items-center gap-2 rounded-full bg-[#0B2545] px-7 py-3.5 text-[13px] font-bold text-white hover:bg-[#071A33] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Send size={14} />
                        Send to the tenant
                    </button>
                )}
            </section>
        </div>
    );
}
