"use client";

import { useState } from "react";
import PropertyCard from "./PropertyCard";
import { useProperty } from "@/hooks/useProperty";
import { Loader2 } from "lucide-react";

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

const ITEMS_PER_PAGE = 6;

export default function TrendingGrid() {
    const [currentPage, setCurrentPage] = useState(1);
    const { useInfiniteTrendingProperties } = useProperty();

    const {
        data,
        isLoading,
        isError
    } = useInfiniteTrendingProperties(60);

    if (isLoading) {
        return (
            <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-12 tracking-tight">Trending Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="py-20 text-center">
                <p className="text-red-500 font-bold text-xl">Failed to load trending properties.</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-6 py-2 bg-[#002B7F] text-white rounded-full font-bold hover:bg-[#001D4B] transition-all"
                >
                    Retry
                </button>
            </section>
        );
    }

    const allProperties = data?.pages.flatMap(page => page.data) || [];
    const totalPages = Math.ceil(allProperties.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const properties = allProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-12 tracking-tight">Trending Properties</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.map((property, idx) => (
                    <PropertyCard key={`${property.id}-${idx}`} property={property} />
                ))}
            </div>

            {allProperties.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-xl font-medium">No trending properties found at the moment.</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                                currentPage === page
                                    ? "bg-[#002D6B] text-white"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#002D6B] hover:text-[#002D6B]"
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
