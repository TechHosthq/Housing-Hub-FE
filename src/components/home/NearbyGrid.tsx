"use client";

import { useState } from "react";
import PropertyCard from "./PropertyCard";
import { useProperty } from "@/hooks/useProperty";
import { Loader2, Navigation } from "lucide-react";

const SkeletonCard = () => (
    <div className="bg-white rounded-[22px] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
        <div className="m-2">
            <div className="relative h-64 w-full bg-gray-200 rounded-[16px]" />
        </div>
        <div className="p-7 flex flex-col flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="mt-auto flex items-center gap-3 pt-6 border-t border-gray-100">
                <div className="h-10 bg-gray-100 rounded-xl w-24" />
                <div className="h-10 bg-gray-100 rounded-xl w-24" />
            </div>
        </div>
    </div>
);

export default function NearbyGrid() {
    const { useNearbyProperties } = useProperty();
    const [count, setCount] = useState(20);
    
    // Default to Lagos coordinates (Lekki)
    const lat = 6.4698;
    const lng = 3.5852;

    const { data: response, isLoading, isFetching, isError } = useNearbyProperties(lat, lng, 10, count);

    const properties = response?.data || [];

    const handleLoadMore = () => {
        setCount(prev => prev + 20);
    };

    if (isLoading) {
        return (
            <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Properties near you</h2>
                    <div className="h-10 bg-gray-100 rounded-full w-32 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                </div>
            </section>
        );
    }

    if (isError) {
        return null;
    }

    return (
        <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Properties near you</h2>
                <div className="flex items-center gap-2 text-[#0095FF] font-bold text-sm bg-[#0095FF]/5 px-5 py-2.5 rounded-full border border-[#0095FF]/10">
                    <Navigation size={16} fill="currentColor" />
                    <span>Lekki, Lagos</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>

            {properties.length > 0 && (
                <div className="mt-20 flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isFetching}
                        className="bg-white text-[#002B7F] border-2 border-[#002B7F] px-12 py-4 rounded-full font-black text-lg hover:bg-[#002B7F] hover:text-white transition-all hover:shadow-2xl disabled:opacity-50 flex items-center gap-3 group active:scale-95"
                    >
                        {isFetching ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                Loading...
                            </>
                        ) : (
                            <>
                                Show more properties
                                <span className="group-hover:translate-y-1 transition-transform">↓</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {properties.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-xl font-medium">No properties found in your area yet.</p>
                </div>
            )}
        </section>
    );
}
