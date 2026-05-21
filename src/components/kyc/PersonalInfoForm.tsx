"use client";

import { ArrowLeft, ChevronDown, Calendar, UploadCloud, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKYCStore } from "@/store/useKYCStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCustomer } from "@/hooks/useCustomer";

export default function PersonalInfoForm() {
    const router = useRouter();
    const { formData: storeData, updateFormData } = useKYCStore();
    const { useGetCustomer, updateProfile, isUpdatingProfile, createCustomer, isCreatingCustomer } = useCustomer();
    const user = useAuthStore(state => state.user);
    
    // Check if the customer profile already exists
    const { data: customerResponse, isLoading: isLoadingCustomer } = useGetCustomer(user?.id || null);
    const customerExists = !!customerResponse?.data;

    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: storeData.firstName || user?.firstName || "",
        lastName: storeData.lastName || user?.lastName || "",
        dateOfBirth: storeData.dateOfBirth || "",
        jobTitle: storeData.jobTitle || "",
        companyName: storeData.companyName || "",
        industry: storeData.industry || "",
    });

    useEffect(() => {
        if (customerResponse?.data && !storeData.firstName) {
            const customer = customerResponse.data;
            setFormData(prev => ({
                ...prev,
                firstName: customer.firstName || prev.firstName,
                lastName: customer.lastName || prev.lastName,
                dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : prev.dateOfBirth,
                jobTitle: customer.jobTitle || prev.jobTitle,
                companyName: customer.companyName || prev.companyName,
                industry: customer.industry || prev.industry,
            }));
        }
    }, [customerResponse, storeData.firstName]);

    const isFormValid =
        formData.firstName &&
        formData.lastName &&
        formData.dateOfBirth;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContinue = () => {
        if (!user?.id) return;
        setError("");

        const handleSuccess = (response: any) => {
            if (response.isSuccessful) {
                updateFormData(formData);
                router.push("/kyc/submit-id");
            } else {
                setError(response.message || response.errors?.[0]?.errorMessage || "Failed to save profile");
            }
        };

        const handleError = (err: any) => {
            setError(err?.response?.data?.message || err?.message || "An unexpected error occurred");
        };

        if (customerExists) {
            updateProfile({
                customerId: user.id,
                firstName: formData.firstName || null,
                lastName: formData.lastName || null,
                phoneNumber: user.phoneNumber || null,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
                jobTitle: formData.jobTitle || null,
                companyName: formData.companyName || null,
                industry: formData.industry || null
            }, {
                onSuccess: handleSuccess,
                onError: handleError
            });
        } else {
            createCustomer({
                firstName: formData.firstName || null,
                lastName: formData.lastName || null,
                email: user.email || null,
                phoneNumber: user.phoneNumber || null,
                customerType: user.customerType || 0,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
            }, {
                onSuccess: handleSuccess,
                onError: handleError
            });
        }
    };

    const isPending = isUpdatingProfile || isCreatingCustomer;

    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-[#6BB5FF] hover:text-primary-dark transition-colors font-semibold text-[11px] mb-8"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            <h1 className="text-[17px] font-black text-[#1A1A1A] font-montserrat mb-10">
                Personal Info
            </h1>

            {error && (
                <div className="px-4 py-3 mb-6 text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-2xl font-semibold">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
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
                            Date of Birth<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            Job Title
                        </label>
                        <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            placeholder="e.g. Software Engineer"
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm placeholder:text-gray-300"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            Company Name
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="e.g. Google"
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm placeholder:text-gray-300"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                            Industry
                        </label>
                        <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            placeholder="e.g. Technology"
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#002D6B] transition-colors text-sm placeholder:text-gray-300"
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={!isFormValid || isPending || isLoadingCustomer}
                            className={`w-full py-4 rounded-full font-bold text-base transition-all flex items-center justify-center gap-2 ${isFormValid && !isPending && !isLoadingCustomer
                                ? "bg-primary-dark text-white shadow-lg hover:bg-primary-dark/90"
                                : "bg-[#022352] text-[#BDBDBD] cursor-not-allowed opacity-80"
                                }`}
                        >
                            {isPending || isLoadingCustomer ? <Loader2 className="animate-spin" size={18} /> : null}
                            {isPending ? "Continuing..." : isLoadingCustomer ? "Loading..." : "Continue"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
