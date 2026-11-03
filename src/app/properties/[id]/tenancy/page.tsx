"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import ChooseTenantPanel from "@/components/tenancy/ChooseTenantPanel";
import { useProperty } from "@/hooks/useProperty";

/**
 * Who is taking this property.
 *
 * One screen for both states — nobody chosen yet, or somebody chosen — because
 * that is the single question an owner is asking when they open it. Splitting it
 * across two routes would mean knowing the answer before you could navigate to it.
 */
export default function PropertyTenancyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const { useGetProperty } = useProperty();
    const { data: propertyResponse, isLoading } = useGetProperty(id);
    const property = propertyResponse?.data;

    return (
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950">
            <DashboardNavbar />

            <div className="mx-auto max-w-4xl px-6 pt-32 pb-20">
                <Link
                    href="/properties"
                    className="mb-8 flex items-center gap-2 text-[11px] font-semibold text-[#6BB5FF] transition-colors hover:text-primary-dark"
                >
                    <ArrowLeft size={16} />
                    Back to my properties
                </Link>

                <h1 className="font-montserrat text-[26px] font-black text-[#1A1A1A] dark:text-gray-100">
                    Choose a tenant
                </h1>
                <p className="mt-1 text-[13px] font-medium text-gray-400 dark:text-gray-500">
                    {isLoading
                        ? "Loading…"
                        : property?.title ?? "This property"}
                </p>

                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="animate-spin text-[#0095FF]" size={28} />
                    </div>
                ) : (
                    <div className="mt-8">
                        <ChooseTenantPanel propertyId={id} />
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
