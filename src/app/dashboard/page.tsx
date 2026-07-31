import { Suspense } from "react";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-24 pb-20">
                <Suspense fallback={<div>Loading...</div>}>
                    <DashboardClient />
                </Suspense>
            </div>

            <Footer />
        </main>
    );
}
