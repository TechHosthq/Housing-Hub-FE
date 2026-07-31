"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import { useNotification } from "@/hooks/useNotification";
import { Notification, NotificationType } from "@/types/notification";
import { Bell, Check, Loader2, Info, Calendar, UserCheck, XCircle } from "lucide-react";
import { format } from "date-fns";
import NotificationDetailModal from "@/components/notifications/NotificationDetailModal";

const notificationIcons: Record<number, any> = {
    [NotificationType.InspectionScheduled]: Calendar,
    [NotificationType.InspectionConfirmed]: Check,
    [NotificationType.InspectionDeclined]: XCircle,
    [NotificationType.InspectionRescheduled]: Calendar,
    [NotificationType.InspectionCancelled]: XCircle,
    [NotificationType.KYCApproved]: UserCheck,
    [NotificationType.KYCRejected]: XCircle,
};

const iconColors: Record<number, string> = {
    [NotificationType.InspectionScheduled]: "bg-blue-100 text-blue-600",
    [NotificationType.InspectionConfirmed]: "bg-green-100 text-green-600 dark:text-green-400",
    [NotificationType.InspectionDeclined]: "bg-red-100 text-red-600 dark:text-red-400",
    [NotificationType.InspectionRescheduled]: "bg-orange-100 text-orange-600",
    [NotificationType.InspectionCancelled]: "bg-red-100 text-red-600 dark:text-red-400",
    [NotificationType.KYCApproved]: "bg-green-100 text-green-600 dark:text-green-400",
    [NotificationType.KYCRejected]: "bg-red-100 text-red-600 dark:text-red-400",
};

export default function NotificationsPage() {
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const { useGetNotifications, markAsRead, markAllAsRead, isMarkingAllRead } = useNotification();
    
    const { data: notificationsResponse, isLoading } = useGetNotifications({
        pageNumber,
        pageSize: 20
    });

    const notifications = notificationsResponse?.data?.items || [];

    const handleMarkAll = () => {
        markAllAsRead();
    };

    const handleRead = (id: string) => {
        markAsRead(id);
    };

    const handleOpenNotification = (notification: Notification) => {
        setSelectedNotification(notification);
        if (!notification.isRead) {
            handleRead(notification.id);
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <DashboardNavbar />

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-[28px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-2">
                            Notifications
                        </h1>
                        <p className="text-gray-400 dark:text-gray-500 font-bold">Stay updated with your activities</p>
                    </div>
                    <button 
                        onClick={handleMarkAll}
                        disabled={isMarkingAllRead || notifications.length === 0}
                        className="text-primary-dark font-black text-xs hover:underline disabled:opacity-50"
                    >
                        Mark all as read
                    </button>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="animate-spin text-primary-dark w-10 h-10" />
                        </div>
                    ) : (
                        <>
                            {notifications.map((notification: Notification) => {
                                const Icon = notificationIcons[notification.type] || Info;
                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleOpenNotification(notification)}
                                        className={`p-6 rounded-[22px] border transition-all cursor-pointer flex items-start gap-5 ${
                                            notification.isRead 
                                            ? "bg-white dark:bg-gray-900 border-[#F2F2F2] dark:border-gray-800" 
                                            : "bg-[#F2F7FF] border-[#D9E9FF] shadow-sm"
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[notification.type] || "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500"}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-[15px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat">
                                                    {notification.title || "Notification"}
                                                </h3>
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">
                                                    {format(new Date(notification.dateCreated), "MMM dd, hh:mm a")}
                                                </span>
                                            </div>
                                            <p className="text-[13px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                                {notification.message}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="w-2 h-2 bg-[#0095FF] rounded-full mt-2"></div>
                                        )}
                                    </div>
                                );
                            })}

                            {notifications.length === 0 && (
                                <div className="py-20 text-center flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-300">
                                        <Bell size={40} />
                                    </div>
                                    <p className="text-gray-400 dark:text-gray-500 font-bold">No notifications yet.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Footer />

            <NotificationDetailModal
                isOpen={!!selectedNotification}
                onClose={() => setSelectedNotification(null)}
                notification={selectedNotification}
            />
        </main>
    );
}
