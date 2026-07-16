"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const FILTER_OPTIONS = {
    location: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Enugu"],
    propertyType: ["House", "Apartment", "Guesthouse", "Flat", "Duplex"],
    priceRange: ["₦1M - ₦5M", "₦5M - ₦20M", "₦20M - ₦50M", "₦50M+"],
    bedrooms: ["1", "2", "3", "4", "5+"],
};

export default function Hero() {
    const router = useRouter();
    const [activeDropdown, setActiveDropdown] = useState<keyof typeof FILTER_OPTIONS | null>(null);
    const [filters, setFilters] = useState({
        location: "",
        propertyType: "",
        priceRange: "",
        bedrooms: "",
    });
    const [isSearching, setIsSearching] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (dropdown: keyof typeof FILTER_OPTIONS) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const handleSelect = (dropdown: keyof typeof FILTER_OPTIONS, value: string) => {
        setFilters(prev => ({ ...prev, [dropdown]: value }));
        setActiveDropdown(null);
    };

    const handleSearch = async () => {
        setIsSearching(true);
        // Mock API Call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Build search query
        const queryParams = new URLSearchParams();
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.propertyType) queryParams.append('type', filters.propertyType);
        if (filters.priceRange) queryParams.append('price', filters.priceRange);
        if (filters.bedrooms) queryParams.append('beds', filters.bedrooms);
        
        setIsSearching(false);
        // Redirect to a search results page (even if it doesn't fully exist yet, it's standard)
        router.push(`/search?${queryParams.toString()}`);
    };

    const renderDropdown = (key: keyof typeof FILTER_OPTIONS, label: string) => (
        <div className="flex-1 relative" ref={activeDropdown === key ? dropdownRef : null}>
            <div 
                className={`px-4 py-3 flex items-center justify-between cursor-pointer rounded-full transition-all group ${activeDropdown === key ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => toggleDropdown(key)}
            >
                <span className={`text-[15px] truncate w-full text-left ${filters[key] ? 'font-semibold text-[#1A1A1A]' : 'font-medium text-gray-500'}`}>
                    {filters[key] || label}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ml-2 ${activeDropdown === key ? 'rotate-180 text-[#002D6B]' : 'group-hover:text-gray-600'}`} />
            </div>

            {/* Dropdown Menu */}
            {activeDropdown === key && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {FILTER_OPTIONS[key].map((option) => (
                        <div
                            key={option}
                            className={`px-5 py-3 text-[14px] font-semibold cursor-pointer hover:bg-gray-50 transition-colors flex items-center ${filters[key] === option ? 'text-[#0095FF] bg-blue-50/50' : 'text-gray-600'}`}
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
        <section className="relative min-h-[480px] md:h-[500px] flex items-center justify-center pt-16 pb-6 md:pb-0">
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url("/images/hero-bg.png")',
                }}
            />

            <div className="relative z-10 text-center text-white px-4 max-w-[1008px] mx-auto w-full">
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[80px] font-bold mb-3 md:mb-5 drop-shadow-2xl tracking-tight text-white leading-tight">
                    Find Homes in Nigeria
                </h1>
                <p className="text-base md:text-2xl mb-5 md:mb-10 opacity-90 drop-shadow-lg font-medium max-w-3xl mx-auto tracking-wide">
                    Browse trusted listings, book inspections, and move in faster
                </p>

                {/* Search Card */}
                <div className="bg-white shadow-2xl max-w-5xl mx-auto relative rounded-3xl md:rounded-full p-3 md:p-2.5 overflow-visible">
                    {/* Mobile: 2-column grid of filters */}
                    <div className="grid grid-cols-2 md:hidden gap-0 divide-x divide-y divide-gray-100 rounded-2xl border border-gray-100 mb-3">
                        {(['location', 'propertyType', 'priceRange', 'bedrooms'] as const).map((key, i) => {
                            const labels: Record<string, string> = {
                                location: 'Location',
                                propertyType: 'Property Type',
                                priceRange: 'Price Range',
                                bedrooms: 'Bedrooms',
                            };
                            return (
                                <div key={key} className={`relative ${i >= 2 ? 'border-t border-gray-100' : ''}`} ref={activeDropdown === key ? dropdownRef : null}>
                                    <div
                                        className={`px-3 py-3 flex items-center justify-between cursor-pointer transition-all ${activeDropdown === key ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                                        onClick={() => toggleDropdown(key)}
                                    >
                                        <span className={`text-[13px] truncate w-full text-left ${filters[key] ? 'font-semibold text-[#1A1A1A]' : 'font-medium text-gray-500'}`}>
                                            {filters[key] || labels[key]}
                                        </span>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ml-1 ${activeDropdown === key ? 'rotate-180 text-[#002D6B]' : ''}`} />
                                    </div>
                                    {activeDropdown === key && (
                                        <div className="absolute top-[calc(100%+4px)] left-0 w-[160px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 py-2 z-[200]">
                                            {FILTER_OPTIONS[key].map((option) => (
                                                <div
                                                    key={option}
                                                    className={`px-4 py-2.5 text-[13px] font-semibold cursor-pointer hover:bg-gray-50 transition-colors ${filters[key] === option ? 'text-[#0095FF] bg-blue-50/50' : 'text-gray-600'}`}
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

                    {/* Desktop: all in one flex row (filters + button inline) */}
                    <div className="hidden md:flex flex-row items-center w-full">
                        <div className="flex flex-1 items-center min-w-0">
                            {renderDropdown('location', 'Location')}
                            <div className="w-[1px] h-10 bg-gray-200 mx-1 flex-shrink-0"></div>
                            {renderDropdown('propertyType', 'Property Type')}
                            <div className="w-[1px] h-10 bg-gray-200 mx-1 flex-shrink-0"></div>
                            {renderDropdown('priceRange', 'Price Range')}
                            <div className="w-[1px] h-10 bg-gray-200 mx-1 flex-shrink-0"></div>
                            {renderDropdown('bedrooms', 'Bedrooms')}
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="bg-[#002D6B] hover:bg-[#001D4B] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all min-w-[140px] m-1 disabled:opacity-80 active:scale-95 flex-shrink-0"
                        >
                            {isSearching ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span className="font-bold text-[16px]">Searching...</span>
                                </>
                            ) : (
                                <>
                                    <Search size={18} className="stroke-[3px]" />
                                    <span className="font-bold text-[16px] tracking-tight">Search</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Mobile-only: full-width search button */}
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="md:hidden bg-[#002D6B] hover:bg-[#001D4B] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-80 active:scale-95 w-full"
                    >
                        {isSearching ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span className="font-bold text-[16px]">Searching...</span>
                            </>
                        ) : (
                            <>
                                <Search size={18} className="stroke-[3px]" />
                                <span className="font-bold text-[16px] tracking-tight">Search</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
}
