"use client";

import { ArrowLeft, User, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RejectKYCModal from "@/components/admin/RejectKYCModal";

export default function KYCReviewPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [status, setStatus] = useState<"Pending" | "Verified" | "Rejected">("Pending");

    const handleReject = (reason: string) => {
        console.log("Rejected with reason:", reason);
        setStatus("Rejected");
        setIsRejectModalOpen(false);
        setTimeout(() => router.back(), 1500);
    };

    const handleApprove = () => {
        setStatus("Verified");
        setTimeout(() => router.back(), 1500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
            <RejectKYCModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onReject={handleReject}
            />
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#0095FF] font-bold text-[15px] hover:gap-3 transition-all w-fit"
            >
                <ArrowLeft size={20} />
                Back
            </button>

            <h1 className="text-[28px] font-bold text-[#1A1A1A] font-montserrat">KYC Review</h1>

            {/* User Summary Card */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#F2F7FF] flex items-center justify-center text-gray-400">
                        <User size={28} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-[18px] font-bold text-[#1A1A1A]">Aisha Ibrahim</h2>
                        <div className="flex items-center gap-2 text-[14px] text-gray-400 font-medium">
                            <span>aisha.i@email.com</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span>Submitted: Jan 10, 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Info Section */}
            <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm flex flex-col gap-8">
                <h3 className="text-[20px] font-bold text-[#1A1A1A] font-montserrat">Personal Info</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                First Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="Aisha"
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] font-medium text-[#1A1A1A] outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                Last Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="Ibrahim"
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] font-medium text-[#1A1A1A] outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                Sex<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="Female"
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] font-medium text-[#1A1A1A] outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                Date of Birth<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="08/17/1995"
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] font-medium text-[#1A1A1A] outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                Marital Status<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="Single"
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] font-medium text-[#1A1A1A] outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                Employment Status<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="Employed"
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] font-medium text-[#1A1A1A] outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                Address<span className="text-red-500">*</span>
                            </label>
                            <textarea
                                readOnly
                                value="24 Adeola Odeku Street, Victoria Island, Lagos State, Nigeria"
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] font-medium text-[#1A1A1A] outline-none min-h-[140px] resize-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                Annual Earning Range<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="₦2,000,000 – ₦4,000,000"
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] font-medium text-[#1A1A1A] outline-none"
                            />
                        </div>
                        <div className="mt-4 p-4 bg-[#E9F3FF] border border-[#0095FF]/20 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#0095FF]">
                                    <FileText size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-[#1A1A1A]">proof_of_address.pdf</span>
                                    <span className="text-[12px] text-gray-500 font-medium">Uploaded successfullyly</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ID Information Section */}
            <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm flex flex-col gap-8">
                <h3 className="text-[20px] font-bold text-[#1A1A1A] font-montserrat">ID Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                Document Number<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="1234567890"
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] font-medium text-[#1A1A1A] outline-none"
                            />
                            <span className="text-[12px] text-gray-400 font-medium">0/10 digits</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                                Choose Document Type<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                value="National Identification Number (NIN)"
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[15px] font-medium text-[#1A1A1A] outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider">
                            Upload Document<span className="text-red-500">*</span>
                        </label>
                        <div className="p-4 bg-[#E9F3FF] border border-[#0095FF]/20 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#0095FF]">
                                    <FileText size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-[#1A1A1A]">NIN.pdf</span>
                                    <span className="text-[12px] text-gray-500 font-medium">Uploaded successfullyly</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-6 mt-4">
                {status === "Pending" ? (
                    <>
                        <button
                            onClick={() => setIsRejectModalOpen(true)}
                            className="flex-1 py-4 border-2 border-red-500 text-red-500 rounded-xl font-bold text-[16px] hover:bg-red-50 transition-all"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleApprove}
                            className="flex-1 py-4 bg-[#002B7F] text-white rounded-xl font-bold text-[16px] hover:bg-[#001D56] transition-all flex items-center justify-center gap-2"
                        >
                            Approve
                        </button>
                    </>
                ) : (
                    <div className={`w-full py-4 rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all ${status === "Verified" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}>
                        {status === "Verified" ? (
                            <>
                                <CheckCircle2 size={20} />
                                KYC Approved Successfully
                            </>
                        ) : (
                            "KYC Rejected"
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
