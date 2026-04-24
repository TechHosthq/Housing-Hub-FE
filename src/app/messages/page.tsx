"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/profile/AccountSidebar";
import MessageList from "@/components/profile/MessageList";

export default function MessagesPage() {
    const [isChatting, setIsChatting] = useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

    const handleThreadSelect = (id: string) => {
        setSelectedThreadId(id);
        setIsChatting(true);
    };

    const handleBack = () => {
        setIsChatting(false);
        setSelectedThreadId(null);
    };

    return (
        <main className="min-h-screen bg-[#FAFAFA]">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                {/* Conditional Back Link */}
                {isChatting && (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-[#666666] text-[13px] font-bold hover:text-[#002B7F] transition-colors mb-6 group"
                    >
                        <span className="text-[18px] group-hover:-translate-x-1 transition-transform">←</span> Back
                    </button>
                )}

                <h1 className="text-[28px] font-black text-[#1A1A1A] font-montserrat mb-8">
                    My Account
                </h1>

                {/* Content area */}
                <div className="flex gap-8 items-start">
                    {/* Hide sidebar when chatting */}
                    {!isChatting && <AccountSidebar />}

                    <MessageList
                        viewMode={isChatting ? "chat" : "list"}
                        selectedId={selectedThreadId}
                        onThreadSelect={handleThreadSelect}
                    />
                </div>
            </div>

            <Footer />
        </main>
    );
}
