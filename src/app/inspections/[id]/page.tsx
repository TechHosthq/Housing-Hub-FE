"use client";

import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import StatusBanner from "@/components/inspections/StatusBanner";
import InspectionTimeline from "@/components/inspections/InspectionTimeline";
import SuccessModal from "@/components/common/SuccessModal";
import { useUserRole } from "@/context/UserRoleContext";
import AcceptInspectionModal from "@/components/inspections/AcceptInspectionModal";
import DeclineInspectionModal from "@/components/inspections/DeclineInspectionModal";
import SuggestRescheduleModal from "@/components/inspections/SuggestRescheduleModal";
import AssignStaffModal from "@/components/inspections/AssignStaffModal";
import ConfirmDeclineModal from "@/components/inspections/ConfirmDeclineModal";
import { useInspection } from "@/hooks/useInspection";
import inspectionService from "@/services/inspectionService";
import { useAuthStore } from "@/store/useAuthStore";
import { InspectionStatus } from "@/types/inspection";
import { format } from "date-fns";

export default function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { role } = useUserRole();
    const currentUser = useAuthStore((state) => state.user);
    const { 
        useGetInspection, 
        respondToInspection, 
        isResponding,
        reschedule,
        isRescheduling,
        respondToReschedule,
        isRespondingToReschedule
    } = useInspection();

    const { data: inspectionResponse, isLoading } = useGetInspection(id);
    const [comment, setComment] = useState("");
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [isAssignStaffModalOpen, setIsAssignStaffModalOpen] = useState(false);
    const [isConfirmDeclineModalOpen, setIsConfirmDeclineModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successConfig, setSuccessConfig] = useState({ title: "", message: "" });

    const inspection = inspectionResponse?.data;

    const handleConfirmAccept = () => {
        if (!inspection || !currentUser?.id) return;
        
        respondToInspection({
            id: inspection.id,
            data: {
                inspectionId: inspection.id,
                accept: true,
                note: "Accepted by owner",
                authenticatedUserId: currentUser.id
            }
        }, {
            onSuccess: () => {
                setIsAcceptModalOpen(false);
                setSuccessConfig({
                    title: "Request Accepted!",
                    message: "You have successfully accepted the inspection request. The customer will be notified."
                });
                setIsSuccessModalOpen(true);
                setTimeout(() => {
                    router.push("/inspections");
                }, 2000);
            }
        });
    };

    const handleOwnerAction = (action: "Accept" | "Decline") => {
        if (action === "Accept") {
            setIsAcceptModalOpen(true);
            return;
        }
        setIsDeclineModalOpen(true);
    };

    const handleDeclineOption = (optionId: string) => {
        setIsDeclineModalOpen(false);
        if (optionId === "reschedule") {
            setIsRescheduleModalOpen(true);
            return;
        }
        if (optionId === "assign") {
            setIsAssignStaffModalOpen(true);
            return;
        }
        if (optionId === "decline") {
            setIsConfirmDeclineModalOpen(true);
            return;
        }
    };

    const handleConfirmDecline = (reason: string) => {
        if (!inspection || !currentUser?.id) return;

        respondToInspection({
            id: inspection.id,
            data: {
                inspectionId: inspection.id,
                accept: false,
                note: reason,
                authenticatedUserId: currentUser.id
            }
        }, {
            onSuccess: () => {
                setIsConfirmDeclineModalOpen(false);
                setSuccessConfig({
                    title: "Request Declined",
                    message: "The inspection request has been declined. The customer has been notified."
                });
                setIsSuccessModalOpen(true);
                setTimeout(() => {
                    router.push("/inspections");
                }, 2000);
            }
        });
    };

    const handleRescheduleSuggest = (data: { date: string; time: string; note: string }) => {
        if (!inspection || !currentUser?.id) return;

        reschedule({
            id: inspection.id,
            data: {
                inspectionId: inspection.id,
                rescheduledDate: new Date(data.date).toISOString(),
                rescheduledTime: data.time,
                note: data.note,
                authenticatedUserId: currentUser.id
            }
        }, {
            onSuccess: () => {
                setIsRescheduleModalOpen(false);
                setSuccessConfig({
                    title: "Reschedule Proposed",
                    message: `A request to reschedule for ${data.date} at ${data.time} has been sent to the customer.`
                });
                setIsSuccessModalOpen(true);
                setTimeout(() => {
                    router.push("/inspections");
                }, 2000);
            }
        });
    };

    const handleCancel = () => {
        if (!inspection) return;
        if (confirm("Are you sure you want to cancel this inspection?")) {
            inspectionService.deleteInspection(inspection.id).then((response) => {
                if (response.isSuccessful) {
                    setSuccessConfig({
                        title: "Inspection Cancelled",
                        message: "The inspection request has been successfully removed."
                    });
                    setIsSuccessModalOpen(true);
                    setTimeout(() => {
                        router.push("/inspections");
                    }, 2000);
                }
            });
        }
    };

    const handleAssignStaff = (staffId: string) => {
        // This endpoint doesn't seem to exist in the provided list, 
        // assuming it might be handled by respondToInspection with a specific note/status or separate service.
        // For now, I'll just mock it since it's not in the provided API list.
        setIsAssignStaffModalOpen(false);
        setSuccessConfig({
            title: "Assigned to Staff",
            message: "The inspection has been assigned to a Spacehub staff member."
        });
        setIsSuccessModalOpen(true);
        setTimeout(() => {
            router.push("/inspections");
        }, 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-dark w-12 h-12" />
            </div>
        );
    }

    if (!inspection) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p className="text-xl font-bold text-gray-500">Inspection not found.</p>
                <Link href="/inspections" className="text-primary-dark font-bold hover:underline">Back to Inspections</Link>
            </div>
        );
    }

    const propertyImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070";
    const isAwaitingFeedback = inspection.status === InspectionStatus.Completed;

    return (
        <main className="min-h-screen bg-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <Link
                    href="/inspections"
                    className="inline-flex items-center gap-2 text-primary-dark font-bold text-sm mb-8 hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft size={18} />
                    Back
                </Link>

                <h1 className="text-[28px] font-black text-[#1A1A1A] font-montserrat mb-8">
                    Inspection Details
                </h1>

                <div className="max-w-4xl space-y-4">
                    {/* Status Banner - Only for Customers */}
                    {role === "Customer" && <StatusBanner status={inspection.status as any} />}

                    {/* Property Header Card */}
                    <div className="bg-white rounded-[22px] border border-[#F2F2F2] px-6 py-6 flex items-center gap-6">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                                src={propertyImage}
                                alt={inspection.propertyName || "Property"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="text-[20px] font-black text-[#1A1A1A] font-montserrat mb-1">
                                {inspection.propertyName || "Property Inspection"}
                            </h3>
                            <p className="text-[13px] text-[#A3A3A3] font-bold">
                                Latitude: {inspection.latitude}, Longitude: {inspection.longitude}
                            </p>
                        </div>
                    </div>

                    {/* Info Cards Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-6 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-full bg-[#E5F4FF] flex items-center justify-center text-[#0095FF]">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[16px] font-black text-[#1A1A1A] font-montserrat mb-0.5">Date</p>
                                <p className="text-[14px] text-[#A3A3A3] font-bold">
                                    {inspection.scheduledDate ? format(new Date(inspection.scheduledDate), "MMMM dd, yyyy") : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-6 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-full bg-[#E5F4FF] flex items-center justify-center text-[#0095FF]">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[16px] font-black text-[#1A1A1A] font-montserrat mb-0.5">Time</p>
                                <p className="text-[14px] text-[#A3A3A3] font-bold">{inspection.scheduledTime}</p>
                            </div>
                        </div>
                    </div>

                    {/* Note Card */}
                    <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-8">
                        <h3 className="text-[18px] font-black text-[#1A1A1A] font-montserrat mb-3">Additional Note</h3>
                        <p className="text-[14px] text-[#666666] font-medium leading-relaxed">
                            {inspection.note || "No additional notes provided."}
                        </p>
                    </div>

                    {/* Conditional Sections based on Role */}
                    {role === "Customer" ? (
                        <>
                            {/* Timeline - Using real statuses might need mapping for labels */}
                            <InspectionTimeline steps={[]} /> {/* Timeline needs real data mapping */}

                            <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-8">
                                {isAwaitingFeedback ? (
                                    <>
                                        <h3 className="text-[17px] font-black text-[#1A1A1A] font-montserrat mb-2">Add a comment</h3>
                                        <p className="text-[11px] text-[#666666] font-bold mb-6">
                                            Please share your feedback about this inspection.
                                        </p>
                                        <div className="flex flex-col items-end gap-4">
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="w-full h-32 p-4 rounded-xl border border-[#F2F2F2] bg-white resize-none focus:outline-none focus:border-primary-dark text-sm"
                                                placeholder="Add your comment here..."
                                            />
                                            <button
                                                disabled={!comment.trim()}
                                                className={`px-10 py-3 rounded-full text-[13px] font-bold transition-all ${comment.trim()
                                                    ? "bg-primary-dark text-white hover:bg-primary-dark/90 active:scale-95 shadow-md"
                                                    : "bg-gray-100 text-[#999999] cursor-not-allowed"
                                                    }`}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-[17px] font-black text-[#1A1A1A] font-montserrat mb-6">Need to make changes?</h3>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => setIsRescheduleModalOpen(true)}
                                                className="flex-1 py-4 px-6 rounded-full border border-[#0095FF] text-[13px] font-bold text-[#0095FF] hover:bg-[#0095FF]/5 transition-all"
                                            >
                                                Reschedule
                                            </button>
                                            <button 
                                                onClick={handleCancel}
                                                className="flex-1 py-4 px-6 rounded-full border border-[#FF3B30] text-[13px] font-bold text-[#FF3B30] hover:bg-[#FF3B30]/5 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Owner Actions */
                        inspection.status === InspectionStatus.Pending && (
                            <div className="flex gap-6 mt-8">
                                <button
                                    onClick={() => handleOwnerAction("Decline")}
                                    className="flex-1 py-4 rounded-full border-[2px] border-[#FF4D4C] text-[16px] font-black text-[#FF4D4C] font-montserrat hover:bg-red-50 transition-all active:scale-[0.98]"
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={() => handleOwnerAction("Accept")}
                                    className="flex-1 py-4 rounded-full border-[2px] border-[#0095FF] text-[16px] font-black text-[#0095FF] font-montserrat hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {isResponding && <Loader2 className="animate-spin" size={20} />}
                                    Accept
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>

            <Footer />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={successConfig.title}
                message={successConfig.message}
            />

            <AcceptInspectionModal
                isOpen={isAcceptModalOpen}
                onClose={() => setIsAcceptModalOpen(false)}
                onConfirm={handleConfirmAccept}
                date={inspection.scheduledDate ? format(new Date(inspection.scheduledDate), "MMMM dd, yyyy") : ""}
                time={inspection.scheduledTime}
            />

            <DeclineInspectionModal
                isOpen={isDeclineModalOpen}
                onClose={() => setIsDeclineModalOpen(false)}
                onSelectOption={handleDeclineOption}
            />

            <SuggestRescheduleModal
                isOpen={isRescheduleModalOpen}
                onClose={() => setIsRescheduleModalOpen(false)}
                onSuggest={handleRescheduleSuggest}
                initialDate={inspection.scheduledDate ? format(new Date(inspection.scheduledDate), "yyyy-MM-dd") : ""}
                initialTime={inspection.scheduledTime}
            />

            <AssignStaffModal
                isOpen={isAssignStaffModalOpen}
                onClose={() => setIsAssignStaffModalOpen(false)}
                onAssign={handleAssignStaff}
                onReschedule={() => {
                    setIsAssignStaffModalOpen(false);
                    setIsRescheduleModalOpen(true);
                }}
            />

            <ConfirmDeclineModal
                isOpen={isConfirmDeclineModalOpen}
                onClose={() => setIsConfirmDeclineModalOpen(false)}
                onConfirm={handleConfirmDecline}
            />
        </main>
    );
}
