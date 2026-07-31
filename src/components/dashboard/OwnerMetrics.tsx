"use client";

import { Home, ClipboardList, Clock, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useProperty } from "@/hooks/useProperty";

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
            className="flex-1 bg-white dark:bg-gray-900 border border-[#0095FF]/20 rounded-[16px] p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-[#0095FF]/50 transition-all group cursor-pointer"
        >
            <div className="flex flex-col gap-1">
                <span className="text-[28px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat">
                    {value}
                </span>
                <span className="text-[14px] font-bold text-gray-400 dark:text-gray-500">
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
    const { useDashboardStats } = useProperty();
    const { data: statsResponse, isLoading } = useDashboardStats();
    const stats = statsResponse?.data;

    const metrics = [
        { label: "Total Properties", value: stats?.totalProperties ?? 0, icon: Home, href: "/properties" },
        { label: "Active Listings", value: stats?.activeListings ?? 0, icon: ClipboardList, href: "/properties" },
        { label: "Pending Inspections", value: stats?.pendingInspections ?? 0, icon: Clock, href: "/inspections" },
        { label: "Completed Inspections", value: stats?.completedInspections ?? 0, icon: CheckCircle2, href: "/inspections" }
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-[100px] bg-gray-50 dark:bg-gray-800/50 animate-pulse rounded-[16px] flex items-center justify-center">
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
