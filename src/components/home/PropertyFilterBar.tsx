"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { NIGERIAN_STATES } from "@/lib/nigerianStates";

const FILTER_OPTIONS = {
    location: NIGERIAN_STATES,
    propertyType: ["House", "Apartment", "Guesthouse", "Flat", "Duplex"],
    priceRange: ["Under ₦1M", "₦1M - ₦5M", "₦5M - ₦20M", "₦20M - ₦50M", "₦50M+"],
};

const PRICE_RANGE_PARAM: Record<string, { minPrice?: number; maxPrice?: number }> = {
    "Under ₦1M": { minPrice: 0, maxPrice: 1_000_000 },
    "₦1M - ₦5M": { minPrice: 1_000_000, maxPrice: 5_000_000 },
    "₦5M - ₦20M": { minPrice: 5_000_000, maxPrice: 20_000_000 },
    "₦20M - ₦50M": { minPrice: 20_000_000, maxPrice: 50_000_000 },
    "₦50M+": { minPrice: 50_000_000 },
};

// Shared by the homepage hero and the dashboard — selecting a dropdown option
// navigates immediately to /dashboard with the matching filter params (no
// separate search button), so anonymous and signed-in users get the exact
// same filtering experience.
export default function PropertyFilterBar() {
    const router = useRouter();
    const [activeDropdown, setActiveDropdown] = useState<keyof typeof FILTER_OPTIONS | null>(null);
    const [filters, setFilters] = useState({
        location: "",
        propertyType: "",
        priceRange: "",
    });
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside the whole filter bar. (Both the
    // mobile and desktop layouts below are always mounted — only CSS-hidden
    // via md: classes — so a ref scoped to "the active dropdown" would bind
    // to whichever layout's node commits last, not necessarily the visible
    // one; scoping to the outer container avoids that.)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (dropdown: keyof typeof FILTER_OPTIONS) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const navigateWithFilters = (updated: typeof filters) => {
        const params = new URLSearchParams();

        if (updated.propertyType) params.set('propertyType', updated.propertyType);

        const price = updated.priceRange ? PRICE_RANGE_PARAM[updated.priceRange] : undefined;
        if (price?.minPrice != null) params.set('minPrice', String(price.minPrice));
        if (price?.maxPrice != null) params.set('maxPrice', String(price.maxPrice));

        if (updated.location) params.set('state', updated.location);

        const query = params.toString();
        router.push(query ? `/dashboard?${query}` : '/dashboard');
    };

    const handleSelect = (dropdown: keyof typeof FILTER_OPTIONS, value: string) => {
        const updated = { ...filters, [dropdown]: value };
        setFilters(updated);
        setActiveDropdown(null);
        navigateWithFilters(updated);
    };

    const renderDropdown = (key: keyof typeof FILTER_OPTIONS, label: string) => (
        <div className="flex-1 relative">
            <div
                className={`px-4 py-3 flex items-center justify-between cursor-pointer rounded-full transition-all group ${activeDropdown === key ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                onClick={() => toggleDropdown(key)}
            >
                <span className={`text-[15px] truncate w-full text-left ${filters[key] ? 'font-semibold text-[#1A1A1A] dark:text-gray-100' : 'font-medium text-gray-500 dark:text-gray-500'}`}>
                    {filters[key] || label}
                </span>
                <ChevronDown size={16} className={`text-gray-400 dark:text-gray-500 transition-transform duration-300 flex-shrink-0 ml-2 ${activeDropdown === key ? 'rotate-180 text-[#0B2545]' : 'group-hover:text-gray-600'}`} />
            </div>

            {/* Dropdown Menu */}
            {activeDropdown === key && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] max-h-[280px] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {FILTER_OPTIONS[key].map((option) => (
                        <div
                            key={option}
                            className={`px-5 py-3 text-[14px] font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center ${filters[key] === option ? 'text-[#0095FF] bg-blue-50/50' : 'text-gray-600 dark:text-gray-400'}`}
                            onClick={() => handleSelect(key, option)}
                        >
                            {option}
                        </div>
                    ))}
                    {filters[key] && (
                        <div
                            className="px-5 py-2 mt-1 text-[12px] font-bold text-red-500 hover:bg-red-50 cursor-pointer border-t border-gray-50"
                            onClick={(e) => { e.stopPropagation(); handleSelect(key, ""); }}
                        >
                            Clear Selection
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div ref={containerRef} className="bg-white dark:bg-gray-900 shadow-2xl max-w-5xl mx-auto relative rounded-3xl md:rounded-full p-3 md:p-2.5 overflow-visible">
            {/* Mobile: 3-row list of filters */}
            <div className="flex flex-col md:hidden divide-y divide-gray-100 rounded-2xl border border-gray-100 mb-3">
                {(['location', 'propertyType', 'priceRange'] as const).map((key) => {
                    const labels: Record<string, string> = {
                        location: 'Location',
                        propertyType: 'Property Type',
                        priceRange: 'Price Range',
                    };
                    return (
                        <div key={key} className="relative">
                            <div
                                className={`px-3 py-3 flex items-center justify-between cursor-pointer transition-all ${activeDropdown === key ? 'bg-gray-50 dark:bg-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                                onClick={() => toggleDropdown(key)}
                            >
                                <span className={`text-[13px] truncate w-full text-left ${filters[key] ? 'font-semibold text-[#1A1A1A] dark:text-gray-100' : 'font-medium text-gray-500 dark:text-gray-500'}`}>
                                    {filters[key] || labels[key]}
                                </span>
                                <ChevronDown size={14} className={`text-gray-400 dark:text-gray-500 transition-transform duration-300 flex-shrink-0 ml-1 ${activeDropdown === key ? 'rotate-180 text-[#0B2545]' : ''}`} />
                            </div>
                            {activeDropdown === key && (
                                <div className="absolute top-[calc(100%+4px)] left-0 w-[160px] max-h-[240px] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-800 py-2 z-[200]">
                                    {FILTER_OPTIONS[key].map((option) => (
                                        <div
                                            key={option}
                                            className={`px-4 py-2.5 text-[13px] font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${filters[key] === option ? 'text-[#0095FF] bg-blue-50/50' : 'text-gray-600 dark:text-gray-400'}`}
                                            onClick={() => handleSelect(key, option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                    {filters[key] && (
                                        <div
                                            className="px-4 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 cursor-pointer border-t border-gray-50"
                                            onClick={(e) => { e.stopPropagation(); handleSelect(key, ''); }}
                                        >
                                            Clear
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Desktop: filters fill the pill, no separate search button — selecting a filter navigates immediately */}
            <div className="hidden md:flex flex-row items-center w-full">
                <div className="flex flex-1 items-center min-w-0">
                    {renderDropdown('location', 'Location')}
                    <div className="w-[1px] h-10 bg-gray-200 dark:bg-gray-700 mx-1 flex-shrink-0"></div>
                    {renderDropdown('propertyType', 'Property Type')}
                    <div className="w-[1px] h-10 bg-gray-200 dark:bg-gray-700 mx-1 flex-shrink-0"></div>
                    {renderDropdown('priceRange', 'Price Range')}
                </div>
                <div className="bg-[#0B2545] text-white px-6 py-4 rounded-full flex items-center justify-center gap-2 m-1 flex-shrink-0">
                    <Search size={18} className="stroke-[3px]" />
                </div>
            </div>
        </div>
    );
}
