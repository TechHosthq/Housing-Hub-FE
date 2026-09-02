"use client";

import { Check, MapPin, ChevronDown, Loader2, Bed, ShowerHead } from "lucide-react";
import { useProperty } from "@/hooks/useProperty";
import { decodePropertyFeatures } from "@/lib/propertyFeatures";

interface PropertyInfoProps {
    propertyId: string;
    property: {
        title: string;
        price: string;
        location: string;
        description?: string;
        /** Bitmask from the API — see lib/propertyFeatures. */
        features?: number;
        /** Null when the owner never stated a count — render nothing, not zero. */
        bedrooms?: number | null;
        bathrooms?: number | null;
    };
}

export default function PropertyInfo({ propertyId, property }: PropertyInfoProps) {
    const amenities = decodePropertyFeatures(property.features);

    const roomCounts = [
        property.bedrooms != null
            ? { key: "bedrooms", Icon: Bed, label: `${property.bedrooms} ${property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}` }
            : null,
        property.bathrooms != null
            ? { key: "bathrooms", Icon: ShowerHead, label: `${property.bathrooms} ${property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}` }
            : null,
    ].filter((entry): entry is { key: string; Icon: typeof Bed; label: string } => entry !== null);
    const { usePropertyAddress } = useProperty();
    const { data: addressResponse, isLoading } = usePropertyAddress(propertyId);
    
    const apiAddress = addressResponse?.isSuccessful ? addressResponse.data : null;
    const hasValidAddress = apiAddress && apiAddress.place && apiAddress.city;

    const mapQuery = hasValidAddress
        ? [apiAddress.place, apiAddress.city, apiAddress.state].filter(Boolean).join(", ")
        : property.location;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-[20px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat">{property.title || "Untitled Property"}</h1>
                    <div className="text-[11px] text-[#999999] dark:text-gray-500 mt-1 flex items-center gap-1">
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

            {/*
                Bedroom and bathroom counts, when the owner stated them. This section
                and the amenity chips below it used to be one hardcoded list that
                rendered "4 Bedrooms" and "3 Bathrooms" on every listing regardless of
                the property, alongside amenities it did not have.
            */}
            {roomCounts.length > 0 && (
                <div className="flex flex-wrap gap-2.5">
                    {roomCounts.map(({ key, Icon, label }) => (
                        <div
                            key={key}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-[#F2F2F2] dark:border-gray-800 shadow-sm"
                        >
                            <Icon size={14} className="text-[#0095FF]" />
                            <span className="text-[10px] font-bold text-[#333333] dark:text-gray-300">{label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Amenities Cards */}
            {/*
                Driven by the property's own feature bitmask. This used to render a
                fixed list — bedroom and bathroom counts the API does not store, plus
                "Internet", "Parking" and "Prepaid meter" — on every listing, so the
                amenities shown bore no relation to the actual property.
            */}
            {amenities.length > 0 && (
                <div className="flex flex-wrap gap-2.5">
                    {amenities.map((label) => (
                        <div
                            key={label}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-[#F2F2F2] dark:border-gray-800 shadow-sm"
                        >
                            <Check size={14} className="text-[#0095FF]" />
                            <span className="text-[10px] font-bold text-[#333333] dark:text-gray-300">{label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Description */}
            <div className="space-y-3">
                <h3 className="text-[14px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat">Description</h3>
                <p className="text-[11px] text-[#666666] dark:text-gray-400 leading-relaxed">
                    {property.description || "Beautiful and spacious 4-bedroom detached duplex in the serene environment of Lekki Phase 1. This property features modern finishes, ample natural lighting, and a well-designed layout perfect for families. The compound is fully secured with 24/7 security, paved roads, and close proximity to schools, shopping centers, and major roads."}
                </p>
            </div>

            {/* Address Breakdown */}
            {!isLoading && apiAddress && (
                <div className="space-y-3 bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-[22px] border border-gray-100 dark:border-gray-800">
                    <h3 className="text-[14px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat">Address Breakdown</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Place</p>
                            <p className="text-[13px] font-bold text-[#1A1A1A] dark:text-gray-100">{apiAddress.place || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">City</p>
                            <p className="text-[13px] font-bold text-[#1A1A1A] dark:text-gray-100">{apiAddress.city || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">State</p>
                            <p className="text-[13px] font-bold text-[#1A1A1A] dark:text-gray-100">{apiAddress.state || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Postal Code</p>
                            <p className="text-[13px] font-bold text-[#1A1A1A] dark:text-gray-100">{apiAddress.postalCode || "N/A"}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Placeholder */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-[14px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat">Map</h3>
                    <ChevronDown size={16} className="text-[#666666] dark:text-gray-400" />
                </div>
                <div className="w-full h-48 rounded-[22px] overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                    {mapQuery ? (
                        <iframe
                            title="Property location"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                            className="w-full h-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                            Location not available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
