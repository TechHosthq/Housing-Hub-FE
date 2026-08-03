"use client";

import { X } from "lucide-react";
import { useState } from "react";
import AccountDeletedModal from "./AccountDeletedModal";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
    const [reason, setReason] = useState<string | null>(null);
    const [note, setNote] = useState("");
    const [isDeleted, setIsDeleted] = useState(false);
    const maxChars = 500;

    const handleDelete = () => {
        if (reason) {
            setIsDeleted(true);
        }
    };

    const handleClose = () => {
        setIsDeleted(false);
        setReason(null);
        setNote("");
        onClose();
    };

    if (!isOpen) return null;

    const reasons = [
        { id: "privacy", label: "Privacy concerns" },
        { id: "others", label: "Others" }
    ];

    if (isDeleted) {
        return <AccountDeletedModal isOpen={true} />;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[500px] bg-white dark:bg-gray-900 rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 sm:px-8 sm:pt-8 mb-8 flex-shrink-0">
                    <h2 className="text-[28px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat">
                        Delete Account
                    </h2>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 pb-8 sm:px-8 sm:pb-10 overflow-y-auto">
                    <p className="text-[14px] text-[#1A1A1A] dark:text-gray-100 font-medium mb-8">
                        This action cannot be undone. Why are you leaving?
                    </p>

                    {/* Reasons */}
                    <div className="space-y-4 mb-8">
                        {reasons.map((r) => (
                            <div
                                key={r.id}
                                onClick={() => setReason(r.id)}
                                className={`flex items-center gap-4 px-6 py-4 rounded-full border transition-all cursor-pointer ${reason === r.id
                                    ? "border-[#0B2545] bg-white dark:bg-gray-900 shadow-sm"
                                    : "border-[#F2F2F2] dark:border-gray-800 hover:border-gray-300"
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${reason === r.id ? "border-[#0B2545]" : "border-gray-300"
                                    }`}>
                                    {reason === r.id && (
                                        <div className="w-3 h-3 bg-[#0B2545] rounded-full" />
                                    )}
                                </div>
                                <span className={`text-[14px] font-bold ${reason === r.id ? "text-[#1A1A1A] dark:text-gray-100" : "text-[#666666] dark:text-gray-400"
                                    }`}>
                                    {r.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Additional Note */}
                    <div className="mb-10">
                        <label className="block text-[11px] font-black text-[#1A1A1A] dark:text-gray-100 uppercase tracking-wider mb-2">
                            ADDITIONAL NOTE (OPTIONAL)
                        </label>
                        <div className="relative">
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value.slice(0, maxChars))}
                                placeholder="Provide more information about the reason..."
                                className="w-full h-32 px-5 py-4 rounded-[16px] border border-[#F2F2F2] dark:border-gray-800 bg-white dark:bg-gray-900 text-[13px] font-medium text-[#1A1A1A] dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-[#0B2545] transition-all resize-none shadow-sm"
                            />
                            <div className="absolute -bottom-6 right-0 text-[11px] font-bold text-gray-400 dark:text-gray-500">
                                {note.length}/{maxChars} Characters
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleClose}
                            className="flex-1 py-4 rounded-full border border-[#F2F2F2] dark:border-gray-800 text-gray-400 dark:text-gray-500 text-[14px] font-black hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all active:scale-95"
                        >
                            Adjust Preferences Instead
                        </button>
                        <button
                            disabled={!reason}
                            onClick={handleDelete}
                            className={`flex-1 py-4 rounded-full border-2 text-[14px] font-black transition-all active:scale-95 ${reason
                                ? "border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white"
                                : "border-gray-100 dark:border-gray-800 text-gray-300 cursor-not-allowed"
                                }`}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
