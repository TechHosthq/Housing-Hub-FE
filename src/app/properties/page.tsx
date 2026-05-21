"use client";

import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import ListPropertyBanner from "@/components/properties/ListPropertyBanner";
import PropertyEmptyState from "@/components/properties/PropertyEmptyState";
import OwnerPropertyCard from "@/components/properties/OwnerPropertyCard";
import { useUserRole } from "@/context/UserRoleContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useProperty } from "@/hooks/useProperty";
import { Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function OwnerPropertiesPage() {
    const { role } = useUserRole();
    const router = useRouter();
    const { useMyProperties } = useProperty();
    const { data: propertiesResponse, isLoading } = useMyProperties();

    // Client-side pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState("1");
    const [pageSize, setPageSize] = useState(20); // Dynamic page size state

    // Sync input field value when current page changes
    useEffect(() => {
        setInputPage(currentPage.toString());
    }, [currentPage]);

    // Protective check - Only Owners should see this page
    useEffect(() => {
        if (role === "Customer") {
            router.push("/dashboard");
        }
    }, [role, router]);

    if (role === "Customer") return null;

    // Robustly extract properties array supporting both raw lists and paginated structures
    const rawData = propertiesResponse?.data;
    const properties = Array.isArray(rawData)
        ? rawData
        : (rawData && Array.isArray((rawData as any).items))
            ? (rawData as any).items
            : Array.isArray(propertiesResponse)
                ? propertiesResponse
                : (propertiesResponse && Array.isArray((propertiesResponse as any).items))
                    ? (propertiesResponse as any).items
                    : [];

    // Calculate pagination values
    const totalCount = properties.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    // Reset to page 1 if the properties list size changes
    useEffect(() => {
        setCurrentPage(1);
    }, [totalCount]);

    // Slice properties for current page
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProperties = properties.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Smoothly scroll to the top of the listings section on page change
            window.scrollTo({ top: 300, behavior: "smooth" });
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-24">
                <ListPropertyBanner />

                {isLoading ? (
                    <div className="py-32 flex justify-center items-center">
                        <Loader2 className="animate-spin text-primary-dark w-12 h-12" />
                    </div>
                ) : properties.length === 0 ? (
                    <PropertyEmptyState />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                            {paginatedProperties.map((property: any) => (
                                <OwnerPropertyCard key={property.id} property={property} />
                            ))}
                        </div>

                        {/* Premium Pagination Controls with Jumper Box */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 border-t border-gray-100 pt-8 animate-in fade-in duration-300">
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
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>

                                <p className="text-[13px] font-bold text-gray-400">
                                    Showing <span className="text-[#1A1A1A]">{startIndex + 1}</span> to{" "}
                                    <span className="text-[#1A1A1A]">
                                        {Math.min(startIndex + pageSize, totalCount)}
                                    </span>{" "}
                                    of <span className="text-[#1A1A1A]">{totalCount}</span> properties
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
                    </>
                )}
            </div>

            <Footer />
        </main>
    );
}
