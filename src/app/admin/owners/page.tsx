"use client";

import { useState } from "react";
import { Search, MoreVertical, CheckCircle2, AlertCircle, Ban, User } from "lucide-react";
import Link from "next/link";
import UserActionModal from "@/components/admin/UserActionModal";
import SuccessModal from "@/components/admin/SuccessModal";
import ClientPagination from "@/components/admin/ClientPagination";

interface Owner {
    id: string;
    name: string;
    email: string;
    phone: string;
    joinedDate: string;
    status: 'Verified' | 'Pending' | 'Blocked';
    propertiesCount: number;
}

const MOCK_OWNERS: Owner[] = [
    {
        id: "1",
        name: "Adebayo Johnson",
        email: "adebayo.j@email.com",
        phone: "+234 123 456 7888",
        joinedDate: "Jan 10, 2026",
        status: "Verified",
        propertiesCount: 5
    },
    {
        id: "2",
        name: "Chidinma Okafor",
        email: "chidinma.ok@email.com",
        phone: "+234 123 456 7888",
        joinedDate: "Jan 10, 2026",
        status: "Pending",
        propertiesCount: 5
    },
    {
        id: "3",
        name: "Adebayo Johnson",
        email: "adebayo.j@email.com",
        phone: "+234 123 456 7888",
        joinedDate: "Jan 10, 2026",
        status: "Verified",
        propertiesCount: 5
    },
    {
        id: "4",
        name: "Adebayo Johnson",
        email: "adebayo.j@email.com",
        phone: "+234 123 456 7888",
        joinedDate: "Jan 10, 2026",
        status: "Verified",
        propertiesCount: 5
    },
    {
        id: "5",
        name: "Ngozi Eze",
        email: "chidinma.ok@email.com",
        phone: "+234 123 456 7888",
        joinedDate: "Jan 10, 2026",
        status: "Blocked",
        propertiesCount: 5
    }
];

