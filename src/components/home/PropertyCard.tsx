import Image from "next/image";
import { Bed, Bath, ShowerHead, MapPin, Play } from "lucide-react";
import { Property } from "@/types";
import { PropertyDetail, PropertyFileType } from "@/types/property";
import Link from "next/link";
import VerifiedOwnerBadge from "@/components/common/VerifiedOwnerBadge";
import { VerificationTier } from "@/types/verification";

interface PropertyCardProps {
    property: Property | PropertyDetail;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    // Helper to extract data from either mock or real API object
    const isApiProperty = 'availability' in property;
    
    const id = property.id;
    const title = property.title || "Modern Apartment";
    const price = isApiProperty 
        ? `₦ ${(property as PropertyDetail).price > 1 ? (property as PropertyDetail).price.toLocaleString() : "Contact for price"}` 
        : (property as Property).price;
    
    const location = isApiProperty 
        ? ((property as PropertyDetail).propertyAddress?.city || (property as PropertyDetail).propertyAddress?.place || "Lagos, Nigeria") 
        : (property as Property).location;
    
    const files = isApiProperty ? (property as PropertyDetail).files : undefined;
    const coverFile = files?.find(f => f.type === PropertyFileType.Image) || files?.[0];
    const isCoverVideo = coverFile?.type === PropertyFileType.Video;
    const image = isApiProperty
        ? (coverFile?.fileUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070")
        : (property as Property).image;

    const bedrooms = isApiProperty ? (Math.floor(Math.random() * 3) + 2) : (property as Property).bedrooms;
    const bathrooms = isApiProperty ? (Math.floor(Math.random() * 2) + 1) : (property as Property).bathrooms;

    // Mock properties keep their own static tag in the image overlay.
    const showBadge = isApiProperty ? false : !!(property as Property).tag;

    // Real listings show the lister's verification tier instead.
    //
    // This replaced an overlay reading just "Verified", driven by the property-level
    // `isVerified` moderation flag. That word alone is the most dangerous copy on the
    // page: it invites a renter to read it as "this property checks out", which
    // Housing Hub has not established and cannot until title verification exists.
    //
    // One badge showing the highest tier, never one per check — see
    // VerifiedOwnerBadge. Each tier states its own limit in the tooltip.
    const ownerTier = isApiProperty
        ? (property as PropertyDetail).listingVerificationTier
        : VerificationTier.Unverified;

    return (
        <Link
            href={`/property/${id}`}
            className="bg-white dark:bg-gray-900 rounded-[22px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 group flex flex-col h-full cursor-pointer hover:-translate-y-2"
        >
            <div className="m-2">
                <div className="relative h-56 w-full overflow-hidden rounded-[16px] bg-black">
                    {isCoverVideo ? (
                        <>
                            <video
                                src={image}
                                muted
                                preload="metadata"
                                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play size={32} className="text-white" fill="white" />
                            </div>
                        </>
                    ) : (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                    )}
                    {showBadge && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                            <span className="text-[11px] font-semibold text-[#0B2545] tracking-wide">
                                {(property as Property).tag}
                            </span>
                        </div>
                    )}
                    {ownerTier >= VerificationTier.IdentityVerified && (
                        <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-1.5 py-1 shadow-sm">
                            <VerifiedOwnerBadge tier={ownerTier} className="bg-transparent dark:bg-transparent" />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-7 flex flex-col flex-1">
                <div className="flex flex-col mb-4">
                    <h3 className="font-semibold text-xl text-[#1A1A1A] dark:text-gray-100 leading-tight line-clamp-1 mb-1 group-hover:text-[#0095FF] transition-colors">{title}</h3>
                    <span className="font-bold text-[#0066CC] text-2xl">{price}</span>
                </div>

                <div className="flex items-center gap-2 text-[14px] mb-8 text-gray-400 dark:text-gray-500 font-bold">
                    <MapPin size={18} className="flex-shrink-0 text-[#0095FF]" />
                    <span className="truncate">{location}</span>
                </div>

                <div className="mt-auto flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <Bed size={18} className="text-gray-400 dark:text-gray-500" />
                        <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">{bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShowerHead size={18} className="text-gray-400 dark:text-gray-500" />
                        <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">{bathrooms} Bathrooms</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

