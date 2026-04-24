import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ResetPasswordModal({ isOpen, onClose }: ResetPasswordModalProps) {
    const { changePassword, isChangingPassword } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        changePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        }, {
            onSuccess: (response) => {
                if (response.isSuccessful) {
                    onClose();
                } else {
                    setError(response.message || "Failed to change password");
                }
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-[32px] font-black text-[#1A1A1A] font-montserrat tracking-tight">
                            Change Password
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-xs text-red-500 bg-red-50 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-[14px] font-bold text-[#666666] mb-3">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? "text" : "password"}
                                    required
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="w-full px-6 py-4 rounded-full border-2 border-[#F2F2F2] bg-white text-[#1A1A1A] transition-all focus:border-primary-dark outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[14px] font-bold text-[#666666] mb-3">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    required
                                    minLength={8}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full px-6 py-4 rounded-full border-2 border-[#F2F2F2] bg-white text-[#1A1A1A] transition-all focus:border-primary-dark outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[14px] font-bold text-[#666666] mb-3">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-6 py-4 rounded-full border-2 border-[#F2F2F2] bg-white text-[#1A1A1A] transition-all focus:border-primary-dark outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isChangingPassword}
                            className="w-full py-5 rounded-full bg-primary-dark text-white text-[16px] font-black transition-all hover:bg-primary-dark/90 active:scale-[0.98] shadow-lg flex items-center justify-center disabled:opacity-70"
                        >
                            {isChangingPassword ? <Loader2 className="animate-spin mr-2" size={24} /> : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
