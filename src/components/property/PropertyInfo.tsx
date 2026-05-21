"use client";

import { Bed, Bath, Wifi, Car, Zap, MapPin, ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useProperty } from "@/hooks/useProperty";

interface PropertyInfoProps {
    propertyId: string;
    property: {
        title: string;
        price: string;
        location: string;
        bedrooms: number;
        bathrooms: number;
        description?: string;
    };
}

export default function PropertyInfo({ propertyId, property }: PropertyInfoProps) {
    const { usePropertyAddress } = useProperty();
    const { data: addressResponse, isLoading } = usePropertyAddress(propertyId);
    
    const apiAddress = addressResponse?.isSuccessful ? addressResponse.data : null;
    const hasValidAddress = apiAddress && apiAddress.place && apiAddress.city;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-[20px] font-black text-[#1A1A1A] font-montserrat">{property.title || "Untitled Property"}</h1>
                    <div className="text-[11px] text-[#999999] mt-1 flex items-center gap-1">
                        <MapPin size={12} />
                        {isLoading ? (
                            <Loader2 size={10} className="animate-spin" />
                        ) : (
                            hasValidAddress ? (
                                <span>{apiAddress.place}, {apiAddress.city}, {apiAddress.state}</span>
                            ) : (
                                <span>{property.location || "Lagos, Nigeria"}</span>
                            )
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[20px] font-black text-[#0095FF] font-montserrat">{property.price}/yr</span>
                </div>
            </div>

            {/* Amenities Cards */}
            <div className="flex flex-wrap gap-2.5">
                {[
                    { icon: <Bed size={14} />, label: `${property.bedrooms} Bedrooms` },
                    { icon: <Bath size={14} />, label: `${property.bathrooms} Bathrooms` },
                    { icon: <Wifi size={14} />, label: "Internet" },
                    { icon: <Car size={14} />, label: "Parking" },
                    { icon: <Zap size={14} />, label: "Prepaid meter" },
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#F2F2F2] shadow-sm">
                        <span className="text-[#333333]">{item.icon}</span>
                        <span className="text-[10px] font-bold text-[#333333]">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Description */}
            <div className="space-y-3">
                <h3 className="text-[14px] font-black text-[#1A1A1A] font-montserrat">Description</h3>
                <p className="text-[11px] text-[#666666] leading-relaxed">
                    {property.description || "Beautiful and spacious 4-bedroom detached duplex in the serene environment of Lekki Phase 1. This property features modern finishes, ample natural lighting, and a well-designed layout perfect for families. The compound is fully secured with 24/7 security, paved roads, and close proximity to schools, shopping centers, and major roads."}
                </p>
            </div>

            {/* Address Breakdown */}
            {!isLoading && apiAddress && (
                <div className="space-y-3 bg-gray-50/50 p-6 rounded-[22px] border border-gray-100">
                    <h3 className="text-[14px] font-black text-[#1A1A1A] font-montserrat">Address Breakdown</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Place</p>
                            <p className="text-[13px] font-bold text-[#1A1A1A]">{apiAddress.place || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City</p>
                            <p className="text-[13px] font-bold text-[#1A1A1A]">{apiAddress.city || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">State</p>
                            <p className="text-[13px] font-bold text-[#1A1A1A]">{apiAddress.state || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Postal Code</p>
                            <p className="text-[13px] font-bold text-[#1A1A1A]">{apiAddress.postalCode || "N/A"}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Placeholder */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-[14px] font-black text-[#1A1A1A] font-montserrat">Map</h3>
                    <ChevronDown size={16} className="text-[#666666]" />
                </div>
                <div className="w-full h-48 rounded-[22px] overflow-hidden relative">
                    <Image
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2074"
                        alt="Map"
                        fill
                        className="object-cover grayscale opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-primary-dark/20 animate-ping absolute" />
                        <div className="w-4 h-4 rounded-full bg-primary-dark relative shadow-lg ring-4 ring-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
