"use client";

import { Search, SlidersHorizontal, ListFilter  } from "lucide-react";
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
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-dark transition-colors">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Search... (e.g., house, WiFi, Lekki)"
                    className="w-full h-14 pl-16 pr-6 rounded-full border border-gray-300 bg-white focus:outline-none focus:border-[#07358B] focus:ring-4 focus:ring-[#07358B]/5 transition-all text-sm placeholder:text-gray-300 "
                />
            </div>

            <button className="h-14 px-8 rounded-full border border-[#0095FF] bg-white flex items-center gap-3 text-[#0095FF] hover:border-primary-dark hover:text-primary-dark transition-all shadow-sm group">
                < ListFilter  size={18} className="translate-y-[1px]" />
                <span className="font-bold text-sm">Filters</span>
            </button>

            <button
                onClick={handleSearch}
                className="h-14 px-10 rounded-full bg-[#07358B] text-white flex items-center gap-3 hover:bg-primary-dark/90 transition-all shadow-lg group"
            >
                <Search size={18} className="stroke-[3px]" />
                <span className="font-bold text-sm">Search</span>
            </button>
        </div>
    );
}
