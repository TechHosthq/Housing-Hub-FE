"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface KYCSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function KYCSuccessModal({ isOpen, onClose }: KYCSuccessModalProps) {
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
            <div className={`relative bg-white rounded-[28px] p-10 w-full max-w-[320px] shadow-2xl flex flex-col items-center text-center transform transition-all duration-300 ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
                {/* Success Icon */}
                <div className="w-20 h-20 rounded-full bg-[#E9F3FF] flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 rounded-full bg-[#E9F3FF] animate-ping opacity-20" />
                    <Check size={32} className="text-[#0095FF] relative z-10" strokeWidth={3} />
                </div>

                <h2 className="text-[20px] font-black text-[#1A1A1A] mb-4 font-montserrat leading-tight">
                    KYC Submitted Successfully!
                </h2>

                <p className="text-[11px] text-[#666666] leading-relaxed max-w-[240px]">
                    Your KYC verification is being reviewed by our admin team. This usually takes 24-48 hours. You'll receive a notification once approved
                </p>
            </div>
        </div>
    );
}
