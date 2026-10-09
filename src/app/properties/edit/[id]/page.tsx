"use client";

import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import AddPropertyForm from "@/components/properties/AddPropertyForm";
import VerifyPropertyPanel from "@/components/property/VerifyPropertyPanel";
import { useUserRole } from "@/context/UserRoleContext";
import { useProperty } from "@/hooks/useProperty";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

export default function EditPropertyPage() {
    const { role } = useUserRole();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const currentUser = useAuthStore((state) => state.user);

    // Shares the ['property', id] key with the form below, so this costs no extra
    // request — it is the same property, already being fetched.
    const { useGetProperty } = useProperty();
    const { data: propertyResponse } = useGetProperty(id);
    const property = propertyResponse?.data;

    // Protective check - Only Owners should see this page
    useEffect(() => {
        if (role === "Customer") {
            router.push("/dashboard");
        }
    }, [role, router]);

    if (role === "Customer") return null;

    // Reaching this page does not prove the listing is yours — the read is public,
    // so another owner can open it by id and only the save would fail. The panel
    // starts a verification case against this property, so it checks for itself.
    const isOwner = !!currentUser && !!property && currentUser.id === property.ownerId;

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-24">
                {/*
                    Above the form on purpose. This is where an owner lands from their
                    listings, so it is where "verify this property" has to be — the
                    public /property/[id] page carries the same panel, but an owner
                    managing their listings never passes through it.
                */}
                {isOwner && property && (
                    <VerifyPropertyPanel
                        propertyId={property.id}
                        verificationTier={property.listingVerificationTier}
                    />
                )}

                <AddPropertyForm editPropertyId={id} />
            </div>

            <Footer />
        </main>
    );
}
