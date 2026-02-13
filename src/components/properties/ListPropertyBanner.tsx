"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function ListPropertyBanner() {
    return (
        <div className="bg-[#002D6B] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Plus size={20} className="text-white" strokeWidth={3} />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-white text-base font-bold font-montserrat">
                        Ready to list a property?
                    </h2>
                    <p className="text-white/80 text-sm font-medium">
                        Add your property details and start receiving inspection requests
                    </p>
                </div>
            </div>

            <Link
                href="/properties/add"
                className="bg-white/20 hover:bg-white/30 text-white border border-white/50 px-6 py-2.5 rounded-xl font-bold text-sm transition-all text-center flex items-center gap-2 group"
            >
                Add New Property
            </Link>
        </div>
    );
}
