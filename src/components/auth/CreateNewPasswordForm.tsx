"use client";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ResetSuccessModal from "./ResetSuccessModal";

export default function CreateNewPasswordForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);

        // Redirect to home after 3 seconds
        setTimeout(() => {
            router.push("/");
        }, 3000);
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
                    Create New Password
                </h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-[#666666]">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1">
                            Must be at least 8 characters long and include a mix of letters and numbers
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-[#666666]">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-[#002D6B] text-white py-4 rounded-full font-bold text-base hover:bg-[#001D4B] transition-all shadow-lg"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>

            <ResetSuccessModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
}
