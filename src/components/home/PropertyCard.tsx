import Image from "next/image";
import { Bed, Bath, ShowerHead, MapPin } from "lucide-react";
import { Property } from "@/types";
import Link from "next/link";

export default function PropertyCard({ property }: { property: Property }) {
    return (
        <Link
            href={`/property/${property.id}`}
            className="bg-white rounded-[22px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 group flex flex-col h-full cursor-pointer"
        >
            <div className="m-2">
            <div className="relative h-64 w-full overflow-hidden rounded-[12px]">
                <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
            </div>
            </div>

            <div className="p-7 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-1 gap-2">
                    <h3 className="font-black text-xl text-[#000000] leading-tight">{property.title}</h3>
                    <span className="font-black text-[#07358B] text-lg whitespace-nowrap">{property.price}</span>
                </div>

                <div className="flex items-center gap-2  text-base mb-8">
                    <MapPin size={18} className="flex-shrink-0 stroke-primary-dark" />
                    <span className="truncate font-bold opacity-70">{property.location}</span>
                </div>

                <div className="mt-auto flex items-center gap-2 pt-6 border-t border-gray-500/50">

                    <div className="flex items-center border rounded-[12px] p-2  border-gray-500/50">
                        <Bed size={22} className=" stroke-[2.5px]" />
                        <span className="text-base ">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center border p-2 rounded-[12px] border-gray-500/50">
                        <ShowerHead size={22} className=" stroke-[2.5px]" />
                        <span className="text-base ">{property.bathrooms} Bathrooms</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
