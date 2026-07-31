"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useProperty } from "@/hooks/useProperty";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
}

const REPORT_REASONS = [
    "Fake or Fraudulent Listing",
    "Property Already Sold/Rented",
    "Incorrect Price Information",
    "Inappropriate Images",
    "Duplicate Listing",
    "Other Issue"
];

export default function ReportModal({ isOpen, onClose, propertyId }: ReportModalProps) {
    const { reportProperty, isReportingProperty } = useProperty();
    const [isVisible, setIsVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [note, setNote] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
            setSelectedReason(null);
            setNote("");
            setIsSubmitted(false);
            setSubmitError("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 500) {
            setNote(e.target.value);
        }
    };

    const handleSubmit = () => {
        if (!selectedReason) return;
        setSubmitError("");
        reportProperty({ propertyId, reason: selectedReason, note }, {
            onSuccess: (response) => {
                if (response.isSuccessful) {
                    setIsSubmitted(true);
                } else {
                    setSubmitError(response.message || "Couldn't submit your report. Please try again.");
                }
            },
            onError: () => setSubmitError("Couldn't submit your report. Please try again."),
        });
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
            <div className={`relative bg-white dark:bg-gray-900 rounded-[28px] p-8 w-full max-w-[440px] max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
                {isSubmitted ? (
                    <div className="flex flex-col items-center text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-6">
                            <Check size={28} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-[20px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-2">
                            Report Submitted
                        </h2>
                        <p className="text-[13px] text-[#666666] dark:text-gray-400 mb-8 leading-relaxed">
                            Thanks for letting us know. Our team will review this listing shortly.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-full bg-primary-dark text-white font-bold text-[13px] hover:bg-primary-dark/90 transition-all"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-[24px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat">
                                    Report Property
                                </h2>
                                <p className="text-[11px] text-[#666666] dark:text-gray-400 mt-2 leading-relaxed">
                                    Help us maintain quality. Your report will be reviewed by our team. False reports may result in account restrictions.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-[#1A1A1A] dark:text-gray-100"
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
                                        ? "border-primary-dark bg-white dark:bg-gray-900 shadow-sm"
                                        : "border-[#E5E5E5] dark:border-gray-800 hover:border-primary-dark bg-white dark:bg-gray-900"
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedReason === reason ? "border-primary-dark" : "border-[#E5E5E5] dark:border-gray-800"
                                        }`}>
                                        {selectedReason === reason && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary-dark" />
                                        )}
                                    </div>
                                    <span className={`text-sm font-bold ${selectedReason === reason ? "text-[#1A1A1A] dark:text-gray-100" : "text-[#666666] dark:text-gray-400"
                                        }`}>
                                        {reason}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Additional Note */}
                        <div className="space-y-2 mb-4">
                            <label className="text-[9px] font-bold text-[#1A1A1A] dark:text-gray-100 uppercase tracking-wider block">
                                ADDITIONAL NOTE (OPTIONAL)
                            </label>
                            <textarea
                                value={note}
                                onChange={handleNoteChange}
                                placeholder="Provide more information about the issue..."
                                rows={5}
                                className="w-full px-5 py-4 rounded-xl border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-primary-dark transition-colors text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none font-medium"
                            />
                            <div className="text-right">
                                <span className="text-[10px] text-[#999999] dark:text-gray-500 font-bold">{note.length}/500 Characters</span>
                            </div>
                        </div>

                        <p className="text-[10px] text-[#666666] dark:text-gray-400 mb-4 leading-relaxed">
                            Report will be submitted with your account information, timestamp, and the details provided above.
                        </p>

                        {submitError && (
                            <p className="text-[12px] text-red-500 font-semibold mb-4">{submitError}</p>
                        )}

                        {/* Footer Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-4 rounded-full border border-[#E5E5E5] dark:border-gray-800 text-[13px] font-bold text-[#999999] dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!isSubmitEnabled || isReportingProperty}
                                className={`flex-1 py-4 rounded-full text-[13px] font-bold text-white transition-all shadow-lg ${isSubmitEnabled
                                    ? "bg-[#FF3B30] hover:bg-[#E0342A] active:scale-[0.98]"
                                    : "bg-[#FF3B30]/50 cursor-not-allowed"
                                    } disabled:opacity-60`}
                            >
                                {isReportingProperty ? "Submitting..." : "Submit Report"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
