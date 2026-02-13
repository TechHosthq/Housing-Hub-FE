import Image from "next/image";
import { Bed, Bath, MapPin } from "lucide-react";
import { Property } from "@/types";
import Link from "next/link";

export default function PropertyCard({ property }: { property: Property }) {
    return (
        <Link
            href={`/property/${property.id}`}
            className="bg-white rounded-[22px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 group flex flex-col h-full cursor-pointer"
        >
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
            </div>

            <div className="p-7 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-1 gap-2">
                    <h3 className="font-black text-xl text-[#1A1A1A] leading-tight">{property.title}</h3>
                    <span className="font-black text-[#002D6B] text-lg whitespace-nowrap">{property.price}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-base mb-8">
                    <MapPin size={18} className="flex-shrink-0 stroke-[#002D6B]" />
                    <span className="truncate font-bold opacity-70">{property.location}</span>
                </div>

                <div className="mt-auto flex items-center gap-8 pt-6 border-t border-gray-100/50">
                    <div className="flex items-center gap-2.5 text-gray-800">
                        <Bed size={22} className="text-[#002D6B] stroke-[2.5px]" />
                        <span className="text-base font-black">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-800">
                        <Bath size={22} className="text-[#002D6B] stroke-[2.5px]" />
                        <span className="text-base font-black">{property.bathrooms} Bathrooms</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
