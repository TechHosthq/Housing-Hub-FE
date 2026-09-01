"use client";

import { useState } from "react";
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
import { usePropertyAlert } from "@/hooks/usePropertyAlert";
import { PropertyType } from "@/types/property";
import { Loader2, BellRing, Check } from "lucide-react";

export default function DashboardClient() {
    const { role } = useUserRole();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const searchParams = useSearchParams();
    const { useAllProperties } = useProperty();
    const { createPreference, isCreatingPreference } = usePropertyAlert();
    const [searchSaved, setSearchSaved] = useState(false);

    const kycStatus = searchParams.get("kyc");
    const searchQuery = searchParams.get("q") || "";
    const propertyType = searchParams.get("propertyType") || undefined;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const city = searchParams.get("city") || undefined;
    const state = searchParams.get("state") || undefined;
    const bedrooms = searchParams.get("bedrooms");
    const isKycSubmitted = kycStatus === "submitted";
    const hasFilters = Boolean(searchQuery || propertyType || minPrice || maxPrice || city || state || bedrooms);

    const handleSaveSearch = () => {
        createPreference({
            propertyType: propertyType as PropertyType | undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            city,
            state,
        }, {
            onSuccess: () => setSearchSaved(true)
        });
    };

    // Real API Hooks
    const { data: searchResponse, isLoading: isLoadingSearch } = useAllProperties({
        search: searchQuery,
        propertyType,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        city,
        state,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
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
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h2 className="text-[20px] font-medium text-[#1A1A1A] dark:text-gray-100 font-montserrat">
                                {searchQuery ? (
                                    <>Showing result for <span className="text-[#0095FF] font-black">&ldquo;{searchQuery}&rdquo;</span></>
                                ) : (
                                    "Showing filtered results"
                                )}
                            </h2>
                            {isAuthenticated && (propertyType || minPrice || maxPrice || city || state || bedrooms) && (
                                <button
                                    onClick={handleSaveSearch}
                                    disabled={isCreatingPreference || searchSaved}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary-dark text-primary-dark text-[13px] font-bold hover:bg-primary-dark/5 transition-all disabled:opacity-60 shrink-0 w-fit"
                                >
                                    {searchSaved ? <Check size={16} /> : <BellRing size={16} />}
                                    {searchSaved ? "Search Saved" : "Get Alerts For This Search"}
                                </button>
                            )}
                        </div>
                        {/*
                            Alert preferences carry property type, price, city, state and
                            features — there is no bedroom field on PropertyAlertPreference.
                            Saying so beats silently dropping the one criterion the renter
                            most likely cares about and then mailing them 1-bedroom flats.
                        */}
                        {isAuthenticated && bedrooms && (
                            <p className="mb-6 text-[12px] font-semibold text-gray-400 dark:text-gray-500">
                                Alerts don&apos;t cover bedroom count yet — a saved search will notify you
                                about matching listings with any number of bedrooms.
                            </p>
                        )}
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
