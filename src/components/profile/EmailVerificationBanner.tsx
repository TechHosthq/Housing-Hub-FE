"use client";

import { useState } from "react";
import { MailWarning, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";

interface EmailVerificationBannerProps {
    /** From GET /api/v1/Customer/{id}. Undefined while loading. */
    emailVerified?: boolean;
    isLoading?: boolean;
}

/**
 * Lets users who never completed the sign-up OTP step verify their email later.
 * Hidden once the account is verified.
 */
export default function EmailVerificationBanner({ emailVerified, isLoading }: EmailVerificationBannerProps) {
    const user = useAuthStore((state) => state.user);
    const { resendOtp, isResendingOtp } = useAuth();
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    // Don't flash the banner while we still don't know the status.
    if (isLoading || emailVerified !== false) return null;

    const handleResend = () => {
        if (!user?.email) {
            setError("We couldn't find your email address. Please sign in again.");
            return;
        }
        setError("");
        resendOtp(
            { email: user.email },
            {
                onSuccess: (response) => {
                    if (response.isSuccessful) {
                        setSent(true);
                    } else {
                        setError(response.message || "Couldn't send the email. Please try again.");
                    }
                },
                onError: () => setError("Couldn't send the email. Please try again."),
            }
        );
    };

    if (sent) {
        return (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl border border-green-100 bg-green-50">
                <CheckCircle2 className="flex-shrink-0 text-green-600 mt-0.5" size={20} />
                <div>
                    <p className="text-[13px] font-bold text-green-800">Verification email sent</p>
                    <p className="text-[12px] text-green-700 mt-0.5">
                        Check <span className="font-semibold">{user?.email}</span> and follow the link to verify your account.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 mb-6 rounded-2xl border border-amber-100 bg-amber-50">
            <MailWarning className="flex-shrink-0 text-amber-600" size={20} />
            <div className="flex-1">
                <p className="text-[13px] font-bold text-amber-900">Your email isn&apos;t verified yet</p>
                <p className="text-[12px] text-amber-800 mt-0.5">
                    {error || "Verify your email to secure your account and receive inspection updates."}
                </p>
            </div>
            <button
                type="button"
                onClick={handleResend}
                disabled={isResendingOtp}
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary-dark text-white text-[12px] font-bold hover:bg-primary-dark/90 transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
                {isResendingOtp && <Loader2 className="animate-spin" size={14} />}
                Resend verification email
            </button>
        </div>
    );
}
