"use client";

import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/profile/AccountSidebar";
import PaymentHistory from "@/components/payments/PaymentHistory";

export default function PaymentsPage() {
    return (
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <h1 className="text-[28px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-8">
                    My Account
                </h1>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <AccountSidebar />
                    <PaymentHistory />
                </div>
            </div>

            <Footer />
        </main>
    );
}
