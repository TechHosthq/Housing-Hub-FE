"use client";

import { ArrowLeft, ChevronDown, UploadCloud, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import KYCSuccessModal from "./KYCSuccessModal";
import { useKYCStore } from "@/store/useKYCStore";
import { useCustomer } from "@/hooks/useCustomer";
import { useAuthStore } from "@/store/useAuthStore";

export default function SubmitIDForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentUser = useAuthStore((state) => state.user);
    const { formData: storeData, clearFormData } = useKYCStore();
    const { submitKyc, isSubmittingKyc, uploadDocument, isUploadingDocument } = useCustomer();
    
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [docUrl, setDocUrl] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        docNumber: "",
        docType: "1" // 1 for NIN, etc.
    });

    const isFormValid =
        formData.docNumber.length === 11 && // NIN is usually 11
        formData.docType &&
        docUrl;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "docNumber" && /[^0-9]/.test(value)) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const response = await uploadDocument(file);
                if (response.isSuccessful) {
                    setUploadedFileName(file.name);
                    setDocUrl(response.data || "uploaded_url_placeholder");
                }
            } catch (error) {
                console.error("Upload failed", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!isFormValid || !currentUser?.id) return;

        submitKyc({
            customerId: currentUser.id,
            dateOfBirth: storeData.dateOfBirth ? new Date(storeData.dateOfBirth).toISOString() : null,
            nationalIdNumber: formData.docNumber,
            idType: parseInt(formData.docType),
            idDocumentUrl: docUrl,
            jobTitle: storeData.jobTitle || null,
            companyName: storeData.companyName || null,
            industry: storeData.industry || null,
        }, {
            onSuccess: (response) => {
                if (response.isSuccessful) {
                    setShowModal(true);
                    clearFormData();
                    setTimeout(() => {
                        router.push("/dashboard?kyc=submitted");
                    }, 3000);
                } else {
                    setError(response.message || response.errors?.[0]?.errorMessage || "Failed to submit KYC");
                }
            },
            onError: (err: any) => {
                setError(err?.response?.data?.message || err?.message || "An unexpected error occurred");
            }
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            <KYCSuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />

            <Link
                href="/kyc/personal-info"
                className="flex items-center gap-2 text-[#6BB5FF] hover:text-primary-dark transition-colors font-semibold text-[11px] mb-8"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            <h1 className="text-[17px] font-black text-[#1A1A1A] font-montserrat mb-14">
                Submit ID Information
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-[450px] space-y-8">
                {error && (
                    <div className="px-4 py-3 text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center font-semibold">
                        {error}
                    </div>
                )}
                
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                        Document Number<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="docNumber"
                        value={formData.docNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your document number"
                        className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm placeholder:text-gray-300"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                        Choose Document Type<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="docType"
                            value={formData.docType}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm appearance-none bg-white"
                        >
                            <option value="1">National Identity Number (NIN)</option>
                            <option value="2">Government Issued ID Card</option>
                            <option value="3">International Passport</option>
                            <option value="4">Driver's License</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                        Upload Document<span className="text-red-500">*</span>
                    </label>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    {isUploadingDocument ? (
                        <div className="border border-dashed border-gray-100 rounded-[22px] bg-white p-12 flex flex-col items-center justify-center">
                            <Loader2 className="animate-spin text-primary-dark" size={24} />
                            <span className="text-xs font-bold text-gray-400 mt-2">Uploading...</span>
                        </div>
                    ) : !uploadedFileName ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border border-dashed border-gray-100 rounded-[22px] bg-white p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary-dark transition-all"
                        >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 group-hover:text-primary-dark transition-colors">
                                <UploadCloud size={24} />
                            </div>
                            <span className="text-xs font-bold text-gray-400 mt-2">Upload Document</span>
                            <p className="text-[10px] text-gray-300 mt-1">PDF, JPG or PNG, max 8MB</p>
                        </div>
                    ) : (
                        <div className="bg-[#E9F3FF] rounded-[15px] p-6 flex items-center justify-between border border-[#E9F3FF]">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-[#1A1A1A]">{uploadedFileName}</span>
                                <span className="text-[9px] text-[#666666] mt-0.5">Uploaded successfully</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setUploadedFileName(null); setDocUrl(null); }}
                                className="text-[11px] font-bold text-[#0095FF] hover:underline"
                            >
                                Replace
                            </button>
                        </div>
                    )}
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmittingKyc}
                        className={`w-full py-4 rounded-full font-bold text-base transition-all flex items-center justify-center gap-2 ${isFormValid && !isSubmittingKyc
                            ? "bg-primary-dark text-white shadow-lg hover:bg-primary-dark/90"
                            : "bg-[#022352] text-[#BDBDBD] cursor-not-allowed opacity-80"
                            }`}
                    >
                        {isSubmittingKyc && <Loader2 className="animate-spin" size={18} />}
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
