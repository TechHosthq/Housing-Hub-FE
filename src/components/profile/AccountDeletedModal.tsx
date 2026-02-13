"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AccountDeletedModalProps {
    isOpen: boolean;
}

export default function AccountDeletedModal({ isOpen }: AccountDeletedModalProps) {
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                router.push("/");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, router]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

            {/* Modal Content */}
            <div className="relative w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl p-12 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                {/* Trash Icon Circle */}
                <div className="w-24 h-24 bg-[#E9F3FF] rounded-full flex items-center justify-center text-[#0095FF] mb-10 shadow-sm relative">
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-[#0095FF]/5 rounded-full animate-ping duration-[2000ms]" />
                    <Trash2 size={40} strokeWidth={2.5} className="relative z-10" />
                </div>

                <h2 className="text-[28px] font-black text-[#1A1A1A] font-montserrat text-center">
                    Account Deleted!
                </h2>

                {/* Optional: Subtle redirect text */}
                <p className="text-[12px] text-gray-400 font-bold mt-4">
                    Redirecting to home page...
                </p>
            </div>
        </div>
    );
}
