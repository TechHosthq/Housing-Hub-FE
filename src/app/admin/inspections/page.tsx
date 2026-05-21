"use client";

import { useState } from "react";
import { Search, Calendar, Clock, ChevronLeft, ChevronRight, MoreVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import { useInspection } from "@/hooks/useInspection";
import { format } from "date-fns";
import Link from "next/link";
import { InspectionStatus } from "@/types/inspection";

const statusLabels: Record<InspectionStatus, string> = {
    [InspectionStatus.Pending]: "Pending",
    [InspectionStatus.Confirmed]: "Confirmed",
    [InspectionStatus.Completed]: "Completed",
    [InspectionStatus.Cancelled]: "Cancelled",
    [InspectionStatus.Declined]: "Declined",
    [InspectionStatus.RescheduleRequested]: "Reschedule Requested",
};

export default function AdminInspectionsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [pageNumber, setPageNumber] = useState(1);

    const { useOwnerInspections } = useInspection();
    const { data: inspectionsResponse, isLoading } = useOwnerInspections(
        pageNumber, 
        20, 
        statusFilter === "all" ? undefined : parseInt(statusFilter)
    );

    const inspections = inspectionsResponse?.data?.items || [];

    const filteredInspections = inspections.filter(inspection => {
        const matchesSearch = inspection.propertyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inspection.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-dark w-12 h-12" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[28px] font-black text-[#1A1A1A] font-montserrat mb-2">Inspection Management</h1>
                    <p className="text-gray-500 font-medium">Monitor and manage property inspections.</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by property name or ID..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-[14px] focus:ring-2 focus:ring-[#0095FF]/20 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        className="flex-1 md:w-40 py-3 px-4 bg-gray-50 border-none rounded-xl text-[14px] focus:ring-2 focus:ring-[#0095FF]/20 transition-all outline-none appearance-none font-bold text-gray-600"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Inspections Table */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[13px] font-black text-gray-500 uppercase tracking-wider">Property & ID</th>
                                <th className="px-6 py-5 text-[13px] font-black text-gray-500 uppercase tracking-wider">Schedule</th>
                                <th className="px-6 py-5 text-[13px] font-black text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-5 text-[13px] font-black text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredInspections.map((inspection) => (
                                <tr key={inspection.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl relative overflow-hidden flex-shrink-0">
                                                <Image
                                                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070"
                                                    alt={inspection.propertyName || "Property"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#1A1A1A] group-hover:text-[#0095FF] transition-colors">{inspection.propertyName || "Property Inspection"}</span>
                                                <span className="text-[11px] text-[#0095FF] font-black uppercase tracking-wider">{inspection.id.slice(0, 8).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                                                <Calendar size={14} className="text-gray-400" />
                                                {inspection.scheduledDate ? format(new Date(inspection.scheduledDate), "MMM dd, yyyy") : "N/A"}
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
                                                <Clock size={14} />
                                                {inspection.scheduledTime}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                            inspection.status === InspectionStatus.Confirmed ? "bg-blue-50 text-[#0095FF]" :
                                            inspection.status === InspectionStatus.Completed ? "bg-green-50 text-green-600" :
                                            inspection.status === InspectionStatus.Cancelled || inspection.status === InspectionStatus.Declined ? "bg-red-50 text-red-600" :
                                            "bg-orange-50 text-orange-600"
                                        }`}>
                                            {statusLabels[inspection.status]}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link 
                                            href={`/inspections/${inspection.id}`}
                                            className="p-2 hover:bg-[#E9F3FF] hover:text-[#0095FF] rounded-lg transition-all inline-block"
                                        >
                                            <MoreVertical size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[13px] font-bold text-gray-400">
                        Showing {filteredInspections.length} inspections
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            className="p-2 border border-gray-200 rounded-lg text-gray-400 disabled:opacity-50"
                            disabled={pageNumber === 1}
                            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            className="p-2 border border-gray-200 rounded-lg text-gray-400 disabled:opacity-50"
                            disabled={!inspectionsResponse?.data?.hasNextPage}
                            onClick={() => setPageNumber(prev => prev + 1)}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
