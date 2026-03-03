"use client";

import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface StaffMember {
    id: string;
    name: string;
    isAvailable: boolean;
}

const STAFF_MEMBERS: StaffMember[] = [
    { id: "1", name: "Agent John Smith", isAvailable: false },
    { id: "2", name: "Agent Rebecca Uyi", isAvailable: false },
    { id: "3", name: "Agent Uche Okafor", isAvailable: false },
    { id: "none", name: "None Available", isAvailable: true }
];

interface AssignStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (staffId: string) => void;
    onReschedule: () => void;
}

export default function AssignStaffModal({
    isOpen,
    onClose,
    onAssign,
    onReschedule
}: AssignStaffModalProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const handleAction = () => {
        if (!selectedStaff) return;
        if (selectedStaff.id === "none") {
            onReschedule();
        } else {
            onAssign(selectedStaff.id);
        }
    };

    const isNoneAvailable = selectedStaff?.id === "none";

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[32px] w-full max-w-[550px] p-8 overflow-visible shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[28px] font-bold text-[#1A1A1A] font-montserrat">
                        Assign to Staff
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
                    Select a SpaceHub staff member to handle this inspection on your behalf.
                </p>

                {/* Dropdown Section */}
                <div className="mb-10" ref={dropdownRef}>
                    <label className="block text-[12px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                        SELECT STAFF MEMBER
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full flex items-center justify-between px-5 py-4 rounded-[12px] border transition-all text-left ${isDropdownOpen ? "border-[#0095FF] ring-2 ring-[#0095FF]/10" : "border-[#E5E5E5] hover:border-[#CCCCCC]"
                                }`}
                        >
                            <span className={`text-[15px] font-medium ${selectedStaff ? "text-[#1A1A1A]" : "text-[#A3A3A3]"}`}>
                                {selectedStaff ? selectedStaff.name : "Choose a staff member"}
                            </span>
                            {isDropdownOpen ? (
                                <ChevronUp size={20} className="text-[#A3A3A3]" />
                            ) : (
                                <ChevronDown size={20} className="text-[#A3A3A3]" />
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[16px] shadow-2xl border border-[#F2F2F2] overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                {STAFF_MEMBERS.map((staff) => (
                                    <button
                                        key={staff.id}
                                        onClick={() => {
                                            setSelectedStaff(staff);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F8F8F8] transition-colors text-left group"
                                    >
                                        <span className={`text-[15px] font-medium ${selectedStaff?.id === staff.id ? "text-[#0095FF]" : "text-[#1A1A1A]"}`}>
                                            {staff.name}
                                        </span>
                                        {!staff.isAvailable && staff.id !== "none" && (
                                            <span className="text-[12px] font-semibold text-[#FF4D4C]">
                                                Not Available
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 px-6 rounded-full border border-[#0095FF] text-[15px] font-bold text-[#0095FF] hover:bg-blue-50/50 transition-all active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAction}
                        disabled={!selectedStaff}
                        className={`flex-1 py-4 px-6 rounded-full text-[15px] font-bold transition-all active:scale-[0.98] ${!selectedStaff
                                ? "bg-[#F2F2F2] text-[#A3A3A3] cursor-not-allowed"
                                : "bg-[#002B7F] text-white hover:bg-[#001F5C] shadow-lg shadow-blue-900/10"
                            }`}
                    >
                        {isNoneAvailable ? "Reschedule Instead" : "Assign"}
                    </button>
                </div>
            </div>
        </div>
    );
}
