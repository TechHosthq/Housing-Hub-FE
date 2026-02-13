"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronDown, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PropertyPublishedModal from "./PropertyPublishedModal";

const PROPERTY_TYPES = ["House", "Apartment", "Guesthouse", "Flat", "Duplex"];
const FEATURES = ["Wifi", "Car Pack", "Security Camera", "Swimming Pool", "Gym", "Generator", "Balcony"];

export default function AddPropertyForm() {
    // Navigation State
    const [step, setStep] = useState(1);

    // Step 1 State
    const [propertyType, setPropertyType] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [availability, setAvailability] = useState("Available");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("Ikeja");
    const [state, setState] = useState("Lagos");
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    // Success Modal State
    const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Step 2 State
    const [listingType, setListingType] = useState<"Sale" | "Rent">("Rent");
    const [price, setPrice] = useState("350,000");
    const [firstName, setFirstName] = useState("Priscilia");
    const [lastName, setLastName] = useState("Ighodaro");
    const [phone, setPhone] = useState("+234 000000000000");
    const [email, setEmail] = useState("fhbdshlhijjj@gmail.com");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validation
    const isStep1Valid =
        propertyType !== "" &&
        title.trim() !== "" &&
        description.trim() !== "" &&
        address.trim() !== "" &&
        city !== "" &&
        state !== "" &&
        selectedFeatures.length > 0 &&
        images.length > 0;

    const isStep2Valid =
        price.trim() !== "" &&
        firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        phone.trim() !== "";

    const toggleFeature = (feature: string) => {
        setSelectedFeatures(prev =>
            prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
        );
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 10) {
            alert("Maximum 10 images allowed");
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            const filtered = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index]);
            return filtered;
        });
    };

    const renderStep1 = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
            {/* Left Column */}
            <div className="space-y-10">
                {/* Property Type */}
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Property Type
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {PROPERTY_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => setPropertyType(type)}
                                className={`px-8 py-3.5 rounded-full border-2 font-bold text-[14px] transition-all ${propertyType === type
                                    ? "border-[#0095FF] text-[#0095FF] bg-white"
                                    : "border-gray-100 text-gray-400 hover:border-gray-200"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Property Title */}
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Property Title<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Aliart House"
                        className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] placeholder:text-gray-300"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Description<span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                        placeholder="Enter property description..."
                        rows={5}
                        className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] placeholder:text-gray-300 resize-none leading-relaxed"
                    />
                    <div className="mt-2 text-[12px] font-bold text-gray-400 text-right">
                        {description.length}/1000 characters
                    </div>
                </div>

                {/* Availability Status */}
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Availability Status<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] appearance-none bg-white cursor-pointer"
                        >
                            <option value="Available">Available</option>
                            <option value="Occupied">Occupied</option>
                            <option value="Sold">Sold</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-10">
                {/* Address */}
                <div className="space-y-4">
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Address<span className="text-red-500"> *</span>
                    </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Alirat street"
                        className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] placeholder:text-gray-300 mb-4"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] appearance-none bg-white cursor-pointer"
                            >
                                <option value="Ikeja">Ikeja</option>
                                <option value="Lekki">Lekki</option>
                                <option value="Victoria Island">Victoria Island</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                        <div className="relative">
                            <select
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] appearance-none bg-white cursor-pointer"
                            >
                                <option value="Lagos">Lagos</option>
                                <option value="Abuja">Abuja</option>
                                <option value="Ogun">Ogun</option>
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Features
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {FEATURES.map((feature) => (
                            <button
                                key={feature}
                                onClick={() => toggleFeature(feature)}
                                className={`px-6 py-3 rounded-full border-2 font-bold text-[13px] transition-all ${selectedFeatures.includes(feature)
                                    ? "border-[#0095FF] text-[#0095FF] bg-white"
                                    : "border-gray-50 text-gray-400 hover:border-gray-100"
                                    }`}
                            >
                                {feature}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pictures */}
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Pictures (Multiple)<span className="text-red-500">*</span>
                    </label>

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-2xl py-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                            <Upload size={24} className="text-gray-400" />
                        </div>
                        <span className="text-[16px] font-bold text-gray-400">Upload Images</span>
                        <p className="text-[11px] font-bold text-gray-300 mt-2 uppercase tracking-wide">
                            JPG or PNG, max 8MB (up to 10 images)
                        </p>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                    />

                    {/* Image Previews */}
                    <div className="flex flex-wrap gap-4 mt-6">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 group">
                                <Image
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(index);
                                    }}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    <X size={14} strokeWidth={3} />
                                </button>
                            </div>
                        ))}
                        {[...Array(Math.max(0, 6 - previews.length))].map((_, i) => (
                            <div key={`placeholder-${i}`} className="w-20 h-20 rounded-xl border border-gray-50 bg-gray-50/30" />
                        ))}
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className={`w-full py-5 rounded-[20px] font-black text-[18px] font-montserrat transition-all mt-10 shadow-lg ${isStep1Valid
                        ? "bg-[#002B7F] text-white hover:bg-[#001D4B] transform active:scale-[0.98]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="max-w-4xl">
            <div className="space-y-10">
                {/* Listing Type */}
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Listing Type<span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setListingType("Sale")}
                            className={`px-12 py-3.5 rounded-full border-2 font-bold text-[14px] transition-all ${listingType === "Sale"
                                ? "border-[#0095FF] text-[#0095FF] bg-white"
                                : "border-gray-100 text-gray-400 hover:border-gray-200"
                                }`}
                        >
                            Sale
                        </button>
                        <button
                            onClick={() => setListingType("Rent")}
                            className={`px-12 py-3.5 rounded-full border-2 font-bold text-[14px] transition-all ${listingType === "Rent"
                                ? "border-[#0095FF] text-[#0095FF] bg-white"
                                : "border-gray-100 text-gray-400 hover:border-gray-200"
                                }`}
                        >
                            Rent
                        </button>
                    </div>
                </div>

                {/* Price */}
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Price (Per Year)<span className="text-red-500">*</span>
                    </label>
                    <div className="relative max-w-xs">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1A1A1A] font-bold">
                            ₦
                        </div>
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="350,000"
                            className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] placeholder:text-gray-300"
                        />
                    </div>
                </div>

                {/* Contact Name */}
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Contact Name<span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                            className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] placeholder:text-gray-300"
                        />
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] placeholder:text-gray-300"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 000000000000"
                        className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] placeholder:text-gray-300"
                    />
                </div>

                {/* Email Address */}
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Email Address (Optional)
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] placeholder:text-gray-300"
                    />
                </div>

                {/* Continue to Step 3 */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={() => setStep(3)}
                        disabled={!isStep2Valid}
                        className={`w-full md:w-96 py-5 rounded-[20px] font-black text-[18px] font-montserrat transition-all shadow-lg ${isStep2Valid
                            ? "bg-[#002B7F] text-white hover:bg-[#001D4B] transform active:scale-[0.98]"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Property Details */}
                <div className="bg-white border border-gray-100 rounded-[20px] p-10 shadow-sm">
                    <h2 className="text-[24px] font-black text-[#1A1A1A] mb-8">Property Details</h2>

                    <div className="space-y-6">
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Property Type</span>
                            <span className="text-[14px] font-bold text-[#1A1A1A]">{propertyType}</span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Property Title</span>
                            <span className="text-[14px] font-bold text-[#1A1A1A] text-right">{title}</span>
                        </div>
                        <div className="space-y-3">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest block">Description</span>
                            <p className="text-[13px] font-bold text-[#1A1A1A] leading-relaxed">
                                {description}
                            </p>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                            <span className="text-[14px] font-bold text-[#1A1A1A]">{availability}</span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Address</span>
                            <span className="text-[14px] font-bold text-[#1A1A1A] text-right">{address}, {city}, {state}</span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Features</span>
                            <span className="text-[14px] font-bold text-[#1A1A1A] text-right">{selectedFeatures.join(", ")}</span>
                        </div>

                        <div className="space-y-4 pt-4">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest block">Pictures</span>
                            <div className="flex flex-wrap gap-2">
                                {previews.map((preview, index) => (
                                    <div key={index} className="w-14 h-14 rounded-lg overflow-hidden border border-gray-50 flex-shrink-0">
                                        <Image src={preview} alt="Preview" width={56} height={56} className="object-cover w-full h-full" />
                                    </div>
                                ))}
                                {[...Array(Math.max(0, 8 - previews.length))].map((_, i) => (
                                    <div key={i} className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-50 flex-shrink-0" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Pricing & Contact */}
                <div className="space-y-8">
                    {/* Pricing Card */}
                    <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm">
                        <h2 className="text-[24px] font-black text-[#1A1A1A] mb-8">Pricing</h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Listing Type</span>
                                <span className="text-[14px] font-bold text-[#1A1A1A]">{listingType}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Price (Per Year)</span>
                                <span className="text-[14px] font-black text-[#1A1A1A]">₦ {price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm">
                        <h2 className="text-[24px] font-black text-[#1A1A1A] mb-8">Contact</h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Contact Name</span>
                                <span className="text-[14px] font-bold text-[#1A1A1A]">{firstName} {lastName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Phone Number</span>
                                <span className="text-[14px] font-bold text-[#1A1A1A]">{phone}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Email Address</span>
                                <span className="text-[14px] font-bold text-[#1A1A1A] lowercase">{email || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 text-center space-y-6">
                        <p className="text-[12px] font-bold text-gray-400">
                            By clicking Publish, your property will be submitted for review.
                        </p>
                        <button
                            onClick={() => setIsPublishedModalOpen(true)}
                            className="w-full py-5 rounded-[20px] bg-[#002B7F] text-white font-black text-[18px] font-montserrat hover:bg-[#001D4B] transition-all shadow-lg transform active:scale-[0.98]"
                        >
                            Publish Property
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <PropertyPublishedModal
                isOpen={isPublishedModalOpen}
                onClose={() => {
                    setIsPublishedModalOpen(false);
                    window.location.href = "/properties";
                }}
            />
        </div>
    );

    return (
        <div className="w-full">
            {/* Back Button */}
            <button
                onClick={() => {
                    if (step === 1) window.location.href = "/properties";
                    else if (step === 2) setStep(1);
                    else setStep(2);
                }}
                className="flex items-center gap-2 text-[#0095FF] font-bold text-sm mb-8 hover:opacity-80 transition-opacity"
            >
                <ChevronLeft size={20} />
                Back
            </button>

            <h1 className="text-[32px] font-black text-[#1A1A1A] font-montserrat mb-12">
                {step === 1 ? "Step 1: Property Details" : step === 2 ? "Step 2: Pricing & Contact" : "Preview All Information"}
            </h1>

            {step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}
        </div>
    );
}
