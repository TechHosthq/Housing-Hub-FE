"use client";

import KYCBanner from "./KYCBanner";
import PropertyFilterBar from "@/components/home/PropertyFilterBar";
import PropertyCard from "@/components/home/PropertyCard";
import TrendingGrid from "@/components/home/TrendingGrid";
import NearbyGrid from "@/components/home/NearbyGrid";
import DashboardSearchIcon from "@/components/icons/DashboardSearchIcon";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import { useUserRole } from "@/context/UserRoleContext";
import { useAuthStore } from "@/store/useAuthStore";
import { useSearchParams } from "next/navigation";
import { useProperty } from "@/hooks/useProperty";
import { Loader2 } from "lucide-react";

export default function DashboardClient() {
    const { role } = useUserRole();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const searchParams = useSearchParams();
    const { useAllProperties } = useProperty();

    const kycStatus = searchParams.get("kyc");
    const searchQuery = searchParams.get("q") || "";
    const propertyType = searchParams.get("propertyType") || undefined;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const city = searchParams.get("city") || undefined;
    const state = searchParams.get("state") || undefined;
    const isKycSubmitted = kycStatus === "submitted";
    const hasFilters = Boolean(searchQuery || propertyType || minPrice || maxPrice || city || state);

    // Real API Hooks
    const { data: searchResponse, isLoading: isLoadingSearch } = useAllProperties({
        search: searchQuery,
        propertyType,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        city,
        state,
    });

    const searchResults = searchResponse?.data?.items || [];

    if (role === "Owner" && !hasFilters) {
        return <OwnerDashboard />;
    }

    return (
        <>
            {/* KYC Notification */}
            {isAuthenticated && !isKycSubmitted && !hasFilters && <KYCBanner />}

            {/* Search & Filter — same component as the homepage hero, signed in or not */}
            <div className="mb-10">
                <PropertyFilterBar />
            </div>

            {hasFilters ? (
                isLoadingSearch ? (
                    <div className="py-20 flex justify-center items-center">
                        <Loader2 className="animate-spin text-primary-dark w-12 h-12" />
                    </div>
                ) : (
                    /* Search Results View */
                    <section className="w-full">
                        <div className="mb-8">
                            <h2 className="text-[20px] font-medium text-[#1A1A1A] dark:text-gray-100 font-montserrat">
                                {searchQuery ? (
                                    <>Showing result for <span className="text-[#0095FF] font-black">"{searchQuery}"</span></>
                                ) : (
                                    "Showing filtered results"
                                )}
                            </h2>
                        </div>
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                {searchResults.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-full bg-[#E9F3FF] flex items-center justify-center mb-6 shadow-sm">
                                    <DashboardSearchIcon />
                                </div>
                                <h3 className="text-[17px] font-bold text-[#1A1A1A] dark:text-gray-100">No result found</h3>
                            </div>
                        )}
                    </section>
                )
            ) : (
                /* Default view — same order as the anonymous homepage: trending first, then nearby */
                <>
                    <TrendingGrid />
                    <NearbyGrid />
                </>
            )}
        </>
    );
}
