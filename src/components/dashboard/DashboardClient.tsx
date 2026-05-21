"use client";

import KYCBanner from "./KYCBanner";
import DashboardSearch from "./DashboardSearch";
import PropertyCard from "@/components/home/PropertyCard";
import DashboardSearchIcon from "@/components/icons/DashboardSearchIcon";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import { useUserRole } from "@/context/UserRoleContext";
import { useSearchParams } from "next/navigation";
import { useProperty } from "@/hooks/useProperty";
import { Loader2 } from "lucide-react";

export default function DashboardClient({ allProperties }: { allProperties: any[] }) {
    const { role } = useUserRole();
    const searchParams = useSearchParams();
    const { useTrendingProperties, useNewProperties, useAllProperties } = useProperty();

    const kycStatus = searchParams.get("kyc");
    const searchQuery = searchParams.get("q") || "";
    const isKycSubmitted = kycStatus === "submitted";

    // Real API Hooks
    const { data: trendingResponse, isLoading: isLoadingTrending } = useTrendingProperties(3);
    const { data: newResponse, isLoading: isLoadingNew } = useNewProperties(6);
    const { data: searchResponse, isLoading: isLoadingSearch } = useAllProperties({ search: searchQuery });

    const trendingProperties = trendingResponse?.data || [];
    const newProperties = newResponse?.data || [];
    const searchResults = searchResponse?.data?.items || [];

    if (role === "Owner" && !searchQuery) {
        return <OwnerDashboard />;
    }

    const isLoading = isLoadingTrending || isLoadingNew || (searchQuery && isLoadingSearch);

    return (
        <>
            {/* KYC Notification */}
            {!isKycSubmitted && !searchQuery && <KYCBanner />}

            {/* Search & Filter */}
            <DashboardSearch />

            {isLoading ? (
                <div className="py-20 flex justify-center items-center">
                    <Loader2 className="animate-spin text-primary-dark w-12 h-12" />
                </div>
            ) : searchQuery ? (
                /* Search Results View */
                <section className="w-full">
                    <div className="mb-8">
                        <h2 className="text-[20px] font-medium text-[#1A1A1A] font-montserrat">
                            Showing result for <span className="text-[#0095FF] font-black">"{searchQuery}"</span>
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
                            <h3 className="text-[17px] font-bold text-[#1A1A1A]">No result found</h3>
                        </div>
                    )}
                </section>
            ) : (
                /* Default Sections View */
                <>
                    {/* New Properties Section */}
                    <section className="mb-14 w-full">
                        <h2 className="text-2xl font-black text-[#1A1A1A] mb-8 font-montserrat">New Properties</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {(newProperties.length > 0 ? newProperties : allProperties.slice(0, 6)).map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    </section>

                    {/* Trending Properties Section */}
                    <section className="mb-14 w-full">
                        <h2 className="text-2xl font-black text-[#1A1A1A] mb-8 font-montserrat">Trending Properties</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {(trendingProperties.length > 0 ? trendingProperties : allProperties.slice(0, 3)).map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    </section>
                </>
            )}
        </>
    );
}
