"use client";

import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { useProperty } from "@/hooks/useProperty";
import { Loader2, MapPin, Navigation } from "lucide-react";

const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-900 rounded-[22px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full animate-pulse">
        <div className="m-2">
            <div className="relative h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-[16px]" />
        </div>
        <div className="p-7 flex flex-col flex-1">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8" />
            <div className="mt-auto flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl w-24" />
                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl w-24" />
            </div>
        </div>
    </div>
);

// Lekki, Lagos fallback for when geolocation is denied/unavailable.
const DEFAULT_LAT = 6.4698;
const DEFAULT_LNG = 3.5852;

type GeoStatus = "pending" | "granted" | "denied" | "unsupported";

export default function NearbyGrid() {
    const { useNearbyProperties } = useProperty();
    const [count, setCount] = useState(20);
    const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
    const [geoStatus, setGeoStatus] = useState<GeoStatus>("pending");

    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoStatus("unsupported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
                setGeoStatus("granted");
            },
            () => setGeoStatus("denied"),
            { timeout: 8000, maximumAge: 300000 }
        );
    }, []);

    const { data: response, isLoading, isFetching, isError } = useNearbyProperties(coords.lat, coords.lng, 10, count);

    const properties = response?.data || [];
    const showLoading = geoStatus === "pending" || isLoading;

    const handleLoadMore = () => {
        setCount(prev => prev + 20);
    };

    if (showLoading) {
        return (
            <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-extrabold text-[#1A1A1A] dark:text-gray-100 tracking-tight">Properties near you</h2>
                    <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-full w-32 animate-pulse" />
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
                <h2 className="text-3xl font-extrabold text-[#1A1A1A] dark:text-gray-100 tracking-tight">Properties near you</h2>
                <div className="flex items-center gap-2 text-[#0095FF] font-bold text-sm bg-[#0095FF]/5 px-5 py-2.5 rounded-full border border-[#0095FF]/10">
                    {geoStatus === "granted" ? (
                        <Navigation size={16} fill="currentColor" />
                    ) : (
                        <MapPin size={16} />
                    )}
                    <span>{geoStatus === "granted" ? "Your location" : "Lekki, Lagos"}</span>
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
                        className="bg-white dark:bg-gray-900 text-[#0B2545] border-2 border-[#0B2545] px-12 py-4 rounded-full font-black text-lg hover:bg-[#0B2545] hover:text-white transition-all hover:shadow-2xl disabled:opacity-50 flex items-center gap-3 group active:scale-95"
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
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <p className="text-gray-400 dark:text-gray-500 text-xl font-medium">No properties found in your area yet.</p>
                </div>
            )}
        </section>
    );
}
