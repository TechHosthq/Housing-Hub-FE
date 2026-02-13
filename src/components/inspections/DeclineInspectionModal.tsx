"use client";

import { X, ChevronRight } from "lucide-react";

interface DeclineOption {
    id: string;
    title: string;
    description: string;
    type: "neutral" | "danger";
}

const DECLINE_OPTIONS: DeclineOption[] = [
    {
        id: "reschedule",
        title: "Suggest Reschedule",
        description: "Propose a different date and time",
        type: "neutral"
    },
    {
        id: "assign",
        title: "Assign To Spacehub Staff",
        description: "Let a staff member handle the inspection",
        type: "neutral"
    },
    {
        id: "decline",
        title: "Decline Request",
        description: "Reject this inspection and notify the customer",
        type: "danger"
    }
];

interface DeclineInspectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectOption: (optionId: string) => void;
}

export default function DeclineInspectionModal({
    isOpen,
    onClose,
    onSelectOption
}: DeclineInspectionModalProps) {
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
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[24px] font-bold text-[#1A1A1A] font-montserrat">
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

                {/* Options List */}
                <div className="space-y-4">
                    {DECLINE_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => onSelectOption(option.id)}
                            className={`w-full group flex items-center justify-between p-5 rounded-[24px] border-[1.5px] transition-all active:scale-[0.98] ${option.type === "danger"
                                    ? "border-[#FF4D4C] hover:bg-red-50/50"
                                    : "border-[#0095FF] hover:bg-blue-50/50"
                                }`}
                        >
                            <div className="text-left">
                                <h3 className="text-[16px] font-bold font-montserrat text-[#1A1A1A] mb-0.5">
                                    {option.title}
                                </h3>
                                <p className="text-[14px] text-[#A3A3A3] font-medium">
                                    {option.description}
                                </p>
                            </div>
                            <ChevronRight
                                size={20}
                                className={`transition-transform group-hover:translate-x-1 ${option.type === "danger" ? "text-[#FF4D4C]" : "text-[#0095FF]"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
