"use client";

import { Home, ClipboardList, Clock, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useProperty } from "@/hooks/useProperty";
import { useInspection } from "@/hooks/useInspection";
import { useUserRole } from "@/context/UserRoleContext";
import { useAuthStore } from "@/store/useAuthStore";
import { AvailabilityStatus } from "@/types/property";
import { InspectionStatus } from "@/types/inspection";

interface MetricCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    href: string;
}

function MetricCard({ label, value, icon: Icon, href }: MetricCardProps) {
    return (
        <Link 
            href={href} 
            className="flex-1 bg-white border border-[#0095FF]/20 rounded-[16px] p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-[#0095FF]/50 transition-all group cursor-pointer"
        >
            <div className="flex flex-col gap-1">
                <span className="text-[28px] font-black text-[#1A1A1A] font-montserrat">
                    {value}
                </span>
                <span className="text-[14px] font-bold text-gray-400">
                    {label}
                </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E9F3FF] flex items-center justify-center text-[#0095FF] group-hover:scale-110 transition-transform">
                <Icon size={20} strokeWidth={2} />
            </div>
        </Link>
    );
}

export default function OwnerMetrics() {
    const { role } = useUserRole();
    const user = useAuthStore((state) => state.user);
    const { useMyProperties } = useProperty();
    const { useOwnerInspections, useMyInspections } = useInspection();

    const isOwner = role === "Owner";

    // Fetch properties
    const { data: propertiesResponse, isLoading: isLoadingProperties } = useMyProperties();

    // Robustly extract properties array supporting both raw lists and paginated structures
    const rawData = propertiesResponse?.data;
    const propertiesArray = Array.isArray(rawData)
        ? rawData
        : (rawData && Array.isArray((rawData as any).items))
            ? (rawData as any).items
            : Array.isArray(propertiesResponse)
                ? propertiesResponse
                : (propertiesResponse && Array.isArray((propertiesResponse as any).items))
                    ? (propertiesResponse as any).items
                    : [];

    // Ensure we only count properties belonging to the logged-in user
    const properties = propertiesArray.filter(
        (p: any) => !user?.id || p.ownerId === user.id
    );

    // Fetch inspections based on role
    const { data: ownerInspectionsResponse, isLoading: isLoadingOwner } = useOwnerInspections(1, 100);
    const { data: myInspectionsResponse, isLoading: isLoadingMy } = useMyInspections(1, 100);

    const inspections = isOwner
        ? (ownerInspectionsResponse?.data?.items || [])
        : (myInspectionsResponse?.data?.items || []);

    const isLoadingInspections = isOwner ? isLoadingOwner : isLoadingMy;
    const isLoading = isLoadingProperties || isLoadingInspections;


    // Helper functions to safely check enum values whether API returns string or number
    const isAvailable = (val: any) => val === 1 || val === '1';
    const isPending = (val: any) => val === InspectionStatus.Pending || val === 0 || val === '0' || val === 'Pending';
    const isCompleted = (val: any) => val === InspectionStatus.Completed || val === 3 || val === '3' || val === 'Completed';

    // Calculate JS filters
    const stats = {
        totalProperties: properties.length,
        activeListings: properties.filter((p: any) => isAvailable(p.availability) || isAvailable((p as any).avaialability)).length,
        pendingInspections: inspections.filter(i => isPending(i.status)).length,
        completedInspections: inspections.filter(i => isCompleted(i.status)).length
    };

    const metrics = [
        { label: "Total Properties", value: stats.totalProperties, icon: Home, href: "/properties" },
        { label: "Active Listings", value: stats.activeListings, icon: ClipboardList, href: "/properties" },
        { label: "Pending Inspections", value: stats.pendingInspections, icon: Clock, href: "/inspections" },
        { label: "Completed Inspections", value: stats.completedInspections, icon: CheckCircle2, href: "/inspections" }
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-[100px] bg-gray-50 animate-pulse rounded-[16px] flex items-center justify-center">
                        <Loader2 className="animate-spin text-gray-200" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {metrics.map((metric) => (
                <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    icon={metric.icon}
                    href={metric.href}
                />
            ))}
        </div>
    );
}
