"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(2025, 7, 1)); // Default Aug 2025 like design

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const togglePicker = () => setIsOpen(!isOpen);

    const selectDate = (day: number) => {
        const formattedDate = `${String(viewDate.getMonth() + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}/${viewDate.getFullYear()}`;
        onChange(formattedDate);
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() + offset);
        setViewDate(newDate);
    };

    return (
        <div className="relative w-full">
            <div className="space-y-1">
                <div className="relative group">
                    <div className="absolute -top-2 left-4 px-1 bg-white text-[12px] font-black text-[#0095FF] font-montserrat z-10 uppercase tracking-wider">Date</div>
                    <div
                        onClick={togglePicker}
                        className="w-full px-5 py-4 rounded-xl border-[1.5px] border-[#0095FF] flex items-center justify-between cursor-pointer bg-white"
                    >
                        <span className="text-[15px] font-bold text-[#1A1A1A]">{value || "MM/DD/YYYY"}</span>
                        <Calendar size={18} className="text-[#0095FF]" />
                    </div>
                </div>
                <p className="text-[11px] text-[#A3A3A3] font-bold ml-1">MM/DD/YYYY</p>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-[#E9F3FF] rounded-[22px] p-6 shadow-xl border border-[#D9E9FF] w-[280px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <button onClick={() => changeMonth(-1)} className="text-[#666666] hover:text-[#1A1A1A]"><ChevronLeft size={16} /></button>
                            <span className="text-[12px] font-bold text-[#1A1A1A] px-2">{months[viewDate.getMonth()]}</span>
                            <button onClick={() => changeMonth(1)} className="text-[#666666] hover:text-[#1A1A1A]"><ChevronRight size={16} /></button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="text-[#666666] hover:text-[#1A1A1A]"><ChevronLeft size={16} /></button>
                            <span className="text-[12px] font-bold text-[#1A1A1A] px-2">{viewDate.getFullYear()}</span>
                            <button className="text-[#666666] hover:text-[#1A1A1A]"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-y-2 text-center">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                            <span key={`${day}-${idx}`} className="text-[10px] font-bold text-[#666666] mb-2">{day}</span>
                        ))}

                        {Array.from({ length: firstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear()) }).map((_, i) => (
                            <span key={`empty-${i}`} />
                        ))}

                        {Array.from({ length: daysInMonth(viewDate.getMonth(), viewDate.getFullYear()) }).map((_, i) => {
                            const day = i + 1;
                            const isSelected = value.includes(`${String(viewDate.getMonth() + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`);
                            return (
                                <button
                                    key={day}
                                    onClick={() => selectDate(day)}
                                    className={`text-[10px] w-7 h-7 flex items-center justify-center mx-auto rounded-full transition-all ${isSelected ? "bg-[#0095FF] text-white font-bold" : "text-[#1A1A1A] hover:bg-white/50"
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex justify-end gap-6 mt-8">
                        <button onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-[#0095FF] uppercase">Cancel</button>
                        <button onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-[#0095FF] uppercase">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}
