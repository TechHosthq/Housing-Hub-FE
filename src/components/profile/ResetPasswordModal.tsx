"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ResetPasswordModal({ isOpen, onClose }: ResetPasswordModalProps) {
    const [email, setEmail] = useState("");
    const [isTouched, setIsTouched] = useState(false);

    if (!isOpen) return null;

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValid = validateEmail(email);
    const showError = isTouched && !isValid && email.length > 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-[32px] font-black text-[#1A1A1A] font-montserrat tracking-tight">
                            Reset Password
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Email Input */}
                    <div className="mb-12">
                        <label className="block text-[14px] font-bold text-[#666666] mb-3">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setIsTouched(true);
                            }}
                            placeholder="Placeholder"
                            className={`w-full px-6 py-4 rounded-full border-2 transition-all text-[15px] font-medium outline-none ${showError
                                    ? "border-[#FF3B30] bg-[#FFF5F5] text-[#FF3B30] placeholder:text-[#FF3B30]/50"
                                    : "border-[#F2F2F2] bg-white text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#002D6B]"
                                }`}
                        />
                        {showError && (
                            <p className="text-[12px] font-bold text-[#FF3B30] mt-2 ml-4">
                                Invalid Email
                            </p>
                        )}
                    </div>

                    {/* Action Button */}
                    <button
                        disabled={!email.trim()}
                        className={`w-full py-5 rounded-full text-[16px] font-black transition-all active:scale-[0.98] shadow-lg ${email.trim()
                                ? "bg-[#002B7F] text-white hover:bg-[#001D5F]"
                                : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Send Reset Link
                    </button>
                </div>
            </div>
        </div>
    );
}
