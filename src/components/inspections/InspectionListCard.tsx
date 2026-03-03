"use client";

import { Calendar, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";

import Link from "next/link";

export type InspectionStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

interface InspectionListCardProps {
    inspection: {
        id: string;
        requestId: string;
        propertyName: string;
        location: string;
        date: string;
        time: string;
        image: string;
        status: InspectionStatus;
        requestedDate: string;
    };
}

const statusStyles: Record<InspectionStatus, string> = {
    Pending: "bg-[#FFF9E6] text-[#FFCC00] border-[#FFEBB3]",
    Confirmed: "bg-[#E6FFF0] text-[#00CC44] border-[#B3FFCC]",
    Completed: "bg-[#E9F3FF] text-primary-dark border-[#D9E9FF]",
    Cancelled: "bg-[#FFF2F2] text-[#FF3B30] border-[#FFD9D9]"
};

export default function InspectionListCard({ inspection }: InspectionListCardProps) {
    return (
        <Link href={`/inspections/${inspection.id}`}>
            <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-4 flex items-center gap-6 group hover:shadow-md transition-all cursor-pointer">
                {/* Property Image */}
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0">
                    <Image
                        src={inspection.image}
                        alt={inspection.propertyName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-[17px] font-black text-[#1A1A1A] font-montserrat mb-1">
                                {inspection.propertyName}
                            </h3>
                            <p className="text-[11px] text-[#666666] font-bold">
                                {inspection.location}
                            </p>
                        </div>
                        <ChevronRight size={20} className="text-primary-dark/30 group-hover:text-primary-dark transition-colors" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[#666666]">
                            <Calendar size={14} className="text-primary-dark" />
                            <span className="text-[11px] font-bold">{inspection.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#666666]">
                            <Clock size={14} className="text-[#002D6B]" />
                            <span className="text-[11px] font-bold">{inspection.time}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 bg-[#F7F7F7] rounded-full px-4 py-2 flex items-center gap-2">
                            <span className="text-[9px] text-[#999999] font-bold whitespace-nowrap">
                                Requested on {inspection.requestedDate} • ID: {inspection.requestId}
                            </span>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold ${statusStyles[inspection.status]}`}>
                            {inspection.status}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
