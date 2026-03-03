"use client";

import { Home } from "lucide-react";

export default function PropertyEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="w-20 h-20 rounded-full bg-[#E9F3FF] flex items-center justify-center mb-6 shadow-sm">
                <Home size={32} className="text-[#0095FF]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[18px] font-bold text-[#1A1A1A] font-montserrat text-center">
                Your listed property shows here
            </h3>
        </div>
    );
}
