"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import UserDropdown from "./UserDropdown";
import { useUserRole } from "@/context/UserRoleContext";
import { useNotification } from "@/hooks/useNotification";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { role } = useUserRole();
    const currentUser = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const { useUnreadCount } = useNotification();
    const { data: unreadCountResponse } = useUnreadCount();
    const unreadCount = unreadCountResponse?.data || 0;

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    const handleLogout = () => {
        clearAuth();
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
        router.push("/login");
    };

    const navLinks = [
        { name: "Dashboard", href: "/dashboard" },
        ...(role === "Owner" ? [{ name: "Property", href: "/properties" }] : []),
        { name: "Inspection", href: "/inspections" },
        { name: "Message", href: "/messages" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 px-6 md:px-8 py-3.5 flex items-center justify-between shadow-sm border-b border-gray-50">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <Image
                        src="/images/logo.png"
                        alt="Housing Hub Logo"
                        width={180}
                        height={45}
                        className="w-auto h-9 md:h-10 object-contain"
                        priority
                    />
                </Link>

                {/* Main Links */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${isActive(link.href) ? "text-[#0095FF]" : "text-[#1A1A1A] dark:text-gray-100"} font-bold text-sm hover:text-[#0095FF] transition-colors`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side: Notifications & Profile, or Login/Register when signed out */}
                <div className="hidden md:flex items-center gap-6">
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={() => router.push("/notifications")}
                                className="relative text-[#1A1A1A] dark:text-gray-100 hover:text-[#0095FF] transition-colors"
                            >
                                <Bell size={24} strokeWidth={1.5} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            <div className="relative">
                                <div
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 pl-6 border-l border-gray-100 dark:border-gray-800 cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-[#E9F3FF] flex items-center justify-center text-[#002B7F] font-black text-[14px] uppercase">
                                            {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0] || "U"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-black text-[#1A1A1A] dark:text-gray-100">
                                            {currentUser?.firstName} {currentUser?.lastName || "User"}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[11px] text-gray-400 dark:text-gray-500 font-bold transition-colors group-hover:text-[#0095FF]">{role}</span>
                                            <ChevronDown
                                                size={14}
                                                className={`text-gray-400 dark:text-gray-500 transition-all duration-300 group-hover:text-[#0095FF] ${isDropdownOpen ? "rotate-180" : ""}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <UserDropdown
                                    isOpen={isDropdownOpen}
                                    onClose={() => setIsDropdownOpen(false)}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-primary-dark font-bold text-base hover:opacity-80 transition-opacity"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-[#07358B] text-white px-7 py-2.5 rounded-full font-bold text-base hover:bg-primary-dark/90 transition-all"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-primary-dark p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg md:hidden flex flex-col p-6 gap-6 font-bold border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top duration-200">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${isActive(link.href) ? "text-[#0095FF]" : "text-[#1A1A1A] dark:text-gray-100"} hover:text-[#0095FF] transition-colors`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="flex flex-col gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-3 pb-2">
                                        <div className="w-10 h-10 rounded-full bg-[#E9F3FF] flex items-center justify-center text-[#002B7F] font-black text-[14px] uppercase">
                                            {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0] || "U"}
                                        </div>
                                        <div className="flex flex-col leading-none">
                                            <span className="text-[14px] font-black text-[#1A1A1A] dark:text-gray-100">
                                                {currentUser?.firstName} {currentUser?.lastName || "User"}
                                            </span>
                                            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">{role}</span>
                                        </div>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="text-[#1A1A1A] dark:text-gray-100 font-bold text-base"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => { router.push("/notifications"); setIsMenuOpen(false); }}
                                        className="text-[#1A1A1A] dark:text-gray-100 font-bold text-base flex items-center gap-2 text-left"
                                    >
                                        Notifications
                                        {unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                                {unreadCount > 9 ? "9+" : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    <Link
                                        href="/settings"
                                        className="text-[#1A1A1A] dark:text-gray-100 font-bold text-base"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-500 font-bold text-base text-left"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-primary-dark font-bold text-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-[#07358B] text-white px-6 py-3 rounded-full font-bold text-center text-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
