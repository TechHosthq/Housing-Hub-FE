"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Browse Homes", href: "/dashboard" },
        { name: "List Properties", href: "/list-properties" },
        { name: "FAQ", href: "/faq" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white px-6 md:px-8 py-3.5 shadow-sm border-b border-gray-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
                <div className="flex items-center">
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
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-12 font-bold">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${pathname === link.href ? "text-[#0095FF]" : "text-[#1A1A1A]"
                                } hover:text-[#0095FF] transition-colors text-base`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth Links */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/login" className="text-[#002D6B] font-bold text-base hover:opacity-80 transition-opacity">
                        Login
                    </Link>
                    <Link href="/register" className="bg-[#002D6B] text-white px-7 py-2.5 rounded-[9px] font-bold text-base shadow-lg hover:bg-[#001D4B] transition-all">
                        Register
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-[#002D6B] p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden flex flex-col p-6 gap-6 font-bold border-t border-gray-100 animate-in slide-in-from-top duration-200">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${pathname === link.href ? "text-[#3b82f6]" : "text-[#1A1A1A]"
                                    } hover:text-[#003E92] transition-colors`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                            <Link
                                href="/login"
                                className="text-[#002D6B] font-bold text-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-[#002D6B] text-white px-6 py-3 rounded-full font-bold text-center text-lg shadow-md"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
