"use client";

import { Share2, AlertCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ShareModal from "./ShareModal";
import ReportModal from "./ReportModal";
import DeleteListingModal from "../properties/DeleteListingModal";
import PropertyDeletedModal from "../properties/PropertyDeletedModal";
import { useProperty } from "@/hooks/useProperty";

interface PropertyDetailHeaderProps {
    propertyId: string;
    propertyTitle: string;
    isOwner: boolean;
}

export default function PropertyDetailHeader({ propertyId, propertyTitle, isOwner }: PropertyDetailHeaderProps) {
    const router = useRouter();
    const { deleteProperty, isDeleting } = useProperty();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeletedSuccessOpen, setIsDeletedSuccessOpen] = useState(false);

    const handleDelete = () => {
        deleteProperty(propertyId, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setIsDeletedSuccessOpen(true);
            }
        });
    };

    return (
        <>
            <header className="flex justify-between items-center mb-10">
                <h2 className="text-[17px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat">Property Details</h2>
                <div className="flex gap-4 text-[#666666] dark:text-gray-400">
                    <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="hover:text-primary-dark transition-colors"
                    >
                        <Share2 size={18} />
                    </button>
                    {isOwner ? (
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            disabled={isDeleting}
                            className="hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsReportModalOpen(true)}
                            className="hover:text-red-500 transition-colors"
                        >
                            <AlertCircle size={18} />
                        </button>
                    )}
                </div>
            </header>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                propertyTitle={propertyTitle}
            />

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />

            <DeleteListingModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />

            <PropertyDeletedModal
                isOpen={isDeletedSuccessOpen}
                onClose={() => {
                    setIsDeletedSuccessOpen(false);
                    router.push("/properties");
                }}
            />
        </>
    );
}
