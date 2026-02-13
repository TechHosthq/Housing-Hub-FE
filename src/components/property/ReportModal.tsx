"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const REPORT_REASONS = [
    "Fake or Fraudulent Listing",
    "Property Already Sold/Rented",
    "Incorrect Price Information",
    "Inappropriate Images",
    "Duplicate Listing",
    "Other Issue"
];

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [note, setNote] = useState("");

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
            setSelectedReason(null);
            setNote("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 500) {
            setNote(e.target.value);
        }
    };

    const isSubmitEnabled = selectedReason !== null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white rounded-[28px] p-8 w-full max-w-[440px] shadow-2xl transform transition-all duration-300 ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-[24px] font-black text-[#1A1A1A] font-montserrat">
                            Report Property
                        </h2>
                        <p className="text-[11px] text-[#666666] mt-2 leading-relaxed">
                            Help us maintain quality. Your report will be reviewed by our team. False reports may result in account restrictions.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors text-[#1A1A1A]"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Reasons List */}
                <div className="space-y-3 mb-6">
                    {REPORT_REASONS.map((reason) => (
                        <button
                            key={reason}
                            onClick={() => setSelectedReason(reason)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[30px] border transition-all ${selectedReason === reason
                                    ? "border-[#002D6B] bg-white shadow-sm"
                                    : "border-[#E5E5E5] hover:border-[#002D6B] bg-white"
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedReason === reason ? "border-[#002D6B]" : "border-[#E5E5E5]"
                                }`}>
                                {selectedReason === reason && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#002D6B]" />
                                )}
                            </div>
                            <span className={`text-sm font-bold ${selectedReason === reason ? "text-[#1A1A1A]" : "text-[#666666]"
                                }`}>
                                {reason}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Additional Note */}
                <div className="space-y-2 mb-4">
                    <label className="text-[9px] font-bold text-[#1A1A1A] uppercase tracking-wider block">
                        ADDITIONAL NOTE (OPTIONAL)
                    </label>
                    <textarea
                        value={note}
                        onChange={handleNoteChange}
                        placeholder="Provide more information about the issue..."
                        rows={5}
                        className="w-full px-5 py-4 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm placeholder:text-gray-300 resize-none font-medium"
                    />
                    <div className="text-right">
                        <span className="text-[10px] text-[#999999] font-bold">{note.length}/500 Characters</span>
                    </div>
                </div>

                <p className="text-[10px] text-[#666666] mb-8 leading-relaxed">
                    Report will be submitted with your account information, timestamp, and the details provided above.
                </p>

                {/* Footer Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-full border border-[#E5E5E5] text-[13px] font-bold text-[#999999] hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!isSubmitEnabled}
                        className={`flex-1 py-4 rounded-full text-[13px] font-bold text-white transition-all shadow-lg ${isSubmitEnabled
                                ? "bg-[#FF3B30] hover:bg-[#E0342A] active:scale-[0.98]"
                                : "bg-[#FF3B30]/50 cursor-not-allowed"
                            }`}
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
}
