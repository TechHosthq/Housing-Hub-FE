"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/useThemeStore";
import { useNotificationSoundStore } from "@/store/useNotificationSoundStore";
import { playNotificationAudio } from "@/lib/notificationAudio";
import DeleteAccountModal from "./DeleteAccountModal";
import ResetPasswordModal from "./ResetPasswordModal";

export default function SettingsForm() {
    const router = useRouter();
    const isDarkMode = useThemeStore((state) => state.isDarkMode);
    const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
    const isSoundEnabled = useNotificationSoundStore((state) => state.isSoundEnabled);
    const toggleSound = useNotificationSoundStore((state) => state.toggleSound);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const settingsItems = [
        { label: "Reset Password", type: "button", id: "reset-password" },
        { label: "Notifications", type: "link", href: "/notifications" },
        { label: "Privacy", type: "link", href: "/privacy" },
        { label: "Dark Mode", type: "toggle", id: "dark-mode" },
        { label: "Notification Sound", type: "toggle", id: "notification-sound" },
        { label: "Delete Account", type: "button", id: "delete-account", isDanger: true }
    ];

    const handleItemClick = (item: { id?: string; type: string; href?: string }) => {
        if (item.id === "delete-account") {
            setIsDeleteModalOpen(true);
        } else if (item.id === "reset-password") {
            setIsResetModalOpen(true);
        } else if (item.type === "link" && item.href) {
            router.push(item.href);
        }
    };

    return (
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 p-8 shadow-sm h-fit">
            <h2 className="text-[20px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-8">
                Settings
            </h2>

            <div className="flex flex-col gap-4">
                {settingsItems.map((item) => (
                    <div
                        key={item.label}
                        onClick={() => handleItemClick(item)}
                        className={`group relative flex items-center justify-between p-5 rounded-[16px] border transition-all cursor-pointer hover:shadow-md ${item.isDanger
                            ? "border-red-100 dark:border-red-900/50 bg-red-50/10 dark:bg-red-900/10 hover:bg-red-50/30 dark:hover:bg-red-900/20"
                            : "border-[#F2F2F2] dark:border-gray-800 hover:border-primary-dark/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                            }`}
                    >
                        <span className={`text-[14px] font-bold ${item.isDanger ? "text-[#FF3B30]" : "text-[#1A1A1A] dark:text-gray-100"
                            }`}>
                            {item.label}
                        </span>

                        {item.type === "toggle" ? (
                            (() => {
                                const isOn = item.id === "notification-sound" ? isSoundEnabled : isDarkMode;
                                const onToggle = item.id === "notification-sound" ? toggleSound : toggleDarkMode;
                                return (
                                    <div className="flex items-center gap-3">
                                        {item.id === "notification-sound" && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    playNotificationAudio();
                                                }}
                                                className="text-[11px] font-bold text-primary-dark hover:underline"
                                            >
                                                Test
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggle();
                                            }}
                                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isOn ? "bg-primary-dark" : "bg-gray-200 dark:bg-gray-700"
                                                }`}
                                        >
                                            <div
                                                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${isOn ? "translate-x-5" : "translate-x-0"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                );
                            })()
                        ) : (
                            <ChevronRight
                                size={18}
                                className={item.isDanger ? "text-[#FF3B30]/50" : "text-gray-400 dark:text-gray-500 group-hover:text-primary-dark"}
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
