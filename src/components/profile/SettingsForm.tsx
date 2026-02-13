"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";
import ResetPasswordModal from "./ResetPasswordModal";

export default function SettingsForm() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

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
                            : "border-[#F2F2F2] hover:border-[#002B7F]/30 hover:bg-gray-50/50"
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
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isDarkMode ? "bg-[#002D6B]" : "bg-gray-200"
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
                                className={item.isDanger ? "text-[#FF3B30]/50" : "text-gray-400 group-hover:text-[#002D6B]"}
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
        </div>
    );
}
