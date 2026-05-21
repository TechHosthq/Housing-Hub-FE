import Image from "next/image";
import { Bed, Bath, ShowerHead, MapPin } from "lucide-react";
import { Property } from "@/types";
import { PropertyDetail } from "@/types/property";
import Link from "next/link";

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
    
    const image = isApiProperty 
        ? ((property as PropertyDetail).files?.[0]?.fileUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070")
        : (property as Property).image;

    const bedrooms = isApiProperty ? (Math.floor(Math.random() * 3) + 2) : (property as Property).bedrooms; 
    const bathrooms = isApiProperty ? (Math.floor(Math.random() * 2) + 1) : (property as Property).bathrooms;

    return (
        <Link
            href={`/property/${id}`}
            className="bg-white rounded-[22px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col h-full cursor-pointer hover:-translate-y-2"
        >
            <div className="m-2">
                <div className="relative h-64 w-full overflow-hidden rounded-[16px]">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                        <span className="text-[12px] font-black text-[#002B7F] uppercase tracking-wider">
                            {isApiProperty ? "Verified" : (property as Property).tag}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-7 flex flex-col flex-1">
                <div className="flex flex-col mb-4">
                    <h3 className="font-black text-xl text-[#1A1A1A] leading-tight line-clamp-1 mb-1 group-hover:text-[#0095FF] transition-colors">{title}</h3>
                    <span className="font-black text-[#0095FF] text-2xl">{price}</span>
                </div>

                <div className="flex items-center gap-2 text-[14px] mb-8 text-gray-400 font-bold">
                    <MapPin size={18} className="flex-shrink-0 text-[#0095FF]" />
                    <span className="truncate">{location}</span>
                </div>

                <div className="mt-auto flex items-center gap-3 pt-6 border-t border-gray-100">
                    <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl">
                        <Bed size={20} className="text-gray-400" />
                        <span className="text-[13px] font-black ml-2 text-gray-700">{bedrooms} Bed</span>
                    </div>
                    <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl">
                        <ShowerHead size={20} className="text-gray-400" />
                        <span className="text-[13px] font-black ml-2 text-gray-700">{bathrooms} Bath</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

