"use client";

import { Pencil, Camera, Trash2, User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function ProfileForm() {
    const [profileImg, setProfileImg] = useState<string | null>(null);

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

    return (
        <div className="flex-1 bg-white rounded-[22px] border border-[#F2F2F2] p-8 shadow-sm relative pt-12">
            {/* Top Right Pencil Icon */}
            <button
                onClick={triggerUpload}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#E9F3FF] flex items-center justify-center text-[#002D6B] hover:bg-[#002D6B] hover:text-white transition-all shadow-sm"
            >
                <Pencil size={18} />
            </button>

            <div className="flex justify-between items-start mb-10">
                <h2 className="text-[20px] font-black text-[#1A1A1A] font-montserrat">
                    Profile Information
                </h2>
            </div>

            {/* Hidden File Input */}
            <input
                id="profile-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Avatar Section */}
            <div className="flex items-center gap-10 mb-10">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-[#E9F3FF] border border-[#F2F2F2] overflow-hidden flex items-center justify-center">
                        {profileImg ? (
                            <Image
                                src={profileImg}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <User size={40} className="text-gray-300" />
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

            <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#666666] ml-2">First Name</label>
                        <input
                            type="text"
                            defaultValue="Priscian"
                            className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#002D6B] transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#666666] ml-2">Last Name</label>
                        <input
                            type="text"
                            defaultValue="Priscian"
                            className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#002D6B] transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#666666] ml-2">Email Address</label>
                    <input
                        type="email"
                        defaultValue="Priscian Priscilla"
                        className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#002D6B] transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#666666] ml-2">Phone Number</label>
                    <input
                        type="tel"
                        defaultValue="Priscian Priscilla"
                        className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#002D6B] transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#666666] ml-2">Address</label>
                    <input
                        type="text"
                        placeholder="Typing"
                        className="w-full px-6 py-4 rounded-full border border-[#F2F2F2] bg-white text-[13px] font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#002D6B] transition-all"
                    />
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        className="w-full py-4 rounded-full bg-[#002D6B] text-white text-[14px] font-bold hover:bg-[#003d8f] active:scale-[0.98] transition-all shadow-md"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
