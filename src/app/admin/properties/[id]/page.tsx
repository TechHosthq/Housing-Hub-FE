"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import SuccessModal from "@/components/admin/SuccessModal";

export default function PropertyInformationPage() {
    const router = useRouter();
    const params = useParams();

    // Mock data for the specific property
    const [currentStatus, setCurrentStatus] = useState("Posted");
    const [showSuccess, setShowSuccess] = useState(false);

    const property = {
        id: params.id,
        title: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        owner: "John Chidima",
        postedDate: "2026-01-25",
        status: currentStatus,
        image: "/images/property-1.jpg",
        details: {
            type: "House",
            title: "Aliart House",
            description: "A Well-Maintained 3-Bedroom, 2-Bathroom Apartment In [Neighborhood/City], Featuring A Modern Kitchen, Spacious Living And Dining Areas, And Bright, Comfortable Bedrooms. The Master Includes An En-Suite Bathroom. Enjoy A Private Balcony, Secure Parking, And 24/7 Security. Conveniently Located Near Schools, Shopping, Parks, And Public Transport — Perfect For Families Or Professionals Seeking A Move-In-Ready",
            status: "Available",
            address: "Allira Street, Ikeja, Lagos",
            features: "Car Park, Generator"
        },
        pricing: {
            listingType: "Rent",
            price: "₦ 350,000"
        },
        contact: {
            name: "Priscilla Ighodaro",
            phone: "+234 00000000000",
            email: "Fhbdshlhi jjj@Gmail.Com"
        }
    };

    const isPublished = currentStatus === "Published";

    const handleToggleStatus = () => {
        const newStatus = isPublished ? "Posted" : "Published";
        const actionType = isPublished ? "Unpublished" : "Published";

        setCurrentStatus(newStatus);
        setShowSuccess(true);

        // If publishing, redirect back after a short delay (matching the modal timeout)
        if (!isPublished) {
            setTimeout(() => {
                router.push("/admin/properties");
            }, 3000);
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#0095FF] font-bold text-[16px] hover:opacity-80 transition-opacity w-fit"
            >
                <ChevronLeft size={20} />
                Back
            </button>

            <h1 className="text-[28px] font-bold text-[#1A1A1A] font-montserrat tracking-tight">
                Property Information
            </h1>

            {/* Header Card */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                {/* Thumbnail */}
                <div className="w-[120px] h-[120px] rounded-[16px] bg-gray-100 relative overflow-hidden flex-shrink-0">
                    <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[24px] font-black text-[#1A1A1A] font-montserrat tracking-tight leading-none">
                            {property.title}
                        </h2>
                        <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${currentStatus === "Posted"
                            ? "bg-[#FFF9E9] text-[#FFA800]"
                            : "bg-green-50 text-green-500"
                            }`}>
                            {currentStatus}
                        </span>
                    </div>
                    <p className="text-[17px] font-medium text-[#999999] mb-1">
                        {property.location}
                    </p>
                    <div className="flex items-center gap-4 text-[15px]">
                        <span className="font-bold text-[#1A1A1A]">
                            Owner: <span className="text-[#999999] font-medium">{property.owner}</span>
                        </span>
                        <span className="font-bold text-[#0095FF]">
                            Posted: <span className="text-[#999999] font-medium">{property.postedDate}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Property Details */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm flex flex-col gap-6">
                <h3 className="text-[20px] font-bold text-[#1A1A1A] font-montserrat">
                    Property Details
                </h3>

                <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-start pb-4 border-b border-gray-50">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Property Type</span>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">{property.details.type}</span>
                    </div>
                    <div className="flex justify-between items-start pb-4 border-b border-gray-50">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Property Title</span>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">{property.details.title}</span>
                    </div>
                    <div className="flex flex-col gap-3 pb-4 border-b border-gray-50 text-justify">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Description</span>
                        <p className="text-[14px] font-bold text-[#1A1A1A] leading-relaxed">
                            {property.details.description}
                        </p>
                    </div>
                    <div className="flex justify-between items-start pb-4 border-b border-gray-50">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Status</span>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">{property.details.status}</span>
                    </div>
                    <div className="flex justify-between items-start pb-4 border-b border-gray-50">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Address</span>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">{property.details.address}</span>
                    </div>
                    <div className="flex justify-between items-start pb-4 border-b border-gray-50">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Features</span>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">{property.details.features}</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Pictures</span>
                        <div className="flex flex-wrap gap-2">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="w-[45px] h-[45px] rounded-[6px] border border-gray-200 bg-gray-50"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm flex flex-col gap-6">
                <h3 className="text-[20px] font-bold text-[#1A1A1A] font-montserrat">
                    Pricing
                </h3>
                <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-start pb-4 border-b border-gray-50">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Listing Type</span>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">{property.pricing.listingType}</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Price (Per Year)</span>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">{property.pricing.price}</span>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-sm flex flex-col gap-6">
                <h3 className="text-[20px] font-bold text-[#1A1A1A] font-montserrat">
                    Contact
                </h3>
                <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-start pb-4 border-b border-gray-50">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Contact Name</span>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">{property.contact.name}</span>
                    </div>
                    <div className="flex justify-between items-start pb-4 border-b border-gray-50">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Phone Number</span>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">{property.contact.phone}</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-[12px] font-black text-[#B3B3B3] uppercase tracking-wider">Email Address</span>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">{property.contact.email}</span>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={handleToggleStatus}
                className="w-full py-5 bg-[#002B7F] text-white rounded-[16px] font-bold text-[16px] hover:bg-opacity-90 transition-all shadow-md mt-4"
            >
                {isPublished ? "Unpublish Property" : "Publish Property"}
            </button>

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title={isPublished ? "Property Unpublished" : "Property Published"}
                message={`The property has been successfully ${isPublished ? "unpublished" : "published"}.`}
            />
        </div>
    );
}
