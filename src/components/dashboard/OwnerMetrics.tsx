"use client";

import { Home, ClipboardList, Clock, CheckCircle2 } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
}

function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
    return (
        <div className="flex-1 bg-white border border-[#0095FF]/20 rounded-[16px] p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
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
        </div>
    );
}

export default function OwnerMetrics() {
    const metrics = [
        { label: "Total Properties", value: 0, icon: Home },
        { label: "Active Listings", value: 0, icon: ClipboardList },
        { label: "Pending Inspections", value: 0, icon: Clock },
        { label: "Completed Inspections", value: 0, icon: CheckCircle2 }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {metrics.map((metric) => (
                <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    icon={metric.icon}
                />
            ))}
        </div>
    );
}
