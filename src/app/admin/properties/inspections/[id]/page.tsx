"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Calendar, Clock, User, MoreVertical, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function InspectionDetailsPage() {
    const router = useRouter();
    const params = useParams();

    // Mock data for the specific inspection
    const inspection = {
        id: params.id,
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        renter: "Ahmed Hassan",
        status: "Pending",
        image: "/images/property-1.jpg",
        assignedStaff: "John Chidima",
        date: "December 15, 2024",
        time: "10:00 AM"
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#0095FF] font-bold text-[16px] hover:opacity-80 transition-opacity w-fit"
            >
                <ChevronLeft size={20} />
                Back
            </button>

            <h1 className="text-[28px] font-bold text-[#1A1A1A] font-montserrat tracking-tight">
                Inspection Details
            </h1>

            {/* Header Card */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex items-center gap-6">
                    {/* Thumbnail */}
                    <div className="w-[120px] h-[120px] rounded-[16px] bg-gray-100 relative overflow-hidden flex-shrink-0">
                        <Image
                            src={inspection.image}
                            alt={inspection.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-[24px] font-black text-[#1A1A1A] font-montserrat tracking-tight leading-none">
                                {inspection.title}
                            </h2>
                            <span className="bg-[#FFF9E9] text-[#FFA800] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                {inspection.status}
                            </span>
                        </div>
                        <p className="text-[17px] font-medium text-[#999999] mb-1">
                            {inspection.location}
                        </p>
                        <p className="text-[16px] font-bold text-[#1A1A1A]">
                            Renter: <span className="text-[#999999] font-medium">{inspection.renter}</span>
                        </p>
                    </div>
                </div>

                {/* Assigned Staff */}
                <div className="flex flex-col gap-3 w-full lg:w-auto">
                    <span className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                        Assigned Staff
                    </span>
                    <div className="flex items-center gap-3 px-6 py-3.5 bg-[#F2F7FF] rounded-xl min-w-[280px]">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-400">
                            <User size={14} strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] font-medium text-[#1A1A1A]">
                            {inspection.assignedStaff}
                        </span>
                    </div>
                </div>
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Card */}
                <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm flex items-center gap-6">
                    <div className="w-[60px] h-[60px] rounded-full bg-[#F2F7FF] flex items-center justify-center text-[#0095FF] shadow-sm">
                        <Calendar size={28} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[18px] font-bold text-[#1A1A1A]">Date</span>
                        <span className="text-[16px] font-medium text-gray-400">{inspection.date}</span>
                    </div>
                </div>

                {/* Time Card */}
                <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm flex items-center gap-6">
                    <div className="w-[60px] h-[60px] rounded-full bg-[#F2F7FF] flex items-center justify-center text-[#0095FF] shadow-sm">
                        <Clock size={28} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[18px] font-bold text-[#1A1A1A]">Time</span>
                        <span className="text-[16px] font-medium text-gray-400">{inspection.time}</span>
                    </div>
                </div>
            </div>

            {/* Confirm Assignment Section */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm flex flex-col gap-8 mt-4">
                <h3 className="text-[20px] font-bold text-[#1A1A1A]">
                    Confirm Assignment
                </h3>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 py-4 border-2 border-[#FF5252] text-[#FF5252] rounded-full font-bold text-[16px] hover:bg-red-50 transition-all">
                        Decline
                    </button>
                    <button className="flex-1 py-4 border-2 border-[#0095FF] text-[#0095FF] rounded-full font-bold text-[16px] hover:bg-blue-50 transition-all">
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
