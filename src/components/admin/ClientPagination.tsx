"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface ClientPaginationProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    pageSize: number;
    setPageSize: (size: number) => void;
    totalCount: number;
    totalPages: number;
    startIndex?: number;
}

export default function ClientPagination({
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalCount,
    totalPages,
    startIndex = (currentPage - 1) * pageSize
}: ClientPaginationProps) {
    const [inputPage, setInputPage] = useState(currentPage.toString());

    useEffect(() => {
        setInputPage(currentPage.toString());
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 300, behavior: "smooth" });
        }
    };

    if (totalCount === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 border-t border-gray-100 pt-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-gray-400">Show</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
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
                    Showing <span className="text-[#1A1A1A]">{totalCount > 0 ? startIndex + 1 : 0}</span> to{" "}
                    <span className="text-[#1A1A1A]">
                        {Math.min(startIndex + pageSize, totalCount)}
                    </span>{" "}
                    of <span className="text-[#1A1A1A]">{totalCount}</span> records
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                    aria-label="First page"
                >
                    <ChevronsLeft size={18} />
                </button>

                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={18} />
                </button>

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

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Next page"
                >
                    <ChevronRight size={18} />
                </button>

                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 transition-all cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Last page"
                >
                    <ChevronsRight size={18} />
                </button>
            </div>
        </div>
    );
}
