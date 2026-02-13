"use client";

import AdminMetrics from "@/components/dashboard/AdminMetrics";
import { ChevronRight, Calendar, Clock, ChevronDown, ListFilter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
    return (
        <div className="flex flex-col gap-10">
            {/* Overview Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-[28px] font-bold text-[#1A1A1A] font-montserrat">Overview</h1>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-lg shadow-sm cursor-pointer group hover:border-gray-200 transition-all">
                    <ListFilter size={18} className="text-gray-400 group-hover:text-[#0095FF] transition-colors" />
                    <span className="text-[14px] font-medium text-gray-500">Last 30 days</span>
                    <ChevronDown size={18} className="text-gray-400 group-hover:text-[#0095FF] transition-colors" />
                </div>
            </div>

            <AdminMetrics />

            {/* Today's Inspections Section */}
            <div className="flex flex-col gap-6">
                <h2 className="text-[24px] font-bold text-[#1A1A1A] font-montserrat">Today's Inspections</h2>

                <div className="flex flex-col gap-4">
                    {[
                        { status: "Confirmed", statusColor: "bg-[#E9F3FF] text-[#0095FF]" },
                        { status: "Pending", statusColor: "bg-[#FFF9E9] text-[#FFA800]" }
                    ].map((item, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer relative">
                            <div className="flex items-center gap-6">
                                <div className="w-[120px] h-[100px] rounded-xl relative overflow-hidden flex-shrink-0">
                                    <Image
                                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070"
                                        alt="Property"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex flex-col flex-1 gap-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[20px] font-bold text-[#1A1A1A] group-hover:text-[#0095FF] transition-colors">Javeele House</h3>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-[#0095FF] transition-all" />
                                    </div>
                                    <p className="text-[14px] text-gray-400 font-medium">Lekki Phase 1, Lagos State, Nigeria</p>
                                    <div className="flex items-center gap-6 text-[14px] font-bold text-[#1A1A1A]">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-[#0095FF]" />
                                            Dec 15, 2024
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-[#0095FF]" />
                                            10:00 AM
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 mt-2">
                                        <span className="text-[12px] font-bold text-gray-600">Requested on Dec 10, 2024 • ID: INS-2024-001</span>
                                        <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${item.statusColor}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="flex flex-col gap-6">
                <h2 className="text-[24px] font-bold text-[#1A1A1A] font-montserrat">Recent Activity</h2>

                <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-sm">
                    {[
                        { text: "Chidi Okonkwo KYC approved", time: "5 minutes ago" },
                        { text: "New property listed in Ikeja", time: "23 minutes ago" }
                    ].map((activity, i) => (
                        <div key={i} className={`px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors ${i !== 1 ? 'border-b border-gray-100' : ''}`}>
                            <span className="text-[15px] font-bold text-[#1A1A1A]">{activity.text}</span>
                            <span className="text-[14px] text-gray-400 font-medium">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
