"use client";

import { User, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { label: "Profile Info", icon: User, href: "/profile" },
        { label: "Message", icon: MessageCircle, href: "/messages" },
        { label: "Settings", icon: Settings, href: "/settings" }
    ];

    return (
        <div className="w-[280px] bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 p-6 h-fit h-fit shadow-sm">
            <div className="flex flex-col gap-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-4 px-6 py-4 rounded-full transition-all group ${isActive
                                ? "bg-primary-dark text-white shadow-md"
                                : "text-[#666666] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-primary-dark"
                                }`}
                        >
                            <item.icon size={20} className={isActive ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-primary-dark"} />
                            <span className="text-[14px] font-bold">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
