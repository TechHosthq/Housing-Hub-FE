import { Suspense } from "react";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import propertiesData from "@/data/properties.json";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default function DashboardPage() {
    const allProperties = propertiesData.properties;

    return (
        <main className="min-h-screen bg-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-24 pb-20">
                <Suspense fallback={<div>Loading...</div>}>
                    <DashboardClient allProperties={allProperties} />
                </Suspense>
            </div>

            <Footer />
        </main>
    );
}
