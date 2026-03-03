"use client";

import KYCBanner from "./KYCBanner";
import DashboardSearch from "./DashboardSearch";
import PropertyCard from "@/components/home/PropertyCard";
import DashboardSearchIcon from "@/components/icons/DashboardSearchIcon"; // I'll create this to clean up the page component
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import { useUserRole } from "@/context/UserRoleContext";
import { useSearchParams } from "next/navigation";

export default function DashboardClient({ allProperties }: { allProperties: any[] }) {
    const { role } = useUserRole();
    const searchParams = useSearchParams();

    const kycStatus = searchParams.get("kyc");
    const searchQuery = searchParams.get("q") || "";
    const isKycSubmitted = kycStatus === "submitted";

    // Search logic (migrated from page.tsx)
    const filteredProperties = searchQuery
        ? allProperties.filter(property => {
            const query = searchQuery.toLowerCase();
            const titleMatch = property.title.toLowerCase().includes(query);
            const locationMatch = property.location.toLowerCase().includes(query);
            const bedMatch = query.includes('bed') && query.match(/\d+/)?.some(num => property.bedrooms === parseInt(num));
            const bathMatch = query.includes('bath') && query.match(/\d+/)?.some(num => property.bathrooms === parseInt(num));
            const numericMatch = !isNaN(parseInt(query)) && (property.bedrooms === parseInt(query) || property.bathrooms === parseInt(query));
            return titleMatch || locationMatch || bedMatch || bathMatch || (query.length === 1 && numericMatch);
        })
        : [];

    const nearMeProperties = allProperties.filter(p => p.tag === "Near Me");
    const trendingProperties = allProperties.filter(p => p.tag === "Trending").slice(0, 3);
    const newProperties = allProperties.filter(p => !p.tag || p.tag === "New" || p.tag === "Trending").slice(0, 6);

    if (role === "Owner" && !searchQuery) {
        return <OwnerDashboard />;
    }

    return (
        <>
            {/* KYC Notification - Hidden if submitted */}
            {!isKycSubmitted && !searchQuery && <KYCBanner />}

            {/* Search & Filter */}
            <DashboardSearch />

            {searchQuery ? (
                /* Search Results View */
                <section className="w-full">
                    <div className="mb-8">
                        <h2 className="text-[20px] font-medium text-[#1A1A1A] font-montserrat">
                            Showing result for <span className="text-[#0095FF] font-black">"{searchQuery}"</span>
                        </h2>
                    </div>
                    {filteredProperties.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredProperties.map((property) => (
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
                            {newProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    </section>

                    {/* Trending Properties Section */}
                    <section className="mb-14 w-full">
                        <h2 className="text-2xl font-black text-[#1A1A1A] mb-8 font-montserrat">Trending Properties</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {trendingProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    </section>

                    {/* Properties Near Me Section - Only if KYC submitted */}
                    {isKycSubmitted && (
                        <section className="w-full">
                            <h2 className="text-2xl font-black text-[#1A1A1A] mb-8 font-montserrat">Properties Near Me</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                {nearMeProperties.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </>
    );
}
