"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { format } from "date-fns";
import { Notification } from "@/types/notification";

interface NotificationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    notification: Notification | null;
}

export default function NotificationDetailModal({ isOpen, onClose, notification }: NotificationDetailModalProps) {
    if (!isOpen || !notification) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-900 rounded-[32px] w-full max-w-[550px] p-8 shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-start gap-4 mb-4 flex-shrink-0">
                    <div>
                        <h2 className="text-[20px] font-bold text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-1">
                            {notification.title || "Notification"}
                        </h2>
                        <span className="text-[12px] text-gray-400 dark:text-gray-500 font-bold">
                            {format(new Date(notification.dateCreated), "MMMM dd, yyyy 'at' hh:mm a")}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#1A1A1A] dark:text-gray-100 hover:opacity-70 transition-opacity flex-shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto pr-1">
                    <p className="text-[15px] text-[#666666] dark:text-gray-400 font-medium leading-relaxed whitespace-pre-wrap">
                        {notification.message}
                    </p>
                    {notification.propertyId && (
                        <Link
                            href={`/property/${notification.propertyId}`}
                            className="inline-flex mt-6 px-6 py-3 rounded-full bg-primary-dark text-white text-[14px] font-bold hover:opacity-90 transition-opacity"
                        >
                            View Property
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
