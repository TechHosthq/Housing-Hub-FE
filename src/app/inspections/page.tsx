"use client";

import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import InspectionListCard from "@/components/inspections/InspectionListCard";
import { useInspection } from "@/hooks/useInspection";
import { useUserRole } from "@/context/UserRoleContext";
import { InspectionStatus } from "@/types/inspection";
import { Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function InspectionsPage() {
    const [activeTab, setActiveTab] = useState("All");
    
    const { role } = useUserRole();
    const isOwner = role === "Owner";
    
    const { useMyInspections, useOwnerInspections } = useInspection();
    
    // Fetch a solid amount of items for robust client-side filter and page slicing
    const { data: myInspectionsResponse, isLoading: isLoadingMy } = useMyInspections(1, 200);
    const { data: ownerInspectionsResponse, isLoading: isLoadingOwner } = useOwnerInspections(1, 200);

    const inspections = isOwner
        ? (ownerInspectionsResponse?.data?.items || [])
        : (myInspectionsResponse?.data?.items || []);

    const isLoading = isOwner ? isLoadingOwner : isLoadingMy;

    // Helper functions to safely check status regardless of string/number format
    const isPending = (val: any) => val === InspectionStatus.Pending || val === 0 || val === '0' || val === 'Pending';
    const isConfirmed = (val: any) => val === InspectionStatus.Confirmed || val === 1 || val === '1' || val === 'Confirmed';
    const isCompleted = (val: any) => val === InspectionStatus.Completed || val === 3 || val === '3' || val === 'Completed';
    const isCanceled = (val: any) => val === InspectionStatus.Cancelled || val === 2 || val === '2' || val === 'Cancelled' || val === 'Canceled' || val === InspectionStatus.Declined || val === 4 || val === '4' || val === 'Declined';

    const filteredInspections = inspections.filter(inspection => {
        if (activeTab === "All") return true;
        if (activeTab === "Upcoming") return isConfirmed(inspection.status) || isPending(inspection.status);
        if (activeTab === "Completed") return isCompleted(inspection.status);
        if (activeTab === "Canceled") return isCanceled(inspection.status);
        return true;
    });

    const TABS = [
        { label: "All", count: inspections.length },
        { label: "Upcoming", count: inspections.filter(i => isConfirmed(i.status) || isPending(i.status)).length },
        { label: "Completed", count: inspections.filter(i => isCompleted(i.status)).length },
        { label: "Canceled", count: inspections.filter(i => isCanceled(i.status)).length }
    ];

    // Client-side pagination state for currently active filtered section
    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState("1");
    const [pageSize, setPageSize] = useState(10); // Default page size for inspections

    // Sync input field value when current page changes
    useEffect(() => {
        setInputPage(currentPage.toString());
    }, [currentPage]);

    // Reset page to 1 whenever active tab category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const totalCount = filteredInspections.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    // Slice filtered inspections for current page
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedInspections = filteredInspections.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Smoothly scroll to top of content on page change
            window.scrollTo({ top: 100, behavior: "smooth" });
        }
    };

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
                                ? "bg-primary-dark text-white border-primary-dark"
                                : "bg-[#F2F2F2] text-[#999999] border-[#F2F2F2] hover:bg-white hover:border-primary-dark/30"
                                }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Inspection List */}
                <div className="max-w-4xl">
                    {isLoading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="animate-spin text-primary-dark w-10 h-10" />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col">
                                {paginatedInspections.map((inspection, index) => (
                                    <div key={inspection.id || index} className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <InspectionListCard inspection={inspection} />
                                    </div>
                                ))}
                            </div>

                            {filteredInspections.length === 0 && (
                                <div className="py-20 text-center text-gray-400 font-bold">
                                    No inspections found for this category.
                                </div>
                            )}

                            {/* Premium Pagination Controls with Jumper Box */}
                            {filteredInspections.length > 0 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 border-t border-gray-100 pt-8 animate-in fade-in duration-300">
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        {/* Page Size Select Input */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[13px] font-bold text-gray-400">Show</span>
                                            <select
                                                value={pageSize}
                                                onChange={(e) => {
                                                    setPageSize(Number(e.target.value));
                                                    setCurrentPage(1); // Reset to page 1
                                                }}
                                                className="h-10 px-3 border border-gray-200 rounded-[10px] text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-[#002B7F] transition-all bg-white cursor-pointer hover:border-gray-300"
                                            >
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </select>
                                        </div>

                                        <p className="text-[13px] font-bold text-gray-400">
                                            Showing <span className="text-[#1A1A1A]">{startIndex + 1}</span> to{" "}
                                            <span className="text-[#1A1A1A]">
                                                {Math.min(startIndex + pageSize, totalCount)}
                                            </span>{" "}
                                            of <span className="text-[#1A1A1A]">{totalCount}</span> inspections
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Double Prev Button */}
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                                            aria-label="First page"
                                        >
                                            <ChevronsLeft size={18} />
                                        </button>

                                        {/* Single Prev Button */}
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        {/* Input Jumper Box */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[13px] font-bold text-gray-400">Page</span>
                                            <input
                                                type="text"
                                                value={inputPage}
                                                disabled={totalPages <= 1}
                                                onChange={(e) => setInputPage(e.target.value.replace(/[^0-9]/g, ''))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const pageNum = parseInt(inputPage, 10);
                                                        if (pageNum >= 1 && pageNum <= totalPages) {
                                                            handlePageChange(pageNum);
                                                        } else {
                                                            setInputPage(currentPage.toString());
                                                        }
                                                    }
                                                }}
                                                onBlur={() => {
                                                    const pageNum = parseInt(inputPage, 10);
                                                    if (pageNum >= 1 && pageNum <= totalPages) {
                                                        handlePageChange(pageNum);
                                                    } else {
                                                        setInputPage(currentPage.toString());
                                                    }
                                                }}
                                                className="w-12 h-10 border border-gray-200 rounded-[10px] text-center text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-[#002B7F] transition-all bg-white disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                            />
                                            <span className="text-[13px] font-bold text-gray-400">of {totalPages}</span>
                                        </div>

                                        {/* Single Next Button */}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                                            aria-label="Next page"
                                        >
                                            <ChevronRight size={18} />
                                        </button>

                                        {/* Double Next Button */}
                                        <button
                                            onClick={() => handlePageChange(totalPages)}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                                            aria-label="Last page"
                                        >
                                            <ChevronsRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
