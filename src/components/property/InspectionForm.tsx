"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import SuccessModal from "../common/SuccessModal";
import { useRouter } from "next/navigation";
import { useInspection } from "@/hooks/useInspection";
import { useAuthStore } from "@/store/useAuthStore";
import { formatTimeTo24h } from "@/utils/dateUtils";

interface InspectionFormProps {
    property: {
        id: string;
        title: string;
        price: string;
        location: string;
        image: string;
    };
}

export default function InspectionForm({ property }: InspectionFormProps) {
    const router = useRouter();
    const currentUser = useAuthStore((state) => state.user);
    const { createInspection, isCreatingInspection } = useInspection();
    
    const [date, setDate] = useState("2025-08-17");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser?.id) {
            router.push(`/login?redirect=/property/${property.id}/inspection`);
            return;
        }

        createInspection({
            propertyId: property.id,
            scheduledDate: date, 
            scheduledTime: formatTimeTo24h(time),
            note: note || null,
            authenticatedUserId: currentUser.id
        }, {
            onSuccess: (response) => {
                if (response.isSuccessful) {
                    setShowModal(true);
                    setTimeout(() => {
                        router.push(`/property/${property.id}`);
                    }, 3000);
                }
            }
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            <SuccessModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Inspection Request sent!"
                message="Thank you for helping us maintain quality. Our team will review your report within 24-48 hours"
            />
            <Link
                href={`/property/${property.id}`}
                className="flex items-center gap-2 text-[#6BB5FF] hover:text-primary-dark transition-colors font-semibold text-[11px] mb-8"
            >
                <ArrowLeft size={16} />
                Back
            </Link>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Form Area */}
                <div className="flex-1 bg-white rounded-[28px] border border-[#F2F2F2] p-8 shadow-sm">
                    <h2 className="text-[17px] font-black text-[#1A1A1A] font-montserrat mb-10">Request Inspection</h2>

                    <div className="flex items-center gap-6 mb-12">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                            <Image src={property.image} alt={property.title} fill className="object-cover" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-black text-[#1A1A1A] font-montserrat">{property.title}</h3>
                            <p className="text-[11px] text-[#999999] mt-0.5">{property.location}</p>
                            <p className="text-[15px] font-black text-[#0095FF] mt-1 font-montserrat">{property.price}/yr</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">SELECT DATE</label>
                                <DatePicker value={date} onChange={setDate} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">SELECT TIME</label>
                                <TimePicker value={time} onChange={setTime} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-[#666666] uppercase tracking-wider mb-2 block">ADDITIONAL NOTE</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Placeholder"
                                rows={5}
                                className="w-full px-5 py-4 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-primary-dark transition-colors text-sm placeholder:text-gray-300 resize-none font-medium"
                            ></textarea>
                        </div>

                        <div className="pt-6">
                            <button 
                                disabled={isCreatingInspection}
                                className="w-full bg-primary-dark hover:bg-primary-dark/90 text-white py-4 rounded-full text-[14px] font-bold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isCreatingInspection && <Loader2 className="animate-spin" size={18} />}
                                Request Inspection
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar Info */}
                <div className="w-full lg:max-w-[280px]">
                    <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-6 shadow-sm">
                        <h3 className="text-[14px] font-black text-[#1A1A1A] font-montserrat mb-6">Listing Information</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] text-[#666666]">Property ID</span>
                                <span className="text-[11px] font-bold text-[#333333]">SPH-12024</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] text-[#666666]">Listed Date</span>
                                <span className="text-[11px] font-bold text-[#333333]">Dec 1, 2024</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] text-[#666666]">Status</span>
                                <span className="px-2.5 py-1 rounded-lg bg-[#E9F3FF] text-[#0095FF] text-[9px] font-black uppercase">Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
