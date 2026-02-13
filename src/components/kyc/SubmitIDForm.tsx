"use client";

import { ArrowLeft, ChevronDown, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import KYCSuccessModal from "./KYCSuccessModal";

export default function SubmitIDForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        docNumber: "",
        docType: ""
    });

    const isFormValid =
        formData.docNumber.length === 10 &&
        formData.docType &&
        uploadedFile;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "docNumber" && /[^0-9]/.test(value)) return;
        if (name === "docNumber" && value.length > 10) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file.name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setShowModal(true);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
            router.push("/dashboard?kyc=submitted");
        }, 3000);
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            <KYCSuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />

            {/* Back Button */}
            <Link
                href="/kyc/personal-info"
                className="flex items-center gap-2 text-[#6BB5FF] hover:text-[#002D6B] transition-colors font-semibold text-[11px] mb-8"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            <h1 className="text-[17px] font-black text-[#1A1A1A] font-montserrat mb-14">
                Submit ID Information
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-[450px] space-y-8">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                        Document Number<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="docNumber"
                        value={formData.docNumber}
                        onChange={handleInputChange}
                        placeholder="Enter 10-digit document number"
                        className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm placeholder:text-gray-300"
                    />
                    <p className="text-[9px] text-gray-400 mt-1">{formData.docNumber.length}/10 digits</p>
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
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm appearance-none bg-white text-gray-400"
                        >
                            <option value="">Select type</option>
                            <option value="NIN">National Identity Number (NIN)</option>
                            <option value="ID_CARD">Government Issued ID Card</option>
                            <option value="PASSPORT">International Passport</option>
                            <option value="LICENSE">Driver's License</option>
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

                    {!uploadedFile ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border border-dashed border-gray-100 rounded-[22px] bg-white p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#002D6B] transition-all"
                        >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#002D6B] transition-colors">
                                <UploadCloud size={24} />
                            </div>
                            <span className="text-xs font-bold text-gray-400 mt-2">Upload Document</span>
                            <p className="text-[10px] text-gray-300 mt-1">PDF, JPG or PNG, max 8MB</p>
                        </div>
                    ) : (
                        <div className="bg-[#E9F3FF] rounded-[15px] p-6 flex items-center justify-between border border-[#E9F3FF]">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-[#1A1A1A]">{uploadedFile}</span>
                                <span className="text-[9px] text-[#666666] mt-0.5">Uploaded successfully</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setUploadedFile(null)}
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
                        disabled={!isFormValid}
                        className={`w-full py-4 rounded-full font-bold text-base transition-all ${isFormValid
                                ? "bg-[#002D6B] text-white shadow-lg hover:bg-[#001D4B]"
                                : "bg-[#022352] text-[#BDBDBD] cursor-not-allowed opacity-80"
                            }`}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
