"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { parseISODate, todayLocalISODate } from "@/utils/dateUtils";

interface DatePickerProps {
    /** ISO date string (YYYY-MM-DD). */
    value: string;
    /** Called with an ISO date string (YYYY-MM-DD). */
    onChange: (date: string) => void;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const toISODate = (year: number, month: number, day: number) => `${year}-${pad2(month + 1)}-${pad2(day)}`;

export default function DatePicker({ value, onChange }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        const parsed = parseISODate(value);
        return parsed ? new Date(parsed.year, parsed.month, parsed.day) : new Date();
    });

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const today = parseISODate(todayLocalISODate())!;
    const todayDate = new Date(today.year, today.month, today.day);

    const togglePicker = () => setIsOpen(!isOpen);

    const selectDate = (day: number) => {
        onChange(toISODate(viewDate.getFullYear(), viewDate.getMonth(), day));
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() + offset);
        setViewDate(newDate);
    };

    const changeYear = (offset: number) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(viewDate.getFullYear() + offset);
        setViewDate(newDate);
    };

    const selectedParts = parseISODate(value);

    const displayValue = selectedParts
        ? new Date(selectedParts.year, selectedParts.month, selectedParts.day).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric"
          })
        : "";

    return (
        <div className="relative w-full">
            <div className="space-y-1">
                <div className="relative group">
                    <div className="absolute -top-2 left-4 px-1 bg-white dark:bg-gray-900 text-[12px] font-black text-[#0095FF] font-montserrat z-10 uppercase tracking-wider">Date</div>
                    <div
                        onClick={togglePicker}
                        className="w-full px-5 py-4 rounded-xl border-[1.5px] border-[#0095FF] flex items-center justify-between cursor-pointer bg-white dark:bg-gray-900"
                    >
                        <span className="text-[15px] font-bold text-[#1A1A1A] dark:text-gray-100">{displayValue || "Select a date"}</span>
                        <Calendar size={18} className="text-[#0095FF]" />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-[#E9F3FF] rounded-[22px] p-6 shadow-xl border border-[#D9E9FF] w-[280px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => changeMonth(-1)} className="text-[#666666] dark:text-gray-400 hover:text-[#1A1A1A]"><ChevronLeft size={16} /></button>
                            <span className="text-[12px] font-bold text-[#1A1A1A] dark:text-gray-100 px-2">{months[viewDate.getMonth()]}</span>
                            <button type="button" onClick={() => changeMonth(1)} className="text-[#666666] dark:text-gray-400 hover:text-[#1A1A1A]"><ChevronRight size={16} /></button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => changeYear(-1)} className="text-[#666666] dark:text-gray-400 hover:text-[#1A1A1A]"><ChevronLeft size={16} /></button>
                            <span className="text-[12px] font-bold text-[#1A1A1A] dark:text-gray-100 px-2">{viewDate.getFullYear()}</span>
                            <button type="button" onClick={() => changeYear(1)} className="text-[#666666] dark:text-gray-400 hover:text-[#1A1A1A]"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-y-2 text-center">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                            <span key={`${day}-${idx}`} className="text-[10px] font-bold text-[#666666] dark:text-gray-400 mb-2">{day}</span>
                        ))}

                        {Array.from({ length: firstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear()) }).map((_, i) => (
                            <span key={`empty-${i}`} />
                        ))}

                        {Array.from({ length: daysInMonth(viewDate.getMonth(), viewDate.getFullYear()) }).map((_, i) => {
                            const day = i + 1;
                            const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                            const isSelected = !!selectedParts
                                && selectedParts.year === viewDate.getFullYear()
                                && selectedParts.month === viewDate.getMonth()
                                && selectedParts.day === day;
                            const isPast = cellDate < todayDate;

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    disabled={isPast}
                                    onClick={() => selectDate(day)}
                                    className={`text-[10px] w-7 h-7 flex items-center justify-center mx-auto rounded-full transition-all ${isSelected
                                        ? "bg-[#0095FF] text-white font-bold"
                                        : isPast
                                            ? "text-[#C2C2C2] dark:text-gray-700 cursor-not-allowed"
                                            : "text-[#1A1A1A] dark:text-gray-100 hover:bg-white/50"
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex justify-end gap-6 mt-8">
                        <button type="button" onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-[#0095FF] uppercase">Cancel</button>
                        <button type="button" onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-[#0095FF] uppercase">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}
