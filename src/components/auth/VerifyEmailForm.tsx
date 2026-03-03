"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailForm() {
    return (
        <div className="w-full max-w-[350px] px-4 py-8 relative">
            {/* Back Button */}
            <Link
                href="/register"
                className="absolute -top-12 left-4 flex items-center gap-2 text-[#6BB5FF] hover:text-primary-dark transition-colors font-semibold text-[10px]"
            >
                <ArrowLeft size={14} />
                Back
            </Link>

            <div className="text-center space-y-6 mt-20">
                <p className="text-[17px] mb-0 font-bold text-[#1A1A1A] font-montserrat">
                    Verify Your Email
                </p>

                <p className="text-[11px] text-gray-600 leading-relaxed max-w-[280px] mx-auto">
                    We've sent a verification link to <span className="font-semibold text-[#1A1A1A]">@example.com</span>
                </p>

                <div className="pt-4 space-y-4">
                    <button
                        type="button"
                        className="w-full bg-[#07358B] text-white py-4 rounded-full font-bold text-base hover:bg-[#052562] transition-all shadow-lg"
                    >
                        Resend Link
                    </button>

                    <Link
                        href="/register"
                        className="block text-[11px] text-[#6BB5FF] hover:underline transition-all"
                    >
                        Change Email Address
                    </Link>
                </div>
            </div>
        </div>
    );
}
