"use client";

import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import AddPropertyForm from "@/components/properties/AddPropertyForm";
import { useUserRole } from "@/context/UserRoleContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

export default function EditPropertyPage() {
    const { role } = useUserRole();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    // Protective check - Only Owners should see this page
    useEffect(() => {
        if (role === "Customer") {
            router.push("/dashboard");
        }
    }, [role, router]);

    if (role === "Customer") return null;

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-24">
                <AddPropertyForm editPropertyId={id} />
            </div>

            <Footer />
        </main>
    );
}