export default function AdminOwnersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'block' | 'unblock';
        userId: string | null
    }>({
        isOpen: false,
        type: 'block',
        userId: null
    });
    const [owners, setOwners] = useState(MOCK_OWNERS);
    const [successModal, setSuccessModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string
    }>({
        isOpen: false,
        title: "",
        message: ""
    });

    const counts = {
        All: owners.length,
        "Pending KYC": owners.filter(o => o.status === "Pending").length,
        Verified: owners.filter(o => o.status === "Verified").length,
        Blocked: owners.filter(o => o.status === "Blocked").length,
    };

    const filteredOwners = owners.filter(owner => {
        const matchesSearch = owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            owner.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "All" ||
            (activeTab === "Pending KYC" && owner.status === "Pending") ||
            (activeTab === "Verified" && owner.status === "Verified") ||
            (activeTab === "Blocked" && owner.status === "Blocked");
        return matchesSearch && matchesTab;
    });

    const totalCount = filteredOwners.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = (pageNumber - 1) * pageSize;
    const paginatedOwners = filteredOwners.slice(startIndex, startIndex + pageSize);

    const handleUserAction = (reason: string) => {
        if (!modalConfig.userId) return;

        setOwners(prev => prev.map(o =>
            o.id === modalConfig.userId
                ? { ...o, status: modalConfig.type === 'block' ? 'Blocked' : 'Verified' }
                : o
        ));

        console.log(`${modalConfig.type === 'block' ? 'Blocked' : 'Unblocked'} owner ${modalConfig.userId} for reason: ${reason}`);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        setOpenDropdownId(null);

        // Show success modal
        setSuccessModal({
            isOpen: true,
            title: modalConfig.type === 'block' ? 'User Blocked' : 'User Unblocked',
            message: modalConfig.type === 'block' ? 'User Blocked Successfully' : 'User Unblocked Successfully'
        });
    };

    return (
        <div className="flex flex-col gap-8" onClick={() => setOpenDropdownId(null)}>
            <UserActionModal
                isOpen={modalConfig.isOpen}
                type={modalConfig.type}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onAction={handleUserAction}
            />
            <SuccessModal
                isOpen={successModal.isOpen}
                onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
                title={successModal.title}
                message={successModal.message}
            />
            <h1 className="text-[28px] font-bold text-[#1A1A1A] font-montserrat" onClick={(e) => e.stopPropagation()}>Manage Owners</h1>

            {/* Search Bar */}
            <div className="flex gap-3 w-full" onClick={(e) => e.stopPropagation()}>
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search owners..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-full text-[14px] focus:ring-2 focus:ring-[#0095FF]/10 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="bg-[#002B7F] text-white px-8 py-3.5 rounded-full font-bold text-[14px] hover:bg-[#001D56] transition-all flex items-center gap-2">
                    <Search size={18} />
                    Search
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-3" onClick={(e) => e.stopPropagation()}>
                {Object.entries(counts).map(([label, count]) => (
                    <button
                        key={label}
                        onClick={() => setActiveTab(label)}
                        className={`px-6 py-2.5 rounded-full text-[13px] font-bold transition-all ${activeTab === label
                            ? "bg-[#002B7F] text-white"
                            : "bg-[#F2F2F2] text-[#999999] hover:bg-gray-200"
                            }`}
                    >
                        {label === "All" ? `All (${count})` : `${label} (${count})`}
                    </button>
                ))}
            </div>

            {/* Owner List */}
            <div className="flex flex-col gap-4 w-full">
                {paginatedOwners.map((owner) => (
                    <div key={owner.id} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all group relative">
                        <div className="flex items-center gap-5">
                            {/* Avatar */}
                            <div className="w-14 h-14 rounded-full bg-[#F2F7FF] flex items-center justify-center text-gray-400">
                                <User size={28} strokeWidth={1.5} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col gap-1.5">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-[18px] font-bold text-[#1A1A1A] group-hover:text-[#0095FF] transition-colors">
                                        {owner.name}
                                    </h3>
                                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${owner.status === "Verified" ? "bg-[#E8F9F1] text-[#00C853]" :
                                        owner.status === "Pending" ? "bg-[#FFF9E9] text-[#FFA800]" :
                                            "bg-[#FFE9E9] text-[#FF5252]"
                                        }`}>
                                        {owner.status === "Verified" && <CheckCircle2 size={12} strokeWidth={3} />}
                                        {owner.status === "Pending" && <AlertCircle size={12} strokeWidth={3} />}
                                        {owner.status === "Blocked" && <Ban size={12} strokeWidth={3} />}
                                        {owner.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-6 text-[14px] font-medium text-gray-500">
                                    <span>{owner.email}</span>
                                    <span>{owner.phone}</span>
                                </div>

                                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-400">
                                    <span>Joined {owner.joinedDate}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <Link href={`/admin/owners/${owner.id}/properties`} className="text-[#0095FF] font-bold hover:underline">
                                        {owner.propertiesCount} properties
                                    </Link>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setOpenDropdownId(openDropdownId === owner.id ? null : owner.id)}
                                    className={`p-2 rounded-full transition-colors ${openDropdownId === owner.id ? "bg-gray-100 text-[#1A1A1A]" : "text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-50"}`}
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {openDropdownId === owner.id && (
                                    <div className="absolute top-full right-0 mt-2 w-[220px] bg-white border border-gray-100 rounded-[16px] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <button className="w-full text-left px-6 py-3 text-[15px] font-medium text-[#1A1A1A] hover:bg-gray-50 transition-colors">
                                            View Details
                                        </button>
                                        <Link
                                            href={`/admin/kyc-review/${owner.id}`}
                                            className="w-full text-left block px-6 py-3 text-[15px] font-medium text-[#1A1A1A] hover:bg-gray-50 transition-colors"
                                        >
                                            Review KYC
                                        </Link>
                                        <div className="h-[1px] bg-gray-50 my-1 mx-2" />
                                        <button
                                            onClick={() => setModalConfig({
                                                isOpen: true,
                                                type: owner.status === 'Blocked' ? 'unblock' : 'block',
                                                userId: owner.id
                                            })}
                                            className="w-full text-left px-6 py-3 text-[15px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            {owner.status === 'Blocked' ? 'Unblock Owner' : 'Block Owner'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredOwners.length === 0 && (
                    <div className="py-20 text-center text-gray-400 font-bold">
                        No owners found matching your criteria.
                    </div>
                )}

                {totalCount > 0 && (
                    <ClientPagination
                        currentPage={pageNumber}
                        setCurrentPage={setPageNumber}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        totalCount={totalCount}
                        totalPages={totalPages}
                        startIndex={startIndex}
                    />
                )}
            </div>
        </div>
    );
}
