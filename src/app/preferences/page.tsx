"use client";

import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import { usePropertyAlert } from "@/hooks/usePropertyAlert";
import { PropertyType } from "@/types/property";
import { Loader2, BellRing, Trash2 } from "lucide-react";

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
    [PropertyType.Apartment]: "Apartment",
    [PropertyType.House]: "House",
    [PropertyType.Land]: "Land",
    [PropertyType.Duplex]: "Duplex",
    [PropertyType.Bungalow]: "Bungalow",
};

export default function PreferencesPage() {
    const { useMyPreferences, deletePreference, isDeletingPreference } = usePropertyAlert();
    const { data: preferencesResponse, isLoading } = useMyPreferences();

    const preferences = preferencesResponse?.data || [];

    const describePreference = (p: (typeof preferences)[number]) => {
        const parts: string[] = [];
        if (p.propertyType) parts.push(PROPERTY_TYPE_LABELS[p.propertyType] || "Any type");
        if (p.city) parts.push(p.city);
        if (p.state) parts.push(p.state);
        if (p.minPrice || p.maxPrice) {
            const min = p.minPrice ? `₦${p.minPrice.toLocaleString()}` : "Any";
            const max = p.maxPrice ? `₦${p.maxPrice.toLocaleString()}` : "Any";
            parts.push(`${min} - ${max}`);
        }
        return parts.length > 0 ? parts.join(" · ") : "Any property";
    };

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <DashboardNavbar />

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <div className="mb-10">
                    <h1 className="text-[28px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-2">
                        Saved Searches
                    </h1>
                    <p className="text-gray-400 dark:text-gray-500 font-bold">
                        Get notified when a new listing matches one of these searches.
                    </p>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="animate-spin text-primary-dark w-10 h-10" />
                        </div>
                    ) : preferences.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-300">
                                <BellRing size={40} />
                            </div>
                            <p className="text-gray-400 dark:text-gray-500 font-bold max-w-sm">
                                No saved searches yet. Search for properties on your dashboard and tap "Get Alerts For This Search" to save one.
                            </p>
                        </div>
                    ) : (
                        preferences.map((preference) => (
                            <div
                                key={preference.id}
                                className="p-6 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                                        <BellRing size={20} />
                                    </div>
                                    <p className="text-[14px] font-bold text-[#1A1A1A] dark:text-gray-100 truncate">
                                        {describePreference(preference)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => deletePreference(preference.id)}
                                    disabled={isDeletingPreference}
                                    className="p-2.5 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 flex-shrink-0"
                                    title="Delete saved search"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
