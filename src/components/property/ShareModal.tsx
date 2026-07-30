"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyTitle: string;
}

export default function ShareModal({ isOpen, onClose, propertyTitle }: ShareModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
            setCopied(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareWhatsApp = () => {
        const text = `${propertyTitle} — ${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    const handleShareEmail = () => {
        const subject = propertyTitle;
        const body = `Check out this property: ${shareUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white dark:bg-gray-900 rounded-[28px] p-8 w-full max-w-[400px] shadow-2xl transform transition-all duration-300 ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-[24px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat">
                        Share Property
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-[#1A1A1A] dark:text-gray-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Options */}
                <div className="space-y-4">
                    <button
                        onClick={handleCopyLink}
                        className="w-full px-6 py-4 rounded-[30px] border border-[#E5E5E5] dark:border-gray-800 text-left text-[#999999] dark:text-gray-500 text-sm font-bold hover:border-primary-dark hover:text-primary-dark transition-all flex items-center justify-between"
                    >
                        {copied ? "Link Copied" : "Copy Link"}
                        {copied && <Check size={16} className="text-primary-dark" />}
                    </button>
                    <button
                        onClick={handleShareWhatsApp}
                        className="w-full px-6 py-4 rounded-[30px] border border-[#E5E5E5] dark:border-gray-800 text-left text-[#999999] dark:text-gray-500 text-sm font-bold hover:border-primary-dark hover:text-primary-dark transition-all"
                    >
                        Share On WhatsApp
                    </button>
                    <button
                        onClick={handleShareEmail}
                        className="w-full px-6 py-4 rounded-[30px] border border-[#E5E5E5] dark:border-gray-800 text-left text-[#999999] dark:text-gray-500 text-sm font-bold hover:border-primary-dark hover:text-primary-dark transition-all"
                    >
                        Share Via Email
                    </button>
                </div>
            </div>
        </div>
    );
}
