"use client";

import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/profile/AccountSidebar";
import ProfileForm from "@/components/profile/ProfileForm";
import Link from "next/link";
import { Check, Clock, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCustomer } from "@/hooks/useCustomer";

export default function MyAccountPage() {
    const user = useAuthStore((state) => state.user);
    const { useGetCustomer } = useCustomer();
    const { data: customerResponse, isLoading } = useGetCustomer(user?.id || null);

    const customer = customerResponse?.data;
    // Derive real KYC state from the same source the dashboard uses, instead of a
    // hardcoded "verified" demo value that disagreed with the dashboard banner.
    const status: "verified" | "pending" | "none" = customer?.isKycVerified
        ? "verified"
        : customer?.kycSubmittedAt
            ? "pending"
            : "none";

    const banner = {
        verified: {
            title: "KYC Verified",
            body: "Your identity has been verified. You can now request property inspections.",
            icon: <Check size={12} strokeWidth={4} />,
            iconBg: "bg-[#00C853]",
        },
        pending: {
            title: "KYC Under Review",
            body: "We've received your documents. Verification usually completes within 24–48 hours.",
            icon: <Clock size={12} strokeWidth={3} />,
            iconBg: "bg-[#F5A623]",
        },
        none: {
            title: "Complete your KYC",
            body: "Verify your identity to request property inspections and list properties.",
            icon: <ShieldAlert size={12} strokeWidth={3} />,
            iconBg: "bg-[#0095FF]",
        },
    }[status];

    return (
        <main className="min-h-screen bg-[#FAFAFA]">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <h1 className="text-[28px] font-black text-[#1A1A1A] font-montserrat mb-8">
                    My Account
                </h1>

                {/* KYC status — reflects the real account state */}
                {!isLoading && (
                    <div className="bg-white rounded-[16px] border border-[#E9F3FF] p-6 mb-10 flex items-center justify-between shadow-sm relative overflow-hidden transition-all duration-500">
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-[18px] font-black font-montserrat text-[#1A1A1A]">
                                        {banner.title}
                                    </h2>
                                    <div className={`w-5 h-5 ${banner.iconBg} rounded-full flex items-center justify-center text-white`}>
                                        {banner.icon}
                                    </div>
                                </div>
                                <p className="text-[12px] text-[#666666] font-medium">{banner.body}</p>
                            </div>
                        </div>

                        {status === "verified" && customer?.idDocumentUrl ? (
                            <a
                                href={customer.idDocumentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative z-10 px-8 py-3 rounded-full border border-[#0095FF] text-[#0095FF] text-[13px] font-bold hover:bg-[#0095FF]/5 transition-all active:scale-95 shadow-sm"
                            >
                                View KYC Document
                            </a>
                        ) : status === "none" ? (
                            <Link
                                href="/kyc/personal-info"
                                className="relative z-10 px-8 py-3 rounded-full bg-[#0095FF] text-white text-[13px] font-bold hover:bg-[#0095FF]/90 transition-all active:scale-95 shadow-sm"
                            >
                                Complete KYC
                            </Link>
                        ) : null}

                        <div className="absolute top-0 right-0 w-32 h-full bg-[#E9F3FF]/10 skew-x-[15deg] translate-x-16" />
                    </div>
                )}

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
