"use client";

import { ArrowLeft, ChevronDown, Calendar, UploadCloud, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKYCStore } from "@/store/useKYCStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCustomer } from "@/hooks/useCustomer";
import { resolveApiError } from "@/utils/errorResolver";

export default function PersonalInfoForm() {
    const router = useRouter();
    const { formData: storeData, updateFormData } = useKYCStore();
    const { useGetCustomer, updateProfile, isUpdatingProfile } = useCustomer();
    const user = useAuthStore(state => state.user);
    
    // Prefill from the existing profile. Every authenticated user has a customer
    // record — AuthService creates one on registration and on Google sign-in — so
    // there is no "create" path here, only update.
    const { data: customerResponse, isLoading: isLoadingCustomer } = useGetCustomer(user?.id || null);

    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: storeData.firstName || user?.firstName || "",
        lastName: storeData.lastName || user?.lastName || "",
        phoneNumber: storeData.phoneNumber || user?.phoneNumber || "",
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
                phoneNumber: customer.phoneNumber || prev.phoneNumber,
                dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : prev.dateOfBirth,
                jobTitle: customer.jobTitle || prev.jobTitle,
                companyName: customer.companyName || prev.companyName,
                industry: customer.industry || prev.industry,
            }));
        }
    }, [customerResponse, storeData.firstName]);

    // Phone number is required by the profile endpoint, so gate on it here rather
    // than letting the request 400 on a field the form used to not even show.
    const isFormValid =
        formData.firstName &&
        formData.lastName &&
        formData.phoneNumber &&
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
                setError(response.message || "We couldn't save those details. Please try again.");
            }
        };

        // resolveApiError rather than reading the body here: `err.message` is axios's
        // own text ("Request failed with status code 400"), which is what this form
        // used to show when the API returned a shape without a `message` field.
        const handleError = (err: any) => {
            setError(resolveApiError(err).join(" "));
        };

        updateProfile({
            customerId: user.id,
            firstName: formData.firstName || null,
            lastName: formData.lastName || null,
            phoneNumber: formData.phoneNumber || null,
            dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
            jobTitle: formData.jobTitle || null,
            companyName: formData.companyName || null,
            industry: formData.industry || null
        }, {
            onSuccess: handleSuccess,
            onError: handleError
        });
    };

    const isPending = isUpdatingProfile;

    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-[#6BB5FF] hover:text-primary-dark transition-colors font-semibold text-[11px] mb-8"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            <h1 className="text-[17px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-10">
                Personal Info
            </h1>

            {error && (
                <div className="px-4 py-3 mb-6 text-[13px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 rounded-2xl font-semibold">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] dark:text-gray-400 uppercase tracking-wider">
                            First Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter first name"
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-[#0B2545] transition-colors text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] dark:text-gray-400 uppercase tracking-wider">
                            Last Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-[#0B2545] transition-colors text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] dark:text-gray-400 uppercase tracking-wider">
                            Phone Number<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="e.g. 08012345678"
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-[#0B2545] transition-colors text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] dark:text-gray-400 uppercase tracking-wider">
                            Date of Birth<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-[#0B2545] transition-colors text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] dark:text-gray-400 uppercase tracking-wider">
                            Job Title
                        </label>
                        <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            placeholder="e.g. Software Engineer"
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-[#0B2545] transition-colors text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] dark:text-gray-400 uppercase tracking-wider">
                            Company Name
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="e.g. Google"
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-[#0B2545] transition-colors text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-[#666666] dark:text-gray-400 uppercase tracking-wider">
                            Industry
                        </label>
                        <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            placeholder="e.g. Technology"
                            className="w-full px-5 py-3 rounded-xl border border-[#E5E5E5] dark:border-gray-800 focus:outline-none focus:border-[#0B2545] transition-colors text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600"
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
