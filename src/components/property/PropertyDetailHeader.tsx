"use client";

import { Share2, AlertCircle } from "lucide-react";
import { useState } from "react";
import ShareModal from "./ShareModal";
import ReportModal from "./ReportModal";

export default function PropertyDetailHeader() {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <>
            <header className="flex justify-between items-center mb-10">
                <h2 className="text-[17px] font-black text-[#1A1A1A] font-montserrat">Property Details</h2>
                <div className="flex gap-4 text-[#666666]">
                    <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="hover:text-[#002D6B] transition-colors"
                    >
                        <Share2 size={18} />
                    </button>
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="hover:text-red-500 transition-colors"
                    >
                        <AlertCircle size={18} />
                    </button>
                </div>
            </header>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
            />

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />
        </>
    );
}
