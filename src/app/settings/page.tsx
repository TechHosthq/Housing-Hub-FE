"use client";

import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/profile/AccountSidebar";
import SettingsForm from "@/components/profile/SettingsForm";

export default function SettingsPage() {
    return (
        <main className="min-h-screen bg-[#FAFAFA]">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <h1 className="text-[28px] font-black text-[#1A1A1A] font-montserrat mb-8">
                    My Account
                </h1>

                {/* Content area */}
                <div className="flex gap-8 items-start">
                    <AccountSidebar />
                    <SettingsForm />
                </div>
            </div>

            <Footer />
        </main>
    );
}
