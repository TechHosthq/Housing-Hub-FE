"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useInspection } from "@/hooks/useInspection";
import { useToastStore } from "@/store/useToastStore";
import { resolveMutationError } from "@/utils/errorResolver";

interface MarkInspectionDonePanelProps {
    inspectionId: string;
}

/**
 * The renter saying the viewing went ahead.
 *
 * Shown to the renter alone, and only on a confirmed viewing whose day has come —
 * the API enforces both, and the owner is refused outright. A completed viewing is
 * what qualifies somebody to be chosen as a tenant, so an owner marking their own
 * viewings attended is the one thing this gate exists to stop.
 */
export default function MarkInspectionDonePanel({ inspectionId }: MarkInspectionDonePanelProps) {
    const { completeInspection, isCompleting } = useInspection();
    const { showSuccess } = useToastStore();

    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    const submit = async () => {
        setError("");

        try {
            const result = await completeInspection({
                id: inspectionId,
                comment: comment.trim() || null,
            });

            if (result.isSuccessful) {
                showSuccess(result.message || "Thanks — we've told the owner.");
                setIsOpen(false);
                return;
            }

            setError(result.message || "We couldn't record that. Please try again.");
        } catch (failure) {
            // Inline rather than a toast: the server's message names the actual
            // obstacle — the viewing isn't confirmed, the day hasn't come, it has
            // already closed — and each of those needs reading, not glimpsing.
            setError(resolveMutationError(failure).join(" "));
        }
    };

    return (
        <div className="rounded-[22px] border border-[#D9E9FF] bg-[#F2F7FF] p-8 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-montserrat text-[18px] font-black text-[#1A1A1A] dark:text-gray-100">
                Did this viewing go ahead?
            </h3>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#666666] dark:text-gray-400">
                Telling us takes a moment, and it&apos;s what lets the owner put you forward
                for the property.
            </p>

            {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[12px] leading-relaxed text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </p>
            )}

            {isOpen ? (
                <div className="mt-6 space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Anything you want to add? (optional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        maxLength={1000}
                        placeholder="e.g. Saw the whole flat, very interested — or, the gate was locked so I only saw it from outside"
                        className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[13px] placeholder:text-gray-300 focus:border-[#0B2545] focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-600"
                    />
                    {/* The owner reads this, so say so before they write it. */}
                    <p className="text-[11px] text-gray-400">
                        The owner will see this.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={submit}
                            disabled={isCompleting}
                            className="flex items-center gap-2 rounded-full bg-primary-dark px-7 py-3.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                        >
                            {isCompleting
                                ? <Loader2 size={16} className="animate-spin" />
                                : <CheckCircle2 size={16} />}
                            Yes, it went ahead
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); setError(""); }}
                            className="text-[12px] font-semibold text-gray-400 hover:text-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="mt-6 flex items-center gap-2 rounded-full bg-primary-dark px-7 py-3.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
                >
                    <CheckCircle2 size={16} />
                    Mark as done
                </button>
            )}
        </div>
    );
}
