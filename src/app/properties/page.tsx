"use client";

import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import ListPropertyBanner from "@/components/properties/ListPropertyBanner";
import PropertyEmptyState from "@/components/properties/PropertyEmptyState";
import OwnerPropertyCard from "@/components/properties/OwnerPropertyCard";
import { useUserRole } from "@/context/UserRoleContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MOCK_PROPERTIES = [
    {
        id: "1",
        title: "Javeele House",
        price: "100Million",
        location: "Ikeja, Lagos",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
        views: 234,
        requests: 3
    },
    {
        id: "2",
        title: "Aliart House",
        price: "350,000",
        location: "Allira Street, Ikeja, Lagos",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
        views: 45,
        requests: 1
    }
];

export default function OwnerPropertiesPage() {
    const { role } = useUserRole();
    const router = useRouter();
    const [properties, setProperties] = useState(MOCK_PROPERTIES);

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
                <ListPropertyBanner />

                {properties.length === 0 ? (
                    <PropertyEmptyState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {properties.map((property) => (
                            <OwnerPropertyCard key={property.id} {...property} />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
