"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronDown, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PropertyPublishedModal from "./PropertyPublishedModal";
import { useProperty } from "@/hooks/useProperty";
import { PropertyType, AvailabilityStatus, PropertyLeaseType } from "@/types/property";
import { useAuth } from "@/hooks/useAuth";
import { useCustomer } from "@/hooks/useCustomer";
import { useRouter } from "next/navigation";

const PROPERTY_TYPES = ["House", "Apartment", "Guesthouse", "Flat", "Duplex"];
const FEATURES = ["Wifi", "Car Pack", "Security Camera", "Swimming Pool", "Gym", "Generator", "Balcony"];

const FEATURES_MAP: Record<string, number> = {
    "Wifi": 1,
    "Car Pack": 2,
    "Security Camera": 4,
    "Swimming Pool": 8,
    "Gym": 16,
    "Generator": 32,
    "Balcony": 64
};

export default function AddPropertyForm() {
    // Navigation State
    const [step, setStep] = useState(1);
    const router = useRouter();
    const { user } = useAuth();
    const { createProperty, isCreating } = useProperty();
    const { useGetCustomer } = useCustomer();
    
    // KYC Verification Check
    const { data: customerResponse, isLoading: isLoadingCustomer } = useGetCustomer(user?.id || null);
    const isKycVerified = customerResponse?.data?.isKycVerified;

    const [showKycModal, setShowKycModal] = useState(false);

    useEffect(() => {
        if (!isLoadingCustomer && customerResponse?.data && !isKycVerified) {
            setShowKycModal(true);
        } else if (isKycVerified) {
            setShowKycModal(false);
        }
    }, [isLoadingCustomer, isKycVerified, customerResponse]);

    // Step 1 State
    const [propertyType, setPropertyType] = useState<PropertyType>(PropertyType.House);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [availability, setAvailability] = useState<AvailabilityStatus>(AvailabilityStatus.Available);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("Ikeja");
    const [state, setState] = useState("Lagos");
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    // Success Modal State
    const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Step 2 State
    const [listingType, setListingType] = useState<PropertyLeaseType>(PropertyLeaseType.Rent);
    const [price, setPrice] = useState("350000");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync names from auth if available
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setEmail(user.email || "");
            setPhone(user.phoneNumber || "");
        }
    }, [user]);

    // Validation
    const isStep1Valid =
        title.trim() !== "" &&
        description.trim() !== "" &&
        address.trim() !== "" &&
        city !== "" &&
        state !== "" &&
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

    const handlePublish = async () => {
        if (!user) {
            alert("You must be logged in to publish a property.");
            return;
        }

        const featuresValue = selectedFeatures.reduce((acc, feature) => acc | FEATURES_MAP[feature], 0);

        createProperty({
            title,
            description,
            propertyType,
            price: parseFloat(price.replace(/,/g, '')),
            availability,
            propertyLeaseType: listingType,
            features: featuresValue,
            contactPersonName: `${firstName} ${lastName}`,
            contactPersonEmail: email,
            contactPersonPhoneNumber: phone,
            ownerId: user.id,
            place: address,
            city,
            state,
            country: "Nigeria",
            postalCode: "100001",
            files: images
        }, {
            onSuccess: () => {
                setIsPublishedModalOpen(true);
            },
            onError: (error: any) => {
                alert(error?.response?.data?.message || "Failed to publish property. Please check your inputs.");
            }
        });
    };

    const renderStep1 = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
            <div className="space-y-10">
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Property Type
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {PROPERTY_TYPES.map((type, idx) => (
                            <button
                                key={type}
                                onClick={() => setPropertyType(idx as PropertyType)}
                                className={`px-8 py-3.5 rounded-full border-2 font-bold text-[14px] transition-all ${propertyType === idx
                                    ? "border-[#0095FF] text-[#0095FF] bg-white"
                                    : "border-gray-100 text-gray-400 hover:border-gray-200"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

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

                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Availability Status<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={availability}
                            onChange={(e) => setAvailability(parseInt(e.target.value) as AvailabilityStatus)}
                            className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A] appearance-none bg-white cursor-pointer"
                        >
                            <option value={AvailabilityStatus.Available}>Available</option>
                            <option value={AvailabilityStatus.Occupied}>Occupied</option>
                            <option value={AvailabilityStatus.Sold}>Sold</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                </div>
            </div>

            <div className="space-y-10">
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

                    <div className="flex flex-wrap gap-4 mt-6">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 group">
                                <Image src={preview} alt={`Preview ${index}`} fill className="object-cover" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    <X size={14} strokeWidth={3} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className={`w-full py-5 rounded-[20px] font-black text-[18px] font-montserrat transition-all mt-10 shadow-lg ${isStep1Valid
                        ? "bg-[#002B7F] text-white hover:bg-[#001D4B]"
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
                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Listing Type<span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setListingType(PropertyLeaseType.Sale)}
                            className={`px-12 py-3.5 rounded-full border-2 font-bold text-[14px] transition-all ${listingType === PropertyLeaseType.Sale
                                ? "border-[#0095FF] text-[#0095FF] bg-white"
                                : "border-gray-100 text-gray-400 hover:border-gray-200"
                                }`}
                        >
                            Sale
                        </button>
                        <button
                            onClick={() => setListingType(PropertyLeaseType.Rent)}
                            className={`px-12 py-3.5 rounded-full border-2 font-bold text-[14px] transition-all ${listingType === PropertyLeaseType.Rent
                                ? "border-[#0095FF] text-[#0095FF] bg-white"
                                : "border-gray-100 text-gray-400 hover:border-gray-200"
                                }`}
                        >
                            Rent
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Price (Per Year)<span className="text-red-500">*</span>
                    </label>
                    <div className="relative max-w-xs">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1A1A1A] font-bold">₦</div>
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="350,000"
                            className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A]"
                        />
                    </div>
                </div>

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
                            className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A]"
                        />
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A]"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[12px] font-black text-[#1A1A1A] uppercase tracking-wider mb-4">
                        Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 000000000000"
                        className="w-full px-6 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-[#0095FF] font-medium text-[#1A1A1A]"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={() => setStep(3)}
                        disabled={!isStep2Valid}
                        className={`w-full md:w-96 py-5 rounded-[20px] font-black text-[18px] font-montserrat transition-all shadow-lg ${isStep2Valid
                            ? "bg-[#002B7F] text-white hover:bg-[#001D4B]"
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
                <div className="bg-white border border-gray-100 rounded-[20px] p-10 shadow-sm">
                    <h2 className="text-[24px] font-black text-[#1A1A1A] mb-8">Property Details</h2>
                    <div className="space-y-6">
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Property Type</span>
                            <span className="text-[14px] font-bold text-[#1A1A1A]">{PROPERTY_TYPES[propertyType]}</span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Property Title</span>
                            <span className="text-[14px] font-bold text-[#1A1A1A] text-right">{title}</span>
                        </div>
                        <div className="space-y-3">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest block">Description</span>
                            <p className="text-[13px] font-bold text-[#1A1A1A] leading-relaxed">{description}</p>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Address</span>
                            <span className="text-[14px] font-bold text-[#1A1A1A] text-right">{address}, {city}, {state}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm">
                        <h2 className="text-[24px] font-black text-[#1A1A1A] mb-8">Pricing & Contact</h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Price</span>
                                <span className="text-[14px] font-black text-[#1A1A1A]">₦ {parseFloat(price).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Contact</span>
                                <span className="text-[14px] font-bold text-[#1A1A1A]">{firstName} {lastName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 text-center space-y-6">
                        <p className="text-[12px] font-bold text-gray-400">By clicking Publish, your property will be submitted for review.</p>
                        <button
                            onClick={handlePublish}
                            disabled={isCreating}
                            className="w-full py-5 rounded-[20px] bg-[#002B7F] text-white font-black text-[18px] font-montserrat hover:bg-[#001D4B] transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {isCreating ? <Loader2 className="animate-spin" /> : "Publish Property"}
                        </button>
                    </div>
                </div>
            </div>

            <PropertyPublishedModal
                isOpen={isPublishedModalOpen}
                onClose={() => { setIsPublishedModalOpen(false); window.location.href = "/properties"; }}
            />
        </div>
    );

    return (
        <div className="w-full">
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

            {showKycModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all animate-in fade-in duration-300">
                    <div className="bg-white rounded-[24px] max-w-md w-full p-8 shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                        {/* Shield Warning Icon */}
                        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h2 className="text-[22px] font-black text-[#1A1A1A] font-montserrat mb-3">
                            KYC Verification Required
                        </h2>
                        
                        <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                            To ensure platform security and trust, house owners must verify their identity before publishing property listings.
                        </p>

                        <div className="flex flex-col gap-3 w-full">
                            {/* Action 1: Complete KYC */}
                            <Link
                                href="/kyc/personal-info"
                                className="w-full py-4 rounded-xl bg-[#002B7F] hover:bg-[#001D4B] text-white font-bold text-sm transition-all text-center"
                            >
                                Complete KYC Verification
                            </Link>

                            {/* Action 2: Go back to Dashboard */}
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="w-full py-3.5 rounded-xl font-bold text-sm text-gray-400 hover:text-gray-600 transition-all text-center mt-2"
                            >
                                Cancel & Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
