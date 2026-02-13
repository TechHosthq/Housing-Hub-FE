"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import InspectionListCard, { InspectionStatus } from "@/components/inspections/InspectionListCard";

const MOCK_INSPECTIONS = [
    {
        id: "1",
        requestId: "INS-2024-001",
        propertyName: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        date: "Dec 15, 2024",
        time: "10:00 AM",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070",
        status: "Pending" as InspectionStatus,
        requestedDate: "Dec 10, 2024"
    },
    {
        id: "2",
        requestId: "INS-2024-002",
        propertyName: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        date: "Dec 15, 2024",
        time: "10:00 AM",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070",
        status: "Confirmed" as InspectionStatus,
        requestedDate: "Dec 10, 2024"
    },
    {
        id: "3",
        requestId: "INS-2024-003",
        propertyName: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        date: "Dec 15, 2024",
        time: "10:00 AM",
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=2070",
        status: "Completed" as InspectionStatus,
        requestedDate: "Dec 10, 2024"
    },
    {
        id: "4",
        requestId: "INS-2024-004",
        propertyName: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        date: "Dec 15, 2024",
        time: "10:00 AM",
        image: "https://images.unsplash.com/photo-1592595893347-11119bc41c11?auto=format&fit=crop&q=80&w=2070",
        status: "Cancelled" as InspectionStatus,
        requestedDate: "Dec 10, 2024"
    },
    {
        id: "5",
        requestId: "INS-2024-005",
        propertyName: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        date: "Dec 15, 2024",
        time: "10:00 AM",
        image: "https://images.unsplash.com/photo-1580587767303-93693f77a062?auto=format&fit=crop&q=80&w=2070",
        status: "Confirmed" as InspectionStatus,
        requestedDate: "Dec 10, 2024"
    }
];

const TABS = [
    { label: "All", count: MOCK_INSPECTIONS.length },
    { label: "Upcoming", count: MOCK_INSPECTIONS.filter(i => i.status === "Confirmed" || i.status === "Pending").length },
    { label: "Completed", count: MOCK_INSPECTIONS.filter(i => i.status === "Completed").length },
    { label: "Canceled", count: MOCK_INSPECTIONS.filter(i => i.status === "Cancelled").length }
];

export default function InspectionsPage() {
    const [activeTab, setActiveTab] = useState("All");

    const filteredInspections = MOCK_INSPECTIONS.filter(inspection => {
        if (activeTab === "All") return true;
        if (activeTab === "Upcoming") return inspection.status === "Confirmed" || inspection.status === "Pending";
        if (activeTab === "Completed") return inspection.status === "Completed";
        if (activeTab === "Canceled") return inspection.status === "Cancelled";
        return true;
    });

    return (
        <main className="min-h-screen bg-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <h1 className="text-[28px] font-black text-[#1A1A1A] font-montserrat mb-8">
                    My Inspections
                </h1>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-3 mb-10">
                    {TABS.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(tab.label)}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${activeTab === tab.label
                                    ? "bg-[#002D6B] text-white border-[#002D6B]"
                                    : "bg-[#F2F2F2] text-[#999999] border-[#F2F2F2] hover:bg-white hover:border-[#E5E5E5]"
                                }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Inspection List */}
                <div className="space-y-4 max-w-4xl">
                    {filteredInspections.map((inspection) => (
                        <InspectionListCard key={inspection.id} inspection={inspection} />
                    ))}

                    {filteredInspections.length === 0 && (
                        <div className="py-20 text-center text-gray-400 font-bold">
                            No inspections found for this category.
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
