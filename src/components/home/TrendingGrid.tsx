"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
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

export default function TrendingGrid() {
    const { useInfiniteTrendingProperties } = useProperty();
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: "200px",
    });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = useInfiniteTrendingProperties(20);

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
                    className="mt-4 px-6 py-2 bg-[#002B7F] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                >
                    Retry
                </button>
            </section>
        );
    }

    const properties = data?.pages.flatMap(page => page.data) || [];

    return (
        <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-12 tracking-tight">Trending Properties</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.map((property, idx) => (
                    <PropertyCard key={`${property.id}-${idx}`} property={property} />
                ))}
            </div>

            {/* Intersection Observer Target */}
            <div ref={ref} className="h-40 flex items-center justify-center mt-10">
                {isFetchingNextPage ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-[#0095FF]" size={32} />
                        <span className="font-bold text-gray-400">Loading more amazing properties...</span>
                    </div>
                ) : hasNextPage ? (
                    <div className="h-1" /> // Spacer to trigger intersection
                ) : properties.length > 0 ? (
                    <div className="text-center py-10 opacity-50">
                        <p className="text-gray-400 font-bold text-lg italic">That's all for now! Check back later for more.</p>
                    </div>
                ) : null}
            </div>

            {properties.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-xl font-medium">No trending properties found at the moment.</p>
                </div>
            )}
        </section>
    );
}
