"use client";

import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import AddPropertyForm from "@/components/properties/AddPropertyForm";
import { useUserRole } from "@/context/UserRoleContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AddPropertyPage() {
    const { role } = useUserRole();
    const router = useRouter();

    // Protective check - Only Owners should see this page
    useEffect(() => {
        if (role === "Customer") {
            router.push("/dashboard");
        }
    }, [role, router]);

    if (role === "Customer") return null;

    return (
        <main className="min-h-screen bg-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-24">
                <AddPropertyForm />
            </div>

            <Footer />
        </main>
    );
}
