"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/create-new-password");
    };

    return (
        <div className="w-full max-w-[350px] px-4 py-8 relative">
            {/* Back Button */}
            <Link
                href="/login"
                className="absolute -top-12 left-4 flex items-center gap-2 text-[#6BB5FF] hover:text-[#002D6B] transition-colors font-semibold text-[10px]"
            >
                <ArrowLeft size={14} />
                Back
            </Link>

            <div className="mt-16 space-y-6">
                <h1 className="text-[17px] font-bold text-[#1A1A1A] font-montserrat text-center">
                    Reset Password
                </h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-[#666666]">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors"
                            placeholder=""
                        />
                        <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full bg-[#002D6B] text-white py-4 rounded-full font-bold text-base hover:bg-[#001D4B] transition-all shadow-lg"
                        >
                            Send Reset Link
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
