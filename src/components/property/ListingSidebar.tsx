"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { AvailabilityStatus } from "@/types/property";
import ListingInfoPanel from "./ListingInfoPanel";

interface ListingSidebarProps {
    propertyId?: string;
    /** ISO timestamp from the API. */
    listedDate?: string | null;
    availability?: AvailabilityStatus;
}

export default function ListingSidebar({ propertyId, listedDate, availability }: ListingSidebarProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Anyone can view a listing, but booking needs an account. Send signed-out
    // visitors to login with a return path so they land back here afterwards.
    const inspectionPath = propertyId ? `/property/${propertyId}/inspection` : null;
    const inspectionHref = !inspectionPath
        ? "#"
        : isAuthenticated
            ? inspectionPath
            : `/login?redirect=${encodeURIComponent(inspectionPath)}`;

    return (
        <div className="w-full lg:max-w-[280px] space-y-6">
            <ListingInfoPanel
                propertyId={propertyId}
                listedDate={listedDate}
                availability={availability}
            />

            <div className="bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 p-6 shadow-sm">
                <Link
                    href={inspectionHref}
                    className="block w-full text-center bg-primary-dark hover:bg-primary-dark/90 text-white py-3.5 rounded-full text-[12px] font-bold transition-all shadow-md"
                >
                    {isAuthenticated ? "Request Inspection" : "Sign in to Request Inspection"}
                </Link>
            </div>
        </div>
    );
}
