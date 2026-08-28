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
import ConfirmDeclineModal from "@/components/inspections/ConfirmDeclineModal";
import CancelInspectionModal from "@/components/inspections/CancelInspectionModal";
import { useInspection } from "@/hooks/useInspection";
import inspectionService from "@/services/inspectionService";
import { useAuthStore } from "@/store/useAuthStore";
import { InspectionStatus } from "@/types/inspection";
import { format } from "date-fns";
import { formatTimeTo12h } from "@/utils/dateUtils";

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
        isRespondingToReschedule,
        handOffToHousingHub
    } = useInspection();

    const { data: inspectionResponse, isLoading } = useGetInspection(id);
    const [comment, setComment] = useState("");
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [isConfirmDeclineModalOpen, setIsConfirmDeclineModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successConfig, setSuccessConfig] = useState({ title: "", message: "" });
    const [rescheduleRejectNote, setRescheduleRejectNote] = useState("");
    const [isRejectingReschedule, setIsRejectingReschedule] = useState(false);

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
            handleHandOff();
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
                rescheduledDate: data.date,
                rescheduledTime: data.time,
                note: data.note,
                authenticatedUserId: currentUser.id
            }
        }, {
            onSuccess: () => {
                setIsRescheduleModalOpen(false);
                setSuccessConfig({
                    title: "Reschedule Proposed",
                    message: `A request to reschedule for ${format(new Date(data.date + "T00:00:00"), "MMMM dd, yyyy")} at ${data.time} has been sent to the ${role === "Customer" ? "owner" : "customer"}.`
                });
                setIsSuccessModalOpen(true);
                setTimeout(() => {
                    router.push("/inspections");
                }, 2000);
            }
        });
    };

    const handleAcceptReschedule = () => {
        if (!inspection) return;
        respondToReschedule({ id: inspection.id, accept: true }, {
            onSuccess: () => {
                setSuccessConfig({
                    title: "Reschedule Confirmed",
                    message: "The new date and time have been confirmed."
                });
                setIsSuccessModalOpen(true);
            }
        });
    };

    const handleRejectReschedule = () => {
        if (!inspection) return;
        respondToReschedule({ id: inspection.id, accept: false, note: rescheduleRejectNote || undefined }, {
            onSuccess: () => {
                setIsRejectingReschedule(false);
                setRescheduleRejectNote("");
                setSuccessConfig({
                    title: "Reschedule Declined",
                    message: "The inspection has reverted to its original date and time."
                });
                setIsSuccessModalOpen(true);
            }
        });
    };

    const handleCancel = () => {
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = () => {
        if (!inspection) return;
        setIsCancelling(true);
        inspectionService.deleteInspection(inspection.id).then((response) => {
            setIsCancelling(false);
            if (response.isSuccessful) {
                setIsCancelModalOpen(false);
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
    };

    const handleHandOff = () => {
        if (!inspection) return;

        handOffToHousingHub(inspection.id, {
            onSuccess: () => {
                setSuccessConfig({
                    title: "Handed Off to HousingHub",
                    message: "A HousingHub team member will be assigned to manage this inspection shortly."
                });
                setIsSuccessModalOpen(true);
                setTimeout(() => {
                    router.push("/inspections");
                }, 2000);
            }
        });
    };

    const propertyImage = inspection?.propertyImageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070";
    const isAwaitingFeedback = inspection?.status === InspectionStatus.Completed;

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <Loader2 className="animate-spin text-primary-dark w-12 h-12" />
                    </div>
                ) : !inspection ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                        <p className="text-xl font-bold text-gray-500 dark:text-gray-500">Inspection not found.</p>
                        <Link href="/inspections" className="text-primary-dark font-bold hover:underline">Back to Inspections</Link>
                    </div>
                ) : (
                <>
                <Link
                    href="/inspections"
                    className="inline-flex items-center gap-2 text-primary-dark font-bold text-sm mb-8 hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft size={18} />
                    Back
                </Link>

                <h1 className="text-[28px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-8">
                    Inspection Details
                </h1>

                <div className="max-w-4xl space-y-4">
                    {/* Status Banner - Only for Customers */}
                    {role === "Customer" && <StatusBanner status={inspection.status as any} />}

                    {/* Property Header Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 px-6 py-6 flex items-center gap-6">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                                src={propertyImage}
                                alt={inspection.propertyName || "Property"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="text-[20px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-1">
                                {inspection.propertyName || "Property Inspection"}
                            </h3>
                            <p className="text-[13px] text-[#A3A3A3] font-bold">
                                Latitude: {inspection.latitude}, Longitude: {inspection.longitude}
                            </p>
                        </div>
                    </div>

                    {/* Info Cards Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 p-6 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-full bg-[#E5F4FF] flex items-center justify-center text-[#0095FF]">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[16px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-0.5">Date</p>
                                <p className="text-[14px] text-[#A3A3A3] font-bold">
                                    {inspection.scheduledDate ? format(new Date(inspection.scheduledDate), "MMMM dd, yyyy") : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 p-6 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-full bg-[#E5F4FF] flex items-center justify-center text-[#0095FF]">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[16px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-0.5">Time</p>
                                <p className="text-[14px] text-[#A3A3A3] font-bold">{formatTimeTo12h(inspection.scheduledTime)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Note Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 p-8">
                        <h3 className="text-[18px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-3">Additional Note</h3>
                        <p className="text-[14px] text-[#666666] dark:text-gray-400 font-medium leading-relaxed">
                            {inspection.note || "No additional notes provided."}
                        </p>
                    </div>

                    {/* Respond to a proposed reschedule — shown only to the party who
                        did NOT propose it. Both used to see Accept and Decline for a
                        date one of them had just suggested, and the server allowed it,
                        so a proposer could confirm their own new time. */}
                    {inspection.status === InspectionStatus.Rescheduled
                        && inspection.rescheduleRequestedById !== currentUser?.id && (
                        <div className="bg-[#F2F7FF] rounded-[22px] border border-[#D9E9FF] p-8">
                            <h3 className="text-[18px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-2">New Date Proposed</h3>
                            <p className="text-[14px] text-[#666666] dark:text-gray-400 font-medium leading-relaxed mb-6">
                                {inspection.rescheduledDate && format(new Date(inspection.rescheduledDate), "MMMM dd, yyyy")} at {formatTimeTo12h(inspection.rescheduledTime || undefined)}
                                {inspection.rescheduleNote && <> — &ldquo;{inspection.rescheduleNote}&rdquo;</>}
                            </p>

                            {isRejectingReschedule ? (
                                <div className="space-y-4">
                                    <textarea
                                        value={rescheduleRejectNote}
                                        onChange={(e) => setRescheduleRejectNote(e.target.value)}
                                        className="w-full h-24 p-4 rounded-xl border border-[#F2F2F2] dark:border-gray-800 bg-white dark:bg-gray-900 resize-none focus:outline-none focus:border-primary-dark text-sm"
                                        placeholder="Let them know why this time doesn't work (optional)..."
                                    />
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setIsRejectingReschedule(false)}
                                            className="flex-1 py-3 rounded-full border border-gray-200 dark:border-gray-800 text-[13px] font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleRejectReschedule}
                                            disabled={isRespondingToReschedule}
                                            className="flex-1 py-3 rounded-full bg-[#FF3B30] text-white text-[13px] font-bold hover:bg-[#FF3B30]/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isRespondingToReschedule && <Loader2 className="animate-spin" size={16} />}
                                            Confirm Decline
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsRejectingReschedule(true)}
                                        className="flex-1 py-4 rounded-full border-[2px] border-[#FF3B30] text-[15px] font-black text-[#FF3B30] font-montserrat hover:bg-red-50 transition-all active:scale-[0.98]"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={handleAcceptReschedule}
                                        disabled={isRespondingToReschedule}
                                        className="flex-1 py-4 rounded-full bg-primary-dark text-white text-[15px] font-black font-montserrat hover:bg-primary-dark/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isRespondingToReschedule && <Loader2 className="animate-spin" size={16} />}
                                        Accept New Date
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* The proposer's side of the same state. Without this the panel
                        simply vanished for them, which reads as the request having
                        been lost rather than as waiting on someone. */}
                    {inspection.status === InspectionStatus.Rescheduled
                        && inspection.rescheduleRequestedById === currentUser?.id && (
                        <div className="bg-[#FFF9EC] rounded-[22px] border border-[#FFE2A8] p-8">
                            <h3 className="text-[18px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-2">Waiting on a reply</h3>
                            <p className="text-[14px] text-[#666666] dark:text-gray-400 font-medium leading-relaxed">
                                You proposed {inspection.rescheduledDate && format(new Date(inspection.rescheduledDate), "MMMM dd, yyyy")} at {formatTimeTo12h(inspection.rescheduledTime || undefined)}.
                                We&apos;ll let you know as soon as the {role === "Customer" ? "owner" : "customer"} responds.
                            </p>
                        </div>
                    )}

                    {/* Conditional Sections based on Role */}
                    {role === "Customer" ? (
                        <>
                            {/* Timeline - Using real statuses might need mapping for labels */}
                            <InspectionTimeline steps={[]} /> {/* Timeline needs real data mapping */}

                            {inspection.propertyOwnerId && (
                                <Link
                                    href={`/messages?recipientId=${inspection.propertyOwnerId}${inspection.propertyOwnerName ? `&recipientName=${encodeURIComponent(inspection.propertyOwnerName)}` : ""}`}
                                    className="block w-full text-center py-4 rounded-full border-[2px] border-primary-dark text-[16px] font-black text-primary-dark font-montserrat hover:bg-primary-dark/5 transition-all active:scale-[0.98]"
                                >
                                    Message Owner
                                </Link>
                            )}

                            <div className="bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 p-8">
                                {isAwaitingFeedback ? (
                                    <>
                                        <h3 className="text-[17px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-2">Add a comment</h3>
                                        <p className="text-[11px] text-[#666666] dark:text-gray-400 font-bold mb-6">
                                            Please share your feedback about this inspection.
                                        </p>
                                        <div className="flex flex-col items-end gap-4">
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="w-full h-32 p-4 rounded-xl border border-[#F2F2F2] dark:border-gray-800 bg-white dark:bg-gray-900 resize-none focus:outline-none focus:border-primary-dark text-sm"
                                                placeholder="Add your comment here..."
                                            />
                                            <button
                                                disabled={!comment.trim()}
                                                className={`px-10 py-3 rounded-full text-[13px] font-bold transition-all ${comment.trim()
                                                    ? "bg-primary-dark text-white hover:bg-primary-dark/90 active:scale-95 shadow-md"
                                                    : "bg-gray-100 dark:bg-gray-800 text-[#999999] dark:text-gray-500 cursor-not-allowed"
                                                    }`}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-[17px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-6">Need to make changes?</h3>
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
                        <div className="mt-8 space-y-4">
                            <Link
                                href={`/messages?recipientId=${inspection.customerId}${inspection.customerName ? `&recipientName=${encodeURIComponent(inspection.customerName)}` : ""}`}
                                className="block w-full text-center py-4 rounded-full border-[2px] border-primary-dark text-[16px] font-black text-primary-dark font-montserrat hover:bg-primary-dark/5 transition-all active:scale-[0.98]"
                            >
                                Message Customer
                            </Link>

                            {(inspection.status === InspectionStatus.Pending || inspection.status === InspectionStatus.Confirmed) && (
                                <button
                                    onClick={() => setIsRescheduleModalOpen(true)}
                                    className="block w-full text-center py-4 rounded-full border-[2px] border-[#0095FF] text-[16px] font-black text-[#0095FF] font-montserrat hover:bg-blue-50 transition-all active:scale-[0.98]"
                                >
                                    Suggest Another Date
                                </button>
                            )}

                            {inspection.status === InspectionStatus.Pending && (
                                <div className="flex gap-6">
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
                            )}
                        </div>
                    )}
                </div>
                </>
                )}
            </div>

            <Footer />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={successConfig.title}
                message={successConfig.message}
            />

            {inspection && (
                <>
                    <AcceptInspectionModal
                        isOpen={isAcceptModalOpen}
                        onClose={() => setIsAcceptModalOpen(false)}
                        onConfirm={handleConfirmAccept}
                        date={inspection.scheduledDate ? format(new Date(inspection.scheduledDate), "MMMM dd, yyyy") : ""}
                        time={formatTimeTo12h(inspection.scheduledTime)}
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

                    <ConfirmDeclineModal
                        isOpen={isConfirmDeclineModalOpen}
                        onClose={() => setIsConfirmDeclineModalOpen(false)}
                        onConfirm={handleConfirmDecline}
                    />

                    <CancelInspectionModal
                        isOpen={isCancelModalOpen}
                        isCancelling={isCancelling}
                        onClose={() => setIsCancelModalOpen(false)}
                        onConfirm={handleConfirmCancel}
                    />
                </>
            )}
        </main>
    );
}
