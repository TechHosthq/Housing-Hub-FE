"use client";

import { Clock, ChevronDown } from "lucide-react";
import { useState } from "react";

interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [hour, setHour] = useState("10");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");

    const togglePicker = () => setIsOpen(!isOpen);

    const handleConfirm = () => {
        onChange(`${hour}:${minute} ${period}`);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <div className="space-y-1">
                <div className="relative group">
                    <div className="absolute -top-2 left-4 px-1 bg-white text-[12px] font-black text-[#0095FF] font-montserrat z-10 uppercase tracking-wider">Time</div>
                    <div
                        onClick={togglePicker}
                        className="w-full px-5 py-4 rounded-xl border-[1.5px] border-[#0095FF] flex items-center justify-between cursor-pointer bg-white"
                    >
                        <span className="text-[15px] font-bold text-[#1A1A1A]">{value || "--:-- --"}</span>
                        <Clock size={18} className="text-[#0095FF]" />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-[#E9F3FF] rounded-[22px] p-6 shadow-xl border border-[#D9E9FF] w-[200px]">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="relative">
                            <select
                                value={hour}
                                onChange={(e) => setHour(e.target.value)}
                                className="appearance-none bg-white border border-[#E5E5E5] rounded-lg px-3 py-1.5 text-[11px] font-bold text-[#1A1A1A] pr-8 focus:outline-none"
                            >
                                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none" />
                        </div>
                        <span className="font-bold text-[#1A1A1A]">:</span>
                        <div className="relative">
                            <select
                                value={minute}
                                onChange={(e) => setMinute(e.target.value)}
                                className="appearance-none bg-white border border-[#E5E5E5] rounded-lg px-3 py-1.5 text-[11px] font-bold text-[#1A1A1A] pr-8 focus:outline-none"
                            >
                                {["00", "15", "30", "45"].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none" />
                        </div>
                        <span className="font-bold text-[#1A1A1A]">:</span>
                        <div className="relative">
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="appearance-none bg-white border border-[#E5E5E5] rounded-lg px-3 py-1.5 text-[11px] font-bold text-[#1A1A1A] pr-8 focus:outline-none"
                            >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-6">
                        <button onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-[#0095FF] uppercase">Cancel</button>
                        <button onClick={handleConfirm} className="text-[10px] font-bold text-[#0095FF] uppercase">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}
