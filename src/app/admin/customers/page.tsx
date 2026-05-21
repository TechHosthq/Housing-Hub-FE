"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, CheckCircle2, AlertCircle, Ban, User as UserIcon, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import UserActionModal from "@/components/admin/UserActionModal";
import SuccessModal from "@/components/admin/SuccessModal";
import { useCustomer } from "@/hooks/useCustomer";
import { format } from "date-fns";

export default function AdminCustomersPage() {
    const { useAllCustomers, verifyKyc } = useCustomer();
    const [pageNumber, setPageNumber] = useState(1);
    const { data: customersResponse, isLoading } = useAllCustomers(pageNumber);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'block' | 'unblock';
        userId: string | null
    }>({
        isOpen: false,
        type: 'block',
        userId: null
    });

    const [successModal, setSuccessModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string
    }>({
        isOpen: false,
        title: "",
        message: ""
    });

    const customers = customersResponse?.data?.items || [];
    
    const counts = {
        All: customersResponse?.data?.totalCount || 0,
        "Pending KYC": customers.filter(c => !c.isKycVerified && c.kycSubmittedAt).length,
        Verified: customers.filter(c => c.isKycVerified).length,
        // Blocked: ... (Need API support for blocking)
    };

    const filteredCustomers = customers.filter(customer => {
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const status = customer.isKycVerified ? "Verified" : (customer.kycSubmittedAt ? "Pending" : "Unverified");
        
        const matchesTab = activeTab === "All" ||
            (activeTab === "Pending KYC" && status === "Pending") ||
            (activeTab === "Verified" && status === "Verified");
            
        return matchesSearch && matchesTab;
    });

    const handleUserAction = (reason: string) => {
        if (!modalConfig.userId) return;
        // In a real app, call a block/unblock API
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        setSuccessModal({
            isOpen: true,
            title: modalConfig.type === 'block' ? 'User Blocked' : 'User Unblocked',
            message: `User has been ${modalConfig.type}ed successfully.`
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
            <h1 className="text-[28px] font-bold text-[#1A1A1A] font-montserrat" onClick={(e) => e.stopPropagation()}>Manage Customers</h1>

            <div className="flex gap-3 w-full" onClick={(e) => e.stopPropagation()}>
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search customers"
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
                        {label} ({count})
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4 w-full">
                {isLoading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="animate-spin text-primary-dark w-10 h-10" />
                    </div>
                ) : filteredCustomers.map((customer) => {
                    const status = customer.isKycVerified ? "Verified" : (customer.kycSubmittedAt ? "Pending" : "Unverified");
                    return (
                        <div key={customer.id} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all group relative">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full bg-[#F2F7FF] flex items-center justify-center text-gray-400">
                                    <UserIcon size={28} strokeWidth={1.5} />
                                </div>

                                <div className="flex-1 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-[18px] font-bold text-[#1A1A1A] group-hover:text-[#0095FF] transition-colors">
                                            {customer.firstName} {customer.lastName}
                                        </h3>
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${status === "Verified" ? "bg-[#E8F9F1] text-[#00C853]" :
                                            status === "Pending" ? "bg-[#FFF9E9] text-[#FFA800]" :
                                                "bg-gray-100 text-gray-400"
                                            }`}>
                                            {status === "Verified" && <CheckCircle2 size={12} strokeWidth={3} />}
                                            {status === "Pending" && <AlertCircle size={12} strokeWidth={3} />}
                                            {status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-6 text-[14px] font-medium text-gray-500">
                                        <span>{customer.email}</span>
                                        <span>{customer.phoneNumber}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[13px] font-medium text-gray-400">
                                        <span>Joined {customer.dateCreated ? format(new Date(customer.dateCreated), "MMM dd, yyyy") : "N/A"}</span>
                                    </div>
                                </div>

                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => setOpenDropdownId(openDropdownId === customer.id ? null : customer.id)}
                                        className={`p-2 rounded-full transition-colors ${openDropdownId === customer.id ? "bg-gray-100 text-[#1A1A1A]" : "text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-50"}`}
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {openDropdownId === customer.id && (
                                        <div className="absolute top-full right-0 mt-2 w-[220px] bg-white border border-gray-100 rounded-[16px] shadow-xl py-2 z-50">
                                            <Link
                                                href={`/admin/kyc-review/${customer.id}`}
                                                className="w-full text-left block px-6 py-3 text-[15px] font-medium text-[#1A1A1A] hover:bg-gray-50 transition-colors"
                                            >
                                                Review KYC
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!isLoading && filteredCustomers.length === 0 && (
                    <div className="py-20 text-center text-gray-400 font-bold">
                        No customers found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
