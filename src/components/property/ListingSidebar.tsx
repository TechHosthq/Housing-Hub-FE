"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

interface ListingSidebarProps {
    propertyId?: string;
    ownerId?: string;
    isOwner?: boolean;
}

export default function ListingSidebar({ propertyId, ownerId, isOwner }: ListingSidebarProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Anyone can view a listing, but booking needs an account. Send signed-out
    // visitors to login with a return path so they land back here afterwards.
    const inspectionPath = propertyId ? `/property/${propertyId}/inspection` : null;
    const inspectionHref = !inspectionPath
        ? "#"
        : isAuthenticated
            ? inspectionPath
            : `/login?redirect=${encodeURIComponent(inspectionPath)}`;

    const messagePath = ownerId ? `/messages?recipientId=${ownerId}` : null;
    const messageHref = !messagePath
        ? "#"
        : isAuthenticated
            ? messagePath
            : `/login?redirect=${encodeURIComponent(messagePath)}`;

    return (
        <div className="w-full lg:max-w-[280px] space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 p-6 shadow-sm">
                <h3 className="text-[14px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-6">Listing Information</h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#999999] dark:text-gray-500">Property ID</span>
                        <span className="text-[11px] font-bold text-[#333333]">SPH-12024</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#999999] dark:text-gray-500">Listed Date</span>
                        <span className="text-[11px] font-bold text-[#333333]">Dec 1, 2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#999999] dark:text-gray-500">Status</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#E9F3FF] text-[#0095FF] text-[9px] font-black uppercase">Available</span>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    <Link
                        href={inspectionHref}
                        className="block w-full text-center bg-primary-dark hover:bg-primary-dark/90 text-white py-3.5 rounded-full text-[12px] font-bold transition-all shadow-md"
                    >
                        {isAuthenticated ? "Request Inspection" : "Sign in to Request Inspection"}
                    </Link>

                    {!isOwner && messagePath && (
                        <Link
                            href={messageHref}
                            className="block w-full text-center bg-white dark:bg-gray-900 border border-primary-dark text-primary-dark hover:bg-primary-dark/5 py-3.5 rounded-full text-[12px] font-bold transition-all"
                        >
                            {isAuthenticated ? "Message Owner" : "Sign in to Message Owner"}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
