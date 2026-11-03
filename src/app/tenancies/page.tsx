"use client";

import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import TenancyList from "@/components/tenancy/TenancyList";

/**
 * A top-level section, not an account one.
 *
 * It used to sit behind the account sidebar next to Profile and Settings, which
 * filed the thing you are in the middle of doing under the things you set once.
 * It now matches Inspections: its own tab, its own page.
 */
export default function TenanciesPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <h1 className="text-[28px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-8">
                    My Tenancies
                </h1>

                <TenancyList />
            </div>

            <Footer />
        </main>
    );
}
