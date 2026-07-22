"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useGoogleAuth } from "@/hooks/useAuth";
import GoogleSignInButton from "./GoogleSignInButton";
import { useAuthStore } from "@/store/useAuthStore";
import { resolveApiError } from "@/utils/errorResolver";

export default function LoginForm() {
    const router = useRouter();
    const { login, isLoggingIn, loginError } = useAuth();
    const { signInWithGoogle, isGoogleAuthing } = useGoogleAuth();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        emailOrPhone: "",
        password: "",
    });

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(formData);
    };

    // The redirect to /dashboard is handled by the isAuthenticated effect above
    // once the exchanged JWT lands in the auth store.

    return (
        <div className="w-full max-w-[350px] px-4 py-8">
            <h1 className="text-[17px] font-bold text-[#1A1A1A] mb-7 text-center font-montserrat">
                Welcome Back
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {loginError && (
                    <div className="p-3 text-xs text-red-500 bg-red-50 rounded-lg text-center">
                        {(() => {
                            // Handle both: raw response rejection (isSuccessful:false) and HTTP error
                            const err = loginError as any;
                            const messages = resolveApiError(
                                err?.data ? { response: err } : err
                            );
                            return messages.length === 1 ? messages[0] : (
                                <ul className="list-none m-0 p-0 space-y-0.5">
                                    {messages.map((m: string, i: number) => <li key={i}>{m}</li>)}
                                </ul>
                            );
                        })()}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-[#666666]">Email or Phone Number</label>
                    <input
                        type="text"
                        required
                        value={formData.emailOrPhone}
                        onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                        className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-primary-dark transition-colors"
                        placeholder=""
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-[#666666]">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-primary-dark transition-colors"
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
                        disabled={isLoggingIn}
                        className="w-full bg-primary-dark text-white py-4 rounded-full font-bold text-base hover:bg-primary-dark/90 transition-all shadow-lg flex items-center justify-center disabled:opacity-70"
                    >
                        {isLoggingIn ? <Loader2 className="animate-spin mr-2" size={20} /> : "Login"}
                    </button>

                    <GoogleSignInButton
                        onCredential={signInWithGoogle}
                        isLoading={isGoogleAuthing}
                    />

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
