"use client";

import KYCBanner from "./KYCBanner";
import OwnerMetrics from "./OwnerMetrics";

export default function OwnerDashboard() {
    return (
        <div className="w-full">
            {/* Owner specific KYC message/banner */}
            <KYCBanner />

            <div className="mt-12">
                <h2 className="text-[32px] font-black text-[#1A1A1A] font-montserrat mb-10">
                    Your Overview
                </h2>

                <OwnerMetrics />
            </div>

            {/* Placeholder for future Owner sections (Listings, etc) */}
        </div>
    );
}
