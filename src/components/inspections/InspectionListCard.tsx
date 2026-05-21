"use client";

import { Calendar, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Inspection, InspectionStatus } from "@/types/inspection";
import { format } from "date-fns";

interface InspectionListCardProps {
    inspection: Inspection;
}

const statusStyles: Record<InspectionStatus, string> = {
    [InspectionStatus.Pending]: "bg-[#FFF9E6] text-[#FFCC00] border-[#FFEBB3]",
    [InspectionStatus.Confirmed]: "bg-[#E6FFF0] text-[#00CC44] border-[#B3FFCC]",
    [InspectionStatus.Completed]: "bg-[#E9F3FF] text-primary-dark border-[#D9E9FF]",
    [InspectionStatus.Cancelled]: "bg-[#FFF2F2] text-[#FF3B30] border-[#FFD9D9]",
    [InspectionStatus.Declined]: "bg-[#FFF2F2] text-[#FF3B30] border-[#FFD9D9]",
    [InspectionStatus.RescheduleRequested]: "bg-[#F2F7FF] text-[#0095FF] border-[#D9E9FF]",
};

const statusLabels: Record<InspectionStatus, string> = {
    [InspectionStatus.Pending]: "Pending",
    [InspectionStatus.Confirmed]: "Confirmed",
    [InspectionStatus.Completed]: "Completed",
    [InspectionStatus.Cancelled]: "Cancelled",
    [InspectionStatus.Declined]: "Declined",
    [InspectionStatus.RescheduleRequested]: "Reschedule Requested",
};

export default function InspectionListCard({ inspection }: InspectionListCardProps) {
    const propertyImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070"; // Fallback
    
    return (
        <Link href={`/inspections/${inspection.id || ''}`} className="block w-full">
            <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-4 flex items-center gap-6 group hover:shadow-md transition-all cursor-pointer">
                {/* Property Image */}
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0">
                    <Image
                        src={propertyImage}
                        alt={inspection.propertyName || "Property"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-[17px] font-black text-[#1A1A1A] font-montserrat mb-1">
                                {inspection.propertyName || "Property Inspection"}
                            </h3>
                            <p className="text-[11px] text-[#666666] font-bold">
                                Latitude: {inspection.latitude}, Longitude: {inspection.longitude}
                            </p>
                        </div>
                        <ChevronRight size={20} className="text-primary-dark/30 group-hover:text-primary-dark transition-colors" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[#666666]">
                            <Calendar size={14} className="text-primary-dark" />
                            <span className="text-[11px] font-bold">
                                {inspection.scheduledDate ? format(new Date(inspection.scheduledDate), "MMM dd, yyyy") : "N/A"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#666666]">
                            <Clock size={14} className="text-[#002D6B]" />
                            <span className="text-[11px] font-bold">{inspection.scheduledTime}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 bg-[#F7F7F7] rounded-full px-4 py-2 flex items-center gap-2">
                            <span className="text-[9px] text-[#999999] font-bold whitespace-nowrap">
                                Requested on {inspection.dateCreated ? format(new Date(inspection.dateCreated), "MMM dd, yyyy") : "N/A"} • ID: {(inspection.id || '').slice(0, 8).toUpperCase()}
                            </span>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold ${statusStyles[inspection.status]}`}>
                            {statusLabels[inspection.status]}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
