"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useGoogleAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { resolveApiError } from "@/utils/errorResolver";
import GoogleSignInButton from "./GoogleSignInButton";
import { postAuthRoute } from "@/utils/authRouting";
import { resolveGoogleAuthError } from "@/utils/googleAuthError";

export default function RegisterForm() {
    const router = useRouter();
    const { register, isRegistering, registerError, registerSuccess } = useAuth();
    const { signInWithGoogle, isGoogleAuthing, googleAuthError } = useGoogleAuth();
    const googleError = resolveGoogleAuthError(googleAuthError);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    const [showPassword, setShowPassword] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        customerType: 1, // 1 for Buyer/Renter, 2 for Homeowner
        password: "",
    });

    useEffect(() => {
        if (registerSuccess) {
            router.push("/verify-email");
        }
    }, [registerSuccess, router]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAgreed) return;
        register(formData);
    };

    // Google sign-up returns a verified account and a JWT immediately, so there's no
    // OTP step — but the account type is still Unset, so send them to the one-time
    // "How will you use Housing Hub?" step before the dashboard.
    useEffect(() => {
        if (isAuthenticated) {
            router.push(postAuthRoute(user?.customerType));
        }
    }, [isAuthenticated, user?.customerType, router]);

    return (
        <div className="w-full max-w-[350px] px-4 py-8">
            <h1 className="text-[17px] font-bold text-[#1A1A1A] mb-7 text-center font-montserrat">
                Create Account
            </h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {registerError && (
                    <div className="p-3 text-xs text-red-500 bg-red-50 rounded-lg text-center">
                        {(() => {
                            // Handle both: raw response rejection (isSuccessful:false) and HTTP error
                            const err = registerError as any;
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-[#666666]">First Name</label>
                        <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-primary-dark transition-colors"
                            placeholder=""
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-[#666666]">Last Name</label>
                        <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-primary-dark transition-colors"
                            placeholder=""
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-[#666666]">Email Address</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-primary-dark transition-colors"
                        placeholder=""
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-[#666666]">Phone Number</label>
                    <div className="relative">
                        <input
                            type="tel"
                            required
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-primary-dark transition-colors"
                            placeholder=""
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-[#666666]">Customer Type</label>
                    <div className="relative">
                        <select 
                            value={formData.customerType}
                            onChange={(e) => setFormData({ ...formData, customerType: parseInt(e.target.value) })}
                            className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] focus:outline-none focus:border-primary-dark transition-colors appearance-none bg-white text-gray-600"
                        >
                            <option value={1}>Buyer/Renter</option>
                            <option value={2}>Homeowner</option>
                            <option value={3}>Agent</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-[#666666]">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={8}
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
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <p className="text-[8px] text-[#9E9E9E] mt-1">Between 8 and 72 characters</p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                        className="w-6 h-6 rounded-full border-2 border-gray-200 text-primary-dark focus:ring-primary-dark cursor-pointer accent-primary-dark"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                        I agree to the <Link href="#" className="text-[#3b82f6] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#3b82f6] hover:underline">Privacy Policy</Link>
                    </label>
                </div>

                <div className="pt-4 space-y-4">
                    <button
                        type="submit"
                        disabled={!isAgreed || isRegistering}
                        className={`w-full py-4 rounded-full font-bold text-base transition-all flex items-center justify-center ${isAgreed && !isRegistering
                            ? "bg-primary-dark text-white hover:bg-primary-dark/90 cursor-pointer"
                            : "bg-[#F2F2F2] text-[#BDBDBD] cursor-not-allowed"}`}
                    >
                        {isRegistering ? <Loader2 className="animate-spin mr-2" size={20} /> : "Register"}
                    </button>

                    {googleError && (
                        <div className="p-3 text-xs text-red-500 bg-red-50 rounded-lg text-center">
                            {googleError.message}
                            {googleError.suggestPasswordLogin && (
                                <>
                                    {" "}
                                    <Link href="/login" className="underline font-semibold">
                                        Go to login
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    <GoogleSignInButton
                        onCredential={signInWithGoogle}
                        isLoading={isGoogleAuthing}
                    />

                    <div className="text-center">
                        <p className="text-xs text-gray-600">
                            Already have an account? <Link href="/login" className="text-[#3b82f6] hover:underline">Log in</Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
