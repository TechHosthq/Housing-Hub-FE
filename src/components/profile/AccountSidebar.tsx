"use client";

import { User, MessageCircle, Settings, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole } from "@/context/UserRoleContext";

export default function AccountSidebar() {
    const pathname = usePathname();
    const { isOwner } = useUserRole();

    // /verification is business and property-title verification: a renter has no
    // business to verify and no listing to attach a title to, so the section is
    // empty for them. Their identity check lives under Profile.
    const menuItems = [
        { label: "Profile Info", icon: User, href: "/profile" },
        ...(isOwner ? [{ label: "Verification", icon: ShieldCheck, href: "/verification" }] : []),
        { label: "Message", icon: MessageCircle, href: "/messages" },
        { label: "Settings", icon: Settings, href: "/settings" }
    ];

    return (
        <div className="w-[280px] bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 p-6 h-fit h-fit shadow-sm">
            <div className="flex flex-col gap-2">
                {menuItems.map((item) => {
                    // Exact match everywhere except verification, which has child
                    // routes (/verification/{caseId}) that should keep the section lit.
                    const isActive = item.href === "/verification"
                        ? pathname.startsWith("/verification")
                        : pathname === item.href;
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
