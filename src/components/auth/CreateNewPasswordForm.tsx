"use client";

import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResetSuccessModal from "./ResetSuccessModal";
import { useAuth } from "@/hooks/useAuth";
import { resolveMutationError } from "@/utils/errorResolver";

export default function CreateNewPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resetPassword, isResettingPassword } = useAuth();
    
    const emailFromUrl = searchParams.get("email");
    const tokenFromUrl = searchParams.get("token");

    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    // Populate from URL query params once available
    useEffect(() => {
        if (emailFromUrl) setEmail(emailFromUrl);
        if (tokenFromUrl) setToken(tokenFromUrl);
    }, [emailFromUrl, tokenFromUrl]);

    /**
     * Reads the response rather than trusting the HTTP status.
     *
     * The API answers a dead link with 200 and `isSuccessful: false`, so the
     * mutation's own `isSuccess` is true for a reset that did not happen. This form
     * used to show the success modal and send the user to the sign-in page off that
     * flag; it only ever looked right because the axios interceptor rejects that
     * shape before the flag is set — a side effect, not a decision this screen made.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Those passwords don't match.");
            return;
        }

        if (!email) {
            setError("We need the email address you asked to reset.");
            return;
        }

        if (!token) {
            setError("This link is missing the part that identifies your request. Open the link from your email again, or ask for a new one.");
            return;
        }

        try {
            const result = await resetPassword({
                email,
                token,
                newPassword: formData.newPassword,
            });

            if (result.isSuccessful) {
                setShowModal(true);
                setTimeout(() => router.push("/login"), 3000);
                return;
            }

            setError(result.message || "We couldn't reset your password. Please try again.");
        } catch (failure) {
            // The server's message names the actual obstacle — the link is spent,
            // expired, or superseded by a newer one — and every one of those tells
            // the person what to do next. Replacing it with something generic would
            // leave them clicking the same dead link.
            setError(resolveMutationError(failure).join(" "));
        }
    };

    const hasUrlParams = !!emailFromUrl && !!tokenFromUrl;

    return (
        <div className="w-full max-w-[350px] px-4 py-8 relative">
            {/* Back Button */}
            <Link
                href="/login"
                className="absolute -top-12 left-4 flex items-center gap-2 text-[#6BB5FF] hover:text-primary-dark transition-colors font-semibold text-[10px]"
            >
                <ArrowLeft size={14} />
                Back
            </Link>

            <div className="mt-16 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-[17px] font-bold text-[#1A1A1A] dark:text-gray-100 font-montserrat">
                        Create New Password
                    </h1>
                    {!hasUrlParams && (
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                            Open this page from the link in your email. If you can&apos;t,
                            fill in the details below.
                        </p>
                    )}
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* Manual Email Input if not in URL */}
                    {!emailFromUrl && (
                        <div className="space-y-1">
                            <label className="text-[9px] font-semibold text-[#666666] dark:text-gray-400">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-primary-dark transition-colors text-sm"
                                placeholder="Enter your email"
                            />
                        </div>
                    )}

                    {/* Manual Token Input if not in URL */}
                    {!tokenFromUrl && (
                        <div className="space-y-1">
                            <label className="text-[9px] font-semibold text-[#666666] dark:text-gray-400">Code from your email link</label>
                            <input
                                type="text"
                                required
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-primary-dark transition-colors text-sm font-mono"
                                placeholder="The long code after token= in the link"
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-[#666666] dark:text-gray-400">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={8}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-primary-dark transition-colors text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">
                            Must be at least 8 characters long and include a mix of letters and numbers
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-[#666666] dark:text-gray-400">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-5 py-3 rounded-full border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-primary-dark transition-colors text-sm"
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
                             disabled={isResettingPassword}
                             className="w-full bg-primary-dark text-white py-4 rounded-full font-bold text-base hover:bg-primary-dark/90 transition-all shadow-lg flex items-center justify-center disabled:opacity-70"
                        >
                             {isResettingPassword ? <Loader2 className="animate-spin mr-2" size={20} /> : "Reset Password"}
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
