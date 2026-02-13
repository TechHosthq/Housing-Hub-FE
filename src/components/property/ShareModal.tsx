"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white rounded-[28px] p-8 w-full max-w-[400px] shadow-2xl transform transition-all duration-300 ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-[24px] font-black text-[#1A1A1A] font-montserrat">
                        Share Property
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors text-[#1A1A1A]"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Options */}
                <div className="space-y-4">
                    <button className="w-full px-6 py-4 rounded-[30px] border border-[#E5E5E5] text-left text-[#999999] text-sm font-bold hover:border-[#002D6B] hover:text-[#002D6B] transition-all">
                        Copy Link
                    </button>
                    <button className="w-full px-6 py-4 rounded-[30px] border border-[#E5E5E5] text-left text-[#999999] text-sm font-bold hover:border-[#002D6B] hover:text-[#002D6B] transition-all">
                        Share On WhatsApp
                    </button>
                    <button className="w-full px-6 py-4 rounded-[30px] border border-[#E5E5E5] text-left text-[#999999] text-sm font-bold hover:border-[#002D6B] hover:text-[#002D6B] transition-all">
                        Share Via Email
                    </button>
                </div>
            </div>
        </div>
    );
}
