"use client";

import { X } from "lucide-react";

interface AcceptInspectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    date: string;
    time: string;
}

export default function AcceptInspectionModal({
    isOpen,
    onClose,
    onConfirm,
    date,
    time
}: AcceptInspectionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[32px] w-full max-w-[550px] p-8 overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-[24px] font-bold text-[#1A1A1A] font-montserrat">
                        Accept Inspection
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#1A1A1A] hover:opacity-70 transition-opacity"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <p className="text-[16px] text-[#262626] font-medium leading-relaxed mb-10">
                    Confirm that you will be available for the inspection on {date} at {time}. The customer will be notified.
                </p>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-full border-[2px] border-[#0095FF] text-[16px] font-bold text-[#0095FF] font-montserrat hover:bg-blue-50 transition-all active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-4 rounded-full bg-[#002B7F] text-[16px] font-bold text-white font-montserrat hover:bg-[#001D54] transition-all shadow-md active:scale-[0.98]"
                    >
                        Accept Inspection
                    </button>
                </div>
            </div>
        </div>
    );
}
