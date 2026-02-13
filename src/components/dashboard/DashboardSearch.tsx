"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/dashboard?q=${encodeURIComponent(query.trim())}`);
        } else {
            router.push('/dashboard');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-3 mb-10 w-full">
            <div className="relative flex-1 group w-full">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#002D6B] transition-colors">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Search... (e.g., house, WiFi, Lekki)"
                    className="w-full h-14 pl-16 pr-6 rounded-full border border-gray-100 bg-white focus:outline-none focus:border-[#002D6B] focus:ring-4 focus:ring-[#002D6B]/5 transition-all text-sm placeholder:text-gray-300 shadow-sm"
                />
            </div>

            <button className="h-14 px-8 rounded-full border border-gray-100 bg-white flex items-center gap-3 text-gray-500 hover:border-[#002D6B] hover:text-[#002D6B] transition-all shadow-sm group">
                <SlidersHorizontal size={18} className="translate-y-[1px]" />
                <span className="font-bold text-sm">Filters</span>
            </button>

            <button
                onClick={handleSearch}
                className="h-14 px-10 rounded-full bg-[#002D6B] text-white flex items-center gap-3 hover:bg-[#001D4B] transition-all shadow-lg group"
            >
                <Search size={18} className="stroke-[3px]" />
                <span className="font-bold text-sm">Search</span>
            </button>
        </div>
    );
}
