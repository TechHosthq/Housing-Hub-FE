"use client";

import { useState } from "react";
import { MoreVertical, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MOCK_PROPERTIES = [
    {
        id: "1",
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        owner: "John Chidima",
        date: "2026-01-25",
        status: "Posted",
        image: "/images/property-1.jpg"
    },
    {
        id: "2",
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        owner: "John Chidima",
        date: "2026-01-25",
        status: "Posted",
        image: "/images/property-1.jpg"
    },
    {
        id: "3",
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        owner: "John Chidima",
        date: "2026-01-25",
        status: "Published",
        image: "/images/property-1.jpg"
    },
    {
        id: "4",
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        owner: "John Chidima",
        date: "2026-01-25",
        status: "Published",
        image: "/images/property-1.jpg"
    },
    {
        id: "5",
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        owner: "John Chidima",
        date: "2026-01-25",
        status: "Published",
        image: "/images/property-1.jpg"
    }
];

const MOCK_INSPECTIONS = [
    {
        id: "i1",
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        renter: "Ahmed Hassan",
        date: "2026-01-25",
        status: "Approved",
        image: "/images/property-1.jpg"
    },
    {
        id: "i2",
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        renter: "Ahmed Hassan",
        date: "2026-01-25",
        status: "Approved",
        image: "/images/property-1.jpg"
    },
    {
        id: "i3",
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        renter: "Ahmed Hassan",
        date: "2026-01-25",
        status: "Upcoming",
        image: "/images/property-1.jpg"
    },
    {
        id: "i4",
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        renter: "Ahmed Hassan",
        date: "2026-01-25",
        status: "Upcoming",
        image: "/images/property-1.jpg"
    },
    {
        id: "i5",
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        renter: "Ahmed Hassan",
        date: "2026-01-25",
        status: "Pending",
        image: "/images/property-1.jpg"
    },
    {
        id: "i6",
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        renter: "Ahmed Hassan",
        date: "2026-01-25",
        status: "Pending",
        image: "/images/property-1.jpg"
    }
];

export default function AdminPropertiesPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("LISTED PROPERTIES");
    const [inspectionFilter, setInspectionFilter] = useState("All");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const isInspections = activeTab === "INSPECTIONS";

    const filteredInspections = MOCK_INSPECTIONS.filter(inspection =>
        inspectionFilter === "All" || inspection.status === inspectionFilter
    );

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-[28px] font-bold text-[#1A1A1A] font-montserrat tracking-tight leading-none">
                    Property Management
                </h1>

                {/* Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-4 px-6 py-3 bg-white border border-gray-100 rounded-[14px] shadow-sm hover:bg-gray-50 transition-all group"
                    >
                        <span className="text-[14px] font-medium text-gray-400">
                            {isInspections ? "All Inspections" : "All properties"}
                        </span>
                        <ChevronDown
                            size={18}
                            className={`text-gray-400 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
                        />
                    </button>
                    {isFilterOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                            {(isInspections ? ["All Inspections", "Approved", "Upcoming", "Pending"] : ["All properties", "Approved", "Pending", "Declined"]).map((option) => (
                                <button
                                    key={option}
                                    className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsFilterOpen(false)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex bg-gray-50 p-1.5 rounded-[12px] w-fit">
                <button
                    onClick={() => setActiveTab("LISTED PROPERTIES")}
                    className={`px-12 py-3 rounded-[10px] text-[13px] font-black transition-all ${activeTab === "LISTED PROPERTIES"
                        ? "bg-white text-[#1A1A1A] shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    LISTED PROPERTIES ({MOCK_PROPERTIES.length})
                </button>
                <button
                    onClick={() => setActiveTab("INSPECTIONS")}
                    className={`px-12 py-3 rounded-[10px] text-[13px] font-black transition-all ${activeTab === "INSPECTIONS"
                        ? "bg-white text-[#1A1A1A] shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    INSPECTIONS ({MOCK_INSPECTIONS.length})
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "LISTED PROPERTIES" ? (
                <div className="flex flex-col gap-4">
                    {MOCK_PROPERTIES.map((property) => (
                        <div
                            key={property.id}
                            onClick={() => router.push(`/admin/properties/${property.id}`)}
                            className="bg-white border border-gray-100 rounded-[20px] p-6 flex flex-col sm:flex-row items-center gap-5 group hover:shadow-sm transition-all cursor-pointer relative"
                        >
                            {/* Thumbnail */}
                            <div className="w-full sm:w-[110px] h-[110px] rounded-[16px] bg-gray-100 relative overflow-hidden flex-shrink-0">
                                <Image
                                    src={property.image}
                                    alt={property.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-[22px] font-black text-[#1A1A1A] font-montserrat tracking-tight leading-none group-hover:text-[#0095FF] transition-colors">
                                        {property.title}
                                    </h3>
                                    <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${property.status === "Posted"
                                            ? "bg-yellow-50 text-yellow-500"
                                            : "bg-green-50 text-green-500"
                                        }`}>
                                        {property.status}
                                    </span>
                                </div>
                                <p className="text-[17px] font-medium text-[#999999] mb-1">
                                    {property.location}
                                </p>
                                <div className="flex items-center gap-4 text-[15px]">
                                    <span className="font-bold text-[#1A1A1A]">
                                        Owner: <span className="text-[#999999] font-medium">{property.owner}</span>
                                    </span>
                                    <span className="font-bold text-[#0095FF]">
                                        {property.status}: <span className="text-[#999999] font-medium">{property.date}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Menu logic
                                }}
                                className="p-3 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all flex-shrink-0 absolute top-6 right-6 sm:relative sm:top-auto sm:right-auto"
                            >
                                <MoreVertical size={24} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {/* Inspection Sub-filters */}
                    <div className="flex items-center gap-3">
                        {[
                            { label: `All (${MOCK_INSPECTIONS.length})`, value: "All" },
                            { label: "Approved (2)", value: "Approved" },
                            { label: "Upcoming (2)", value: "Upcoming" },
                            { label: "Pending (2)", value: "Pending" }
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setInspectionFilter(filter.value)}
                                className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all ${inspectionFilter === filter.value
                                    ? "bg-[#002B7F] text-white"
                                    : "bg-gray-50 text-[#999999] hover:bg-gray-100"
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Inspection List */}
                    <div className="flex flex-col gap-4">
                        {filteredInspections.map((inspection) => (
                            <div
                                key={inspection.id}
                                onClick={() => router.push(`/admin/properties/inspections/${inspection.id}`)}
                                className="bg-white border border-gray-100 rounded-[20px] p-6 flex flex-col sm:flex-row items-center gap-5 group hover:shadow-sm transition-all cursor-pointer relative"
                            >
                                {/* Thumbnail */}
                                <div className="w-full sm:w-[110px] h-[110px] rounded-[16px] bg-gray-100 relative overflow-hidden flex-shrink-0">
                                    <Image
                                        src={inspection.image}
                                        alt={inspection.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex flex-col gap-2 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-[22px] font-black text-[#1A1A1A] font-montserrat tracking-tight leading-none group-hover:text-[#0095FF] transition-colors">
                                            {inspection.title}
                                        </h3>
                                        <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${inspection.status === "Approved"
                                            ? "bg-green-50 text-green-500"
                                            : inspection.status === "Upcoming"
                                                ? "bg-blue-50 text-blue-500"
                                                : "bg-yellow-50 text-yellow-500"
                                            }`}>
                                            {inspection.status}
                                        </span>
                                    </div>
                                    <p className="text-[17px] font-medium text-[#999999] mb-1">
                                        {inspection.location}
                                    </p>
                                    <div className="flex items-center gap-4 text-[15px]">
                                        <span className="font-bold text-[#1A1A1A]">
                                            Renter: <span className="text-[#999999] font-medium">{inspection.renter}</span>
                                        </span>
                                        <span className="font-bold text-[#0095FF]">
                                            Requested: <span className="text-[#999999] font-medium">{inspection.date}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Menu logic
                                    }}
                                    className="p-3 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all flex-shrink-0 absolute top-6 right-6 sm:relative sm:top-auto sm:right-auto"
                                >
                                    <MoreVertical size={24} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

