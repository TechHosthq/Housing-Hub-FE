"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For demo purposes, we redirect immediately
        router.push("/dashboard");
    };

    return (
        <div className="w-full max-w-[350px] px-4 py-8">
            <h1 className="text-[17px] font-bold text-[#1A1A1A] mb-7 text-center font-montserrat">
                Welcome Back
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-[#666666]">Email or Phone Number</label>
                    <input
                        type="text"
                        className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors"
                        placeholder=""
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-[#666666]">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors"
                            placeholder=""
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className="flex justify-end pt-1">
                        <Link href="/reset-password" className="text-[10px] text-[#3b82f6] hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                <div className="pt-4 space-y-4">
                    <button
                        type="submit"
                        className="w-full bg-[#002D6B] text-white py-4 rounded-full font-bold text-base hover:bg-[#001D4B] transition-all shadow-lg"
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 border border-[#6BB5FF] text-[#6BB5FF] py-4 rounded-full font-bold text-base hover:bg-blue-50 transition-all"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-xs text-gray-600">
                            Don't have an Account? <Link href="/register" className="text-[#3b82f6] hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
