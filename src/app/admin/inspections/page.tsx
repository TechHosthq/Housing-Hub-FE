"use client";

import { useState } from "react";
import { Search, Filter, Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, MoreVertical, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

const MOCK_INSPECTIONS = [
    {
        id: "1",
        requestId: "INS-2024-001",
        propertyName: "Javeele House",
        location: "Lekki Phase 1, Lagos",
        date: "Dec 15, 2024",
        time: "10:00 AM",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070",
        status: "Pending",
        customer: "John Doe",
        owner: "Ighodaro Priscilia"
    },
    {
        id: "2",
        requestId: "INS-2024-002",
        propertyName: "Riverside Villa",
        location: "Lekki Phase 1, Lagos",
        date: "Dec 16, 2024",
        time: "11:30 AM",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2070",
        status: "Confirmed",
        customer: "Sarah Williams",
        owner: "Oshunbunmi Samuel"
    },
    {
        id: "3",
        requestId: "INS-2024-003",
        propertyName: "Urban Apartment",
        location: "Surulere, Lagos",
        date: "Dec 14, 2024",
        time: "02:00 PM",
        image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=2071",
        status: "Completed",
        customer: "Michael Kel",
        owner: "Mary Kelechi"
    }
];

export default function AdminInspectionsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredInspections = MOCK_INSPECTIONS.filter(inspection => {
        const matchesSearch = inspection.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inspection.customer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || inspection.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[28px] font-black text-[#1A1A1A] font-montserrat mb-2">Inspection Management</h1>
                    <p className="text-gray-500 font-medium">Monitor and manage all property inspections across the platform.</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by property or customer..."
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
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
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
                                <th className="px-6 py-5 text-[13px] font-black text-gray-500 uppercase tracking-wider">Parties</th>
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
                                                    src={inspection.image}
                                                    alt={inspection.propertyName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#1A1A1A] group-hover:text-[#0095FF] transition-colors">{inspection.propertyName}</span>
                                                <span className="text-[11px] text-[#0095FF] font-black uppercase tracking-wider">{inspection.requestId}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                                                <Calendar size={14} className="text-gray-400" />
                                                {inspection.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
                                                <Clock size={14} />
                                                {inspection.time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${inspection.status === "Confirmed" ? "bg-blue-50 text-[#0095FF]" :
                                                inspection.status === "Completed" ? "bg-green-50 text-green-600" :
                                                    inspection.status === "Cancelled" ? "bg-red-50 text-red-600" :
                                                        "bg-orange-50 text-orange-600"
                                            }`}>
                                            {inspection.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-500 uppercase">
                                                    {inspection.customer.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-[12px] font-bold text-gray-600 truncate max-w-[120px]">User: {inspection.customer}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#E9F3FF] flex items-center justify-center text-[9px] font-black text-[#002B7F] uppercase">
                                                    {inspection.owner.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-[12px] font-bold text-gray-600 truncate max-w-[120px]">Host: {inspection.owner}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400">
                                            <button className="p-2 hover:bg-[#E9F3FF] hover:text-[#0095FF] rounded-lg transition-all" title="View Details">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
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
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-400" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-400" disabled>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
