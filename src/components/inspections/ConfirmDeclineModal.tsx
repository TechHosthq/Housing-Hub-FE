"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface ConfirmDeclineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

export default function ConfirmDeclineModal({
    isOpen,
    onClose,
    onConfirm
}: ConfirmDeclineModalProps) {
    const [reason, setReason] = useState("");
    const maxChars = 500;

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[32px] w-full max-w-[550px] p-8 overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[28px] font-bold text-[#1A1A1A] font-montserrat">
                        Decline Inspection
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#1A1A1A] hover:opacity-70 transition-opacity"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <p className="text-[15px] text-[#262626] font-medium leading-relaxed mb-8">
                    Please provide a reason for declining this inspection request.
                </p>

                {/* Textarea Section */}
                <div className="mb-8">
                    <div className="relative">
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value.slice(0, maxChars))}
                            className="w-full h-40 p-5 rounded-[12px] border border-[#E5E5E5] bg-white resize-none focus:outline-none focus:border-[#0095FF] focus:ring-2 focus:ring-[#0095FF]/10 text-[15px] text-[#1A1A1A] font-medium placeholder:text-[#A3A3A3]"
                            placeholder="Provide a reason..."
                            maxLength={maxChars}
                        />
                        <div className="absolute -bottom-7 right-0 text-[12px] font-bold text-[#A3A3A3]">
                            {reason.length}/{maxChars} Characters
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 px-6 rounded-full border border-[#0095FF] text-[15px] font-bold text-[#0095FF] hover:bg-blue-50/50 transition-all active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                        className={`flex-1 py-4 px-6 rounded-full border-[1.5px] text-[15px] font-bold transition-all active:scale-[0.98] ${!reason.trim()
                            ? "border-gray-200 text-gray-400 cursor-not-allowed"
                            : "border-[#FF4D4C] text-[#FF4D4C] hover:bg-red-50"
                            }`}
                    >
                        Confirm Decline
                    </button>
                </div>
            </div>
        </div>
    );
}
