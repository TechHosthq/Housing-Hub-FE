"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";

interface PropertyDeletedModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PropertyDeletedModal({ isOpen, onClose }: PropertyDeletedModalProps) {
    // Auto-close after 3 seconds
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[24px] w-full max-w-[400px] p-12 overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 rounded-full bg-[#E5F4FF] flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 rounded-full bg-[#E5F4FF] animate-ping opacity-20" />
                        <Check size={48} className="text-[#0095FF] stroke-[3]" />
                    </div>

                    <h2 className="text-[28px] font-black text-[#1A1A1A] font-montserrat">
                        Property Deleted
                    </h2>
                </div>
            </div>
        </div>
    );
}
