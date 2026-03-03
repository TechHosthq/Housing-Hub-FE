"use client";

import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/profile/AccountSidebar";
import ProfileForm from "@/components/profile/ProfileForm";
import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

export default function MyAccountPage() {
    const [isVerified, setIsVerified] = useState(true); // Toggle logic for demo
    return (
        <main className="min-h-screen bg-[#FAFAFA]">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <h1 className="text-[28px] font-black text-[#1A1A1A] font-montserrat mb-8">
                    My Account
                </h1>

                {/* KYC Banner */}
                <div className="bg-white rounded-[16px] border border-[#E9F3FF] p-6 mb-10 flex items-center justify-between shadow-sm relative overflow-hidden transition-all duration-500">
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-[18px] font-black font-montserrat text-[#1A1A1A]">
                                    KYC Verified
                                </h2>
                                <div className="w-5 h-5 bg-[#00C853] rounded-full flex items-center justify-center text-white">
                                    <Check size={12} strokeWidth={4} />
                                </div>
                            </div>
                            <p className="text-[12px] text-[#666666] font-medium">
                                Your identity has been verified. You can now request property inspections.
                            </p>
                        </div>
                    </div>

                    <button className="relative z-10 px-8 py-3 rounded-full border border-[#0095FF] text-[#0095FF] text-[13px] font-bold hover:bg-[#0095FF]/5 transition-all active:scale-95 shadow-sm">
                        View KYC Document
                    </button>

                    {/* Background decoration - subtle gradient or element */}
                    <div className="absolute top-0 right-0 w-32 h-full bg-[#E9F3FF]/10 skew-x-[15deg] translate-x-16" />
                </div>

                {/* Content area */}
                <div className="flex gap-8 items-start">
                    <AccountSidebar />
                    <ProfileForm />
                </div>
            </div>

            <Footer />
        </main>
    );
}
