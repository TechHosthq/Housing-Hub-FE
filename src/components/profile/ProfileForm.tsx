"use client";

import { Pencil, Camera, Trash2, User as UserIcon, Loader2, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCustomer } from "@/hooks/useCustomer";
import { useAuthStore } from "@/store/useAuthStore";
import SuccessModal from "@/components/common/SuccessModal";

export default function ProfileForm() {
    const currentUser = useAuthStore((state) => state.user);
    const { 
        useGetCustomer, 
        updateProfile, 
        isUpdatingProfile,
        useMyAddress,
        updateAddress,
        isUpdatingAddress
    } = useCustomer();
    
    const { data: customerResponse, isLoading: isLoadingCustomer } = useGetCustomer(currentUser?.id || null);
    const { data: addressResponse, isLoading: isLoadingAddress } = useMyAddress();
    
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        jobTitle: "",
        companyName: "",
        industry: "",
        dateOfBirth: "",
    });

    const [addressData, setAddressData] = useState({
        street: "",
        city: "",
        state: "",
        country: "Nigeria",
        postalCode: "",
    });

    useEffect(() => {
        if (customerResponse?.data) {
            const customer = customerResponse.data;
            setFormData({
                firstName: customer.firstName || "",
                lastName: customer.lastName || "",
                email: customer.email || "",
                phoneNumber: customer.phoneNumber || "",
                jobTitle: customer.jobTitle || "",
                companyName: customer.companyName || "",
                industry: customer.industry || "",
                dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth).toISOString().split('T')[0] : "",
            });
        }
    }, [customerResponse]);

    useEffect(() => {
        if (addressResponse?.data) {
            const addr = addressResponse.data;
            setAddressData({
                street: addr.street || "",
                city: addr.city || "",
                state: addr.state || "",
                country: addr.country || "Nigeria",
                postalCode: addr.postalCode || "",
            });
        }
    }, [addressResponse]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpload = () => {
        document.getElementById("profile-upload")?.click();
    };

    const handleRemoveImg = () => {
        setProfileImg(null);
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser?.id) return;

        updateProfile({
            customerId: currentUser.id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            jobTitle: formData.jobTitle,
            companyName: formData.companyName,
            industry: formData.industry,
            dateOfBirth: formData.dateOfBirth || null,
        }, {
            onSuccess: () => setShowProfileModal(true),
        });
    };

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser?.id) return;

        updateAddress({
            ...addressData,
            customerId: currentUser.id,
        }, {
            onSuccess: () => setShowAddressModal(true),
        });
    };

    if (isLoadingCustomer || isLoadingAddress) {
        return (
            <div className="flex-1 bg-white rounded-[22px] border border-[#F2F2F2] p-8 shadow-sm flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary-dark w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col gap-8">
            <SuccessModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                title="Profile Updated!"
                message="Your profile information has been saved successfully."
            />
            <SuccessModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                title="Address Saved!"
                message="Your address information has been updated successfully."
            />
            {/* Profile Info Card */}
            <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-8 shadow-sm relative pt-12">
                <button
                    onClick={triggerUpload}
                    className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#E9F3FF] flex items-center justify-center text-primary-dark hover:bg-primary-dark hover:text-white transition-all shadow-sm"
                >
                    <Pencil size={18} />
                </button>

                <div className="flex justify-between items-start mb-10">
                    <h2 className="text-[20px] font-black text-[#1A1A1A] font-montserrat">
                        Profile Information
                    </h2>
                </div>

                <input
                    id="profile-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="flex items-center gap-10 mb-10">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-[#E9F3FF] border border-[#F2F2F2] overflow-hidden flex items-center justify-center relative">
                            {profileImg ? (
                                <Image
                                    src={profileImg}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <UserIcon size={40} className="text-gray-300" />
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={triggerUpload}
                            className="px-6 py-2.5 rounded-full border border-[#0095FF] text-[#0095FF] text-[12px] font-bold hover:bg-[#0095FF]/5 transition-all"
                        >
                            Change Picture
                        </button>
                        <button
                            onClick={handleRemoveImg}
                            className="px-6 py-2.5 rounded-full border border-red-100 text-[#FF3B30] text-[12px] font-bold hover:bg-red-50 transition-all"
                        >
                            Remove Picture
                        </button>
                    </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#666666] ml-2">First Name</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-primary-dark transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#666666] ml-2">Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-primary-dark transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#666666] ml-2">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            readOnly
                            className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-gray-50 text-[13px] font-bold text-[#999999] cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#666666] ml-2">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-primary-dark transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#666666] ml-2">Job Title</label>
                            <input
                                type="text"
                                value={formData.jobTitle}
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-primary-dark transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#666666] ml-2">Industry</label>
                            <input
                                type="text"
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-primary-dark transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#666666] ml-2">Date of Birth</label>
                        <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-primary-dark transition-all"
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isUpdatingProfile}
                            className="w-full py-4 rounded-full bg-primary-dark text-white text-[14px] font-bold hover:bg-primary-dark/90 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            {isUpdatingProfile && <Loader2 className="animate-spin" size={18} />}
                            Save Profile Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Address Info Card */}
            <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-full bg-[#E9F3FF] flex items-center justify-center text-primary-dark">
                        <MapPin size={20} />
                    </div>
                    <h2 className="text-[20px] font-black text-[#1A1A1A] font-montserrat">
                        Address Information
                    </h2>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#666666] ml-2">Street Address</label>
                        <input
                            type="text"
                            value={addressData.street}
                            onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                            placeholder="e.g. 123 Luxury Lane"
                            className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-primary-dark transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#666666] ml-2">City</label>
                            <input
                                type="text"
                                value={addressData.city}
                                onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                                placeholder="e.g. Ikeja"
                                className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-primary-dark transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#666666] ml-2">State</label>
                            <input
                                type="text"
                                value={addressData.state}
                                onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                                placeholder="e.g. Lagos"
                                className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-primary-dark transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#666666] ml-2">Postal Code</label>
                            <input
                                type="text"
                                value={addressData.postalCode}
                                onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                                placeholder="e.g. 100001"
                                className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-primary-dark transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#666666] ml-2">Country</label>
                            <input
                                type="text"
                                value={addressData.country}
                                onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                                className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] focus:outline-none focus:border-primary-dark transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isUpdatingAddress}
                            className="w-full py-4 rounded-full bg-primary-dark text-white text-[14px] font-bold hover:bg-primary-dark/90 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            {isUpdatingAddress && <Loader2 className="animate-spin" size={18} />}
                            Save Address Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
