"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MoreVertical, MapPin, Eye, Clock } from "lucide-react";
import DeleteListingModal from "./DeleteListingModal";
import PropertyDeletedModal from "./PropertyDeletedModal";

interface OwnerPropertyCardProps {
    title: string;
    price: string;
    location: string;
    image: string;
    views: number;
    requests: number;
}

export default function OwnerPropertyCard({
    title,
    price,
    location,
    image,
    views,
    requests
}: OwnerPropertyCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeletedSuccessOpen, setIsDeletedSuccessOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
            {/* Image Container */}
            <div className="relative h-64 w-full">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Menu Trigger */}
                <div className="absolute top-4 right-4" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isMenuOpen
                            ? "bg-[#0095FF] text-white"
                            : "bg-white/90 backdrop-blur-sm text-[#1A1A1A] hover:bg-white"
                            } shadow-sm`}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute top-12 right-0 w-[180px] bg-white rounded-2xl shadow-xl border border-gray-50 py-2 z-50 animate-in fade-in zoom-in duration-200">
                            <button className="w-full text-left px-6 py-3 text-[14px] font-bold text-[#1A1A1A] hover:bg-gray-50 transition-colors">
                                Edit
                            </button>
                            <button className="w-full text-left px-6 py-3 text-[14px] font-bold text-[#1A1A1A] hover:bg-gray-50 transition-colors">
                                Inspection Details
                            </button>
                            <div className="h-px bg-gray-50 my-1" />
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsDeleteModalOpen(true);
                                }}
                                className="w-full text-left px-6 py-3 text-[14px] font-black text-[#FF4D4D] hover:bg-red-50 transition-colors"
                            >
                                Delete Listing
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-[16px] font-black text-[#1A1A1A] font-montserrat line-clamp-1">
                        {title}
                    </h3>
                    <div className="text-[16px] font-black text-[#002B7F] font-montserrat whitespace-nowrap">
                        ₦{price}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-gray-500 pb-1">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-[14px] font-bold">{location}</span>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                    {/* Views Stats */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full">
                        <Eye size={16} className="text-[#1A1A1A]" />
                        <span className="text-[12px] font-bold text-[#1A1A1A]">{views} views</span>
                    </div>

                    {/* Requests Stats */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full">
                        <Clock size={16} className="text-[#1A1A1A]" />
                        <span className="text-[12px] font-bold text-[#1A1A1A]">{requests} requests</span>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <DeleteListingModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    setIsDeleteModalOpen(false);
                    setIsDeletedSuccessOpen(true);
                }}
            />

            <PropertyDeletedModal
                isOpen={isDeletedSuccessOpen}
                onClose={() => setIsDeletedSuccessOpen(false)}
            />
        </div>
    );
}
