"use client";

import { Loader2 } from "lucide-react";

interface CancelInspectionModalProps {
    isOpen: boolean;
    isCancelling?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function CancelInspectionModal({ isOpen, isCancelling, onClose, onConfirm }: CancelInspectionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-900 rounded-[24px] w-full max-w-[500px] p-6 sm:p-12 max-h-[85vh] overflow-y-auto shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center">
                    {/* Content */}
                    <h2 className="text-[32px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-6">
                        Cancel Inspection
                    </h2>

                    <p className="text-[16px] font-bold text-gray-400 dark:text-gray-500 leading-relaxed max-w-[380px] mb-12">
                        Are you sure you want to cancel this inspection? This action cannot be undone.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onClose}
                            disabled={isCancelling}
                            className="flex-1 py-5 rounded-[40px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 font-black text-[18px] font-montserrat hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all shadow-sm transform active:scale-[0.98] disabled:opacity-50"
                        >
                            Keep Inspection
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isCancelling}
                            className="flex-1 py-5 rounded-[40px] border border-[#FF4D4D] bg-white dark:bg-gray-900 text-[#FF4D4D] font-black text-[18px] font-montserrat hover:bg-red-50 transition-all shadow-sm transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isCancelling && <Loader2 className="animate-spin" size={18} />}
                            Cancel Inspection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
