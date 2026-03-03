"use client";

import { ArrowLeft, ChevronDown, Calendar, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function PersonalInfoForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        sex: "",
        dob: "08/17/2025",
        maritalStatus: "",
        employmentStatus: "",
        address: "",
        earnings: ""
    });

    const isFormValid =
        formData.firstName &&
        formData.lastName &&
        formData.sex &&
        formData.dob &&
        formData.maritalStatus &&
        formData.employmentStatus &&
        formData.address &&
        formData.earnings &&
        uploadedFile;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file.name);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            {/* Back Button */}
            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-[#6BB5FF] hover:text-primary-dark transition-colors font-semibold text-[11px] mb-8"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            <h1 className="text-[17px] font-black text-[#1A1A1A] font-montserrat mb-14">
                Personal Info
            </h1>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            First Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter first name"
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm placeholder:text-gray-300"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            Last Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm placeholder:text-gray-300"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            Sex<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm appearance-none bg-white"
                            >
                                <option value="">Select sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            Date of Birth<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#E9F3FF] flex items-center justify-center text-primary-dark">
                                <Calendar size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            Marital Status<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm appearance-none bg-white"
                            >
                                <option value="">Select status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            Employment Status<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="employmentStatus"
                                value={formData.employmentStatus}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm appearance-none bg-white"
                            >
                                <option value="">Select status</option>
                                <option value="Employed">Employed</option>
                                <option value="Self-Employed">Self-Employed</option>
                                <option value="Unemployed">Unemployed</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            Address<span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter full address"
                            rows={4}
                            className="w-full px-5 py-4 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm placeholder:text-gray-300 resize-none"
                        ></textarea>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            Annual Earning Range<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="earnings"
                                value={formData.earnings}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm appearance-none bg-white"
                            >
                                <option value="">Select status</option>
                                <option value="Under N5,000,000">Under N5,000,000</option>
                                <option value="N5,000,000 - N10,000,000">N5,000,000 - N10,000,000</option>
                                <option value="Above N10,000,000">Above N10,000,000</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            Proof of Address<span className="text-red-500">*</span>
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
                                className="border border-dashed border-gray-100 rounded-[22px] bg-white p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary-dark transition-all"
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
                            type="button"
                            onClick={() => router.push("/kyc/submit-id")}
                            disabled={!isFormValid}
                            className={`w-full py-4 rounded-full font-bold text-base transition-all ${isFormValid
                                ? "bg-primary-dark text-white shadow-lg hover:bg-primary-dark/90"
                                : "bg-[#F2F2F2] text-[#BDBDBD] cursor-not-allowed"
                                }`}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
