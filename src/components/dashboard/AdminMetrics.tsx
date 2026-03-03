"use client";

import { Clock, FileText, Search } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
}

function MetricCard({ label, value, icon: Icon }: MetricCardProps) {
    return (
        <div className="bg-[#E9F3FF] border border-[#0095FF]/30 rounded-[12px] p-6 flex flex-col gap-2 relative overflow-hidden h-[110px] justify-center">
            <h3 className="text-[28px] font-black text-[#1A1A1A] font-montserrat tracking-tight leading-none mb-1">
                {value}
            </h3>
            <p className="text-[14px] font-medium text-gray-500">
                {label}
            </p>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0095FF] shadow-sm">
                <Icon size={20} strokeWidth={1.5} />
            </div>
        </div>
    );
}

export default function AdminMetrics() {
    const metrics = [
        {
            label: "Pending KYC",
            value: "3",
            icon: Clock
        },
        {
            label: "Active Listings",
            value: "24",
            icon: FileText
        },
        {
            label: "Inspections",
            value: "7",
            icon: Search
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
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
