"use client";

import { X } from "lucide-react";
import { useState } from "react";
import DatePicker from "../property/DatePicker";
import TimePicker from "../property/TimePicker";
import { formatTimeTo24h } from "@/utils/dateUtils";

interface SuggestRescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuggest: (data: { date: string; time: string; note: string }) => void;
    initialDate: string;
    initialTime: string;
}

export default function SuggestRescheduleModal({
    isOpen,
    onClose,
    onSuggest,
    initialDate,
    initialTime
}: SuggestRescheduleModalProps) {
    const [date, setDate] = useState(initialDate);
    const [time, setTime] = useState(initialTime);
    const [note, setNote] = useState("");

    if (!isOpen) return null;

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
                    <h2 className="text-[24px] font-bold text-[#1A1A1A] font-montserrat">
                        Suggest Reschedule
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
                    Suggest a new date and time for the inspection. Customer can accept or propose another time.
                </p>

                {/* Form */}
                <div className="space-y-6 mb-10">
                    {/* Date Input */}
                    <div>
                        <label className="block text-[12px] font-black text-[#1A1A1A] font-montserrat mb-3 uppercase tracking-wider">
                            Select Date
                        </label>
                        <DatePicker value={date} onChange={setDate} />
                    </div>

                    {/* Time Input */}
                    <div>
                        <label className="block text-[12px] font-black text-[#1A1A1A] font-montserrat mb-3 uppercase tracking-wider">
                            Select Time
                        </label>
                        <TimePicker value={time} onChange={setTime} />
                    </div>

                    {/* Note Input */}
                    <div>
                        <label className="block text-[12px] font-black text-[#1A1A1A] font-montserrat mb-3 uppercase tracking-wider">
                            Additional Note (Optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full h-32 px-5 py-4 rounded-xl border border-gray-200 text-[15px] font-medium text-[#666666] focus:outline-none focus:border-[#0095FF] resize-none"
                            placeholder="Book an inspection at your preferred date and time. We coordinate with the homeowner for you."
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-full border-[2px] border-[#0095FF] text-[16px] font-bold text-[#0095FF] font-montserrat hover:bg-blue-50 transition-all active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSuggest({ date, time: formatTimeTo24h(time), note })}
                        className="flex-1 py-4 rounded-full bg-[#002B7F] text-[16px] font-bold text-white font-montserrat hover:bg-[#001D54] transition-all shadow-md active:scale-[0.98]"
                    >
                        Suggest
                    </button>
                </div>
            </div>
        </div>
    );
}
