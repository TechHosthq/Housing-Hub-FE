"use client";

import { Search, ChevronDown } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative h-[476px] flex items-center justify-center pt-16 overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url("/images/hero-bg.png")',
                }}
            />

            <div className="relative z-10 text-center text-white px-3 max-w-[1008px] mx-auto w-full">
                <h1 className="text-7xl md:text-6xl font-white mb-4 drop-shadow-xl tracking-tight text-white">
                    Find Homes in Nigeria
                </h1>
                <p className="text-xl md:text-2xl mb-16 opacity-100 drop-shadow-lg font-bold max-w-4xl mx-auto tracking-wide">
                    Browse trusted listings, book inspections, and move in faster
                </p>

                <div className="bg-white p-2 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-0 max-w-5xl mx-auto">
                    <div className="flex-1 flex items-center w-full px-6">
                        {/* Location */}
                        <div className="flex-1 px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-full transition-colors group">
                            <span className="text-sm font-bold text-gray-700">Location</span>
                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>

                        <div className="w-[1px] h-6 bg-gray-200 mx-1.5"></div>

                        {/* Property Type */}
                        <div className="flex-1 px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-full transition-colors group">
                            <span className="text-sm font-bold text-gray-700">Property Type</span>
                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>

                        <div className="w-[1px] h-6 bg-gray-200 mx-1.5"></div>

                        {/* Price Range */}
                        <div className="flex-1 px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-full transition-colors group">
                            <span className="text-sm font-bold text-gray-700">Price Range</span>
                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>

                        <div className="w-[1px] h-6 bg-gray-200 mx-1.5"></div>

                        {/* Bedrooms */}
                        <div className="flex-1 px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-full transition-colors group">
                            <span className="text-sm font-bold text-gray-700">Bedrooms</span>
                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                    </div>

                    <button className="bg-[#002D6B] hover:bg-[#001D4B] text-white px-7 py-3 rounded-full flex items-center justify-center gap-2 transition-all min-w-[112px] m-1 shadow-md group">
                        <Search size={14} className="stroke-[3px]" />
                        <span className="font-bold text-lg tracking-tight">Search</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
