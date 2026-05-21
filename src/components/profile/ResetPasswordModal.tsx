"use client";

import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import SuccessModal from "@/components/common/SuccessModal";

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EMPTY_FORM = { currentPassword: "", newPassword: "", confirmPassword: "" };
const EMPTY_SHOW = { current: false, new: false, confirm: false };

export default function ResetPasswordModal({ isOpen, onClose }: ResetPasswordModalProps) {
    const { changePassword, isChangingPassword } = useAuth();

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [showPasswords, setShowPasswords] = useState(EMPTY_SHOW);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    if (!isOpen && !showSuccess) return null;

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setShowPasswords(EMPTY_SHOW);
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        handleClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.newPassword.length < 8) {
            setError("New password must be at least 8 characters.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        changePassword(
            {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            },
            {
                onSuccess: (response) => {
                    if (response.isSuccessful) {
                        resetForm();
                        setShowSuccess(true);
                    } else {
                        const apiError =
                            response.message ||
                            response.errors?.[0]?.errorMessage ||
                            "Failed to change password. Please check your current password.";
                        setError(apiError);
                    }
                },
                onError: () => {
                    setError("Something went wrong. Please try again.");
                },
            }
        );
    };

    const toggleShow = (field: keyof typeof showPasswords) =>
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

    return (
        <>
            {/* Success modal after password changed */}
            <SuccessModal
                isOpen={showSuccess}
                onClose={handleSuccessClose}
                title="Password Updated!"
                message="Your password has been changed successfully. Use your new password next time you log in."
            />

            {/* Change password form modal */}
            {isOpen && !showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-[28px] font-black text-[#1A1A1A] font-montserrat tracking-tight">
                                    Change Password
                                </h2>
                                <button
                                    onClick={handleClose}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error banner */}
                                {error && (
                                    <div className="px-4 py-3 text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center font-semibold">
                                        {error}
                                    </div>
                                )}

                                {/* Current Password */}
                                <div>
                                    <label className="block text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-3">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? "text" : "password"}
                                            required
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            placeholder="Enter current password"
                                            className="w-full px-6 py-4 rounded-full border-2 border-[#F2F2F2] bg-white text-[#1A1A1A] text-[14px] font-semibold transition-all focus:border-[#002D6B] outline-none placeholder:text-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShow("current")}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-3">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            required
                                            minLength={8}
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            placeholder="At least 8 characters"
                                            className="w-full px-6 py-4 rounded-full border-2 border-[#F2F2F2] bg-white text-[#1A1A1A] text-[14px] font-semibold transition-all focus:border-[#002D6B] outline-none placeholder:text-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShow("new")}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-3">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            placeholder="Re-enter new password"
                                            className={`w-full px-6 py-4 rounded-full border-2 bg-white text-[#1A1A1A] text-[14px] font-semibold transition-all outline-none placeholder:text-gray-300 ${
                                                formData.confirmPassword && formData.confirmPassword !== formData.newPassword
                                                    ? "border-red-300 focus:border-red-400"
                                                    : "border-[#F2F2F2] focus:border-[#002D6B]"
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShow("confirm")}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {formData.confirmPassword && formData.confirmPassword !== formData.newPassword && (
                                        <p className="mt-2 text-[11px] text-red-500 font-semibold ml-4">
                                            Passwords don&apos;t match
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className="w-full py-4 rounded-full bg-[#002D6B] hover:bg-[#001D4B] text-white text-[15px] font-black transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                                >
                                    {isChangingPassword && <Loader2 className="animate-spin" size={20} />}
                                    {isChangingPassword ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
