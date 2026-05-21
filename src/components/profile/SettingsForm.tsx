"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/context/UserRoleContext";
import DeleteAccountModal from "./DeleteAccountModal";
import ResetPasswordModal from "./ResetPasswordModal";

export default function SettingsForm() {
    const router = useRouter();
    const { role } = useUserRole();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

    const settingsItems = [
        { label: "Reset Password", type: "button", id: "reset-password" },
        { label: "Notifications", type: "link", href: "/notifications" },
        { label: "Privacy", type: "link", href: "/privacy" },
        { label: "Dark Mode", type: "toggle", id: "dark-mode" },
        { label: "Switch To Owners Account", type: "link", href: "/switch-account" },
        { label: "Delete Account", type: "button", id: "delete-account", isDanger: true }
    ];

    const handleItemClick = (item: any) => {
        if (item.id === "delete-account") {
            setIsDeleteModalOpen(true);
        } else if (item.id === "reset-password") {
            setIsResetModalOpen(true);
        } else if (item.href === "/switch-account") {
            if (role === "Owner") {
                setIsOwnerModalOpen(true);
            } else {
                router.push("/kyc");
            }
        } else if (item.type === "link" && item.href) {
            router.push(item.href);
        }
    };

    return (
        <div className="flex-1 bg-white rounded-[22px] border border-[#F2F2F2] p-8 shadow-sm h-fit">
            <h2 className="text-[20px] font-black text-[#1A1A1A] font-montserrat mb-8">
                Settings
            </h2>

            <div className="flex flex-col gap-4">
                {settingsItems.map((item) => (
                    <div
                        key={item.label}
                        onClick={() => handleItemClick(item)}
                        className={`group relative flex items-center justify-between p-5 rounded-[16px] border transition-all cursor-pointer hover:shadow-md ${item.isDanger
                            ? "border-red-100 bg-red-50/10 hover:bg-red-50/30"
                            : "border-[#F2F2F2] hover:border-primary-dark/30 hover:bg-gray-50/50"
                            }`}
                    >
                        <span className={`text-[14px] font-bold ${item.isDanger ? "text-[#FF3B30]" : "text-[#1A1A1A]"
                            }`}>
                            {item.label}
                        </span>

                        {item.type === "toggle" ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDarkMode(!isDarkMode);
                                }}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isDarkMode ? "bg-primary-dark" : "bg-gray-200"
                                    }`}
                            >
                                <div
                                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${isDarkMode ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        ) : (
                            <ChevronRight
                                size={18}
                                className={item.isDanger ? "text-[#FF3B30]/50" : "text-gray-400 group-hover:text-primary-dark"}
                            />
                        )}
                    </div>
                ))}
            </div>

            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />

            <ResetPasswordModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
            />

            {/* Already Owner Modal */}
            {isOwnerModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOwnerModalOpen(false)} />
                    <div className="relative w-full max-w-[400px] bg-white rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-300 text-center">
                        <h3 className="text-[20px] font-black text-[#1A1A1A] mb-4 font-montserrat">You are already an Owner</h3>
                        <p className="text-[14px] text-gray-500 mb-8 font-medium">Your account already has the Owner role. You don't need to switch accounts or verify KYC again.</p>
                        <button
                            onClick={() => setIsOwnerModalOpen(false)}
                            className="w-full py-4 rounded-full bg-[#002D6B] text-white font-bold hover:bg-[#001D4B] transition-colors"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
