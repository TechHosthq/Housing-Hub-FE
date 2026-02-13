"use client";

import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import StatusBanner from "@/components/inspections/StatusBanner";
import InspectionTimeline from "@/components/inspections/InspectionTimeline";
import { InspectionStatus } from "@/components/inspections/InspectionListCard";
import SuccessModal from "@/components/common/SuccessModal";
import { useUserRole } from "@/context/UserRoleContext";
import AcceptInspectionModal from "@/components/inspections/AcceptInspectionModal";
import DeclineInspectionModal from "@/components/inspections/DeclineInspectionModal";
import SuggestRescheduleModal from "@/components/inspections/SuggestRescheduleModal";
import AssignStaffModal from "@/components/inspections/AssignStaffModal";
import ConfirmDeclineModal from "@/components/inspections/ConfirmDeclineModal";

const MOCK_INSPECTIONS = [
    {
        id: "1",
        requestId: "INS-2024-001",
        propertyName: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        date: "December 15, 2024",
        time: "10:00 AM",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070",
        status: "Confirmed" as InspectionStatus,
        requestedDate: "Dec 10, 2024",
        note: "Book an inspection at your preferred date and time. We coordinate with the homeowner for you.",
        timeline: [
            { label: "Inspection Requested", description: "You submitted an inspection request", timestamp: "Dec 10, 2024 at 2:30 PM", isCompleted: true, isCurrent: false },
            { label: "Request Confirmed", description: "You submitted an inspection request", timestamp: "Dec 10, 2024 at 2:30 PM", isCompleted: true, isCurrent: false },
            { label: "Inspection Scheduled", description: "You submitted an inspection request", isCompleted: false, isCurrent: true },
            { label: "Upcoming Inspection", description: "You submitted an inspection request", isCompleted: false, isCurrent: false }
        ]
    },
    {
        id: "3",
        requestId: "INS-2024-003",
        propertyName: "Javeele House",
        location: "Lekki Phase 1, Lagos State, Nigeria",
        date: "December 15, 2024",
        time: "10:00 AM",
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=2070",
        status: "Completed" as InspectionStatus,
        requestedDate: "Dec 10, 2024",
        note: "Book an inspection at your preferred date and time. We coordinate with the homeowner for you.",
        timeline: [
            { label: "Inspection Requested", description: "You submitted an inspection request", timestamp: "Dec 10, 2024 at 2:30 PM", isCompleted: true, isCurrent: false },
            { label: "Request Confirmed", description: "You submitted an inspection request", timestamp: "Dec 10, 2024 at 2:30 PM", isCompleted: true, isCurrent: false },
            { label: "Inspection Scheduled", description: "You submitted an inspection request", timestamp: "Dec 10, 2024 at 2:30 PM", isCompleted: true, isCurrent: false },
            { label: "Upcoming Inspection", description: "You submitted an inspection request", timestamp: "Dec 10, 2024 at 2:30 PM", isCompleted: true, isCurrent: false },
            { label: "Inspection Complete", description: "You submitted an inspection request", timestamp: "Dec 10, 2024 at 2:30 PM", isCompleted: true, isCurrent: true }
        ]
    }
];

export default function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { role } = useUserRole();
    const [comment, setComment] = useState("");
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [isAssignStaffModalOpen, setIsAssignStaffModalOpen] = useState(false);
    const [isConfirmDeclineModalOpen, setIsConfirmDeclineModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successConfig, setSuccessConfig] = useState({ title: "", message: "" });

    const inspection = MOCK_INSPECTIONS.find(i => i.id === id) || MOCK_INSPECTIONS[0];
    const isAwaitingFeedback = inspection.status === "Completed";

    const handleSubmitFeedback = () => {
        if (!comment.trim()) return;
        setSuccessConfig({
            title: "Thank You!",
            message: "Your feedback has been submitted successfully. Your inspection is now marked as complete."
        });
        setIsSuccessModalOpen(true);
        setTimeout(() => {
            router.push("/inspections");
        }, 2000);
    };

    const handleConfirmAccept = () => {
        setIsAcceptModalOpen(false);
        setSuccessConfig({
            title: "Request Accepted!",
            message: "You have successfully accepted the inspection request. The customer will be notified."
        });
        setIsSuccessModalOpen(true);
        setTimeout(() => {
            router.push("/inspections");
        }, 2000);
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

        let config = { title: "", message: "" };

        switch (optionId) {
            default:
                break;
        }

        setSuccessConfig(config);
        setIsSuccessModalOpen(true);
        setTimeout(() => {
            router.push("/inspections");
        }, 2000);
    };

    const handleConfirmDecline = (reason: string) => {
        setIsConfirmDeclineModalOpen(false);
        setSuccessConfig({
            title: "Request Declined",
            message: "The inspection request has been declined. The customer has been notified."
        });
        setIsSuccessModalOpen(true);
        setTimeout(() => {
            router.push("/inspections");
        }, 2000);
    };

    const handleAssignStaff = (staffId: string) => {
        setIsAssignStaffModalOpen(false);
        setSuccessConfig({
            title: "Assigned to Staff",
            message: "The inspection has been assigned to a Spacehub staff member. They will handle the viewing for you."
        });
        setIsSuccessModalOpen(true);
        setTimeout(() => {
            router.push("/inspections");
        }, 2000);
    };

    const handleRescheduleFromAssign = () => {
        setIsAssignStaffModalOpen(false);
        setIsRescheduleModalOpen(true);
    };

    const handleRescheduleSuggest = (data: { date: string; time: string; note: string }) => {
        setIsRescheduleModalOpen(false);
        setSuccessConfig({
            title: "Reschedule Proposed",
            message: `A request to reschedule for ${data.date} at ${data.time} has been sent to the customer.`
        });
        setIsSuccessModalOpen(true);
        setTimeout(() => {
            router.push("/inspections");
        }, 2000);
    };

    return (
        <main className="min-h-screen bg-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                {/* Back Link */}
                <Link
                    href="/inspections"
                    className="inline-flex items-center gap-2 text-[#002B7F] font-bold text-sm mb-8 hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft size={18} />
                    Back
                </Link>

                <h1 className="text-[28px] font-black text-[#1A1A1A] font-montserrat mb-8">
                    Inspection Details
                </h1>

                <div className="max-w-4xl space-y-4">
                    {/* Status Banner - Only for Customers */}
                    {role === "Customer" && <StatusBanner status={inspection.status} />}

                    {/* Property Header Card */}
                    <div className="bg-white rounded-[22px] border border-[#F2F2F2] px-6 py-6 flex items-center gap-6">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                                src={inspection.image}
                                alt={inspection.propertyName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="text-[20px] font-black text-[#1A1A1A] font-montserrat mb-1">
                                {inspection.propertyName}
                            </h3>
                            <p className="text-[13px] text-[#A3A3A3] font-bold">
                                {inspection.location}
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
                                <p className="text-[14px] text-[#A3A3A3] font-bold">{inspection.date}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-6 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-full bg-[#E5F4FF] flex items-center justify-center text-[#0095FF]">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[16px] font-black text-[#1A1A1A] font-montserrat mb-0.5">Time</p>
                                <p className="text-[14px] text-[#A3A3A3] font-bold">{inspection.time}</p>
                            </div>
                        </div>
                    </div>

                    {/* Note Card */}
                    <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-8">
                        <h3 className="text-[18px] font-black text-[#1A1A1A] font-montserrat mb-3">Additional Note</h3>
                        <p className="text-[14px] text-[#666666] font-medium leading-relaxed">
                            {inspection.note}
                        </p>
                    </div>

                    {/* Conditional Sections based on Role */}
                    {role === "Customer" ? (
                        <>
                            {/* Timeline */}
                            <InspectionTimeline steps={inspection.timeline} />

                            {/* Actions or Feedback Card */}
                            <div className="bg-white rounded-[22px] border border-[#F2F2F2] p-8">
                                {isAwaitingFeedback ? (
                                    <>
                                        <h3 className="text-[17px] font-black text-[#1A1A1A] font-montserrat mb-2">Add a comment</h3>
                                        <p className="text-[11px] text-[#666666] font-bold mb-6">
                                            Please share your feedback about this inspection to mark it as complete. Your input helps us improve our service.
                                        </p>
                                        <div className="flex flex-col items-end gap-4">
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="w-full h-32 p-4 rounded-xl border border-[#F2F2F2] bg-white resize-none focus:outline-none focus:border-[#002D6B] text-sm"
                                                placeholder="Add your comment here..."
                                            />
                                            <button
                                                onClick={handleSubmitFeedback}
                                                disabled={!comment.trim()}
                                                className={`px-10 py-3 rounded-full text-[13px] font-bold transition-all ${comment.trim()
                                                    ? "bg-[#002B7F] text-white hover:bg-[#003d8f] active:scale-95 shadow-md"
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
                                            <button className="flex-1 py-4 px-6 rounded-full border border-[#0095FF] text-[13px] font-bold text-[#0095FF] hover:bg-[#0095FF]/5 transition-all">
                                                Reschedule
                                            </button>
                                            <button className="flex-1 py-4 px-6 rounded-full border border-[#FF3B30] text-[13px] font-bold text-[#FF3B30] hover:bg-[#FF3B30]/5 transition-all">
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Owner Actions */
                        <div className="flex gap-6 mt-8">
                            <button
                                onClick={() => handleOwnerAction("Decline")}
                                className="flex-1 py-4 rounded-full border-[2px] border-[#FF4D4C] text-[16px] font-black text-[#FF4D4C] font-montserrat hover:bg-red-50 transition-all active:scale-[0.98]"
                            >
                                Decline
                            </button>
                            <button
                                onClick={() => handleOwnerAction("Accept")}
                                className="flex-1 py-4 rounded-full border-[2px] border-[#0095FF] text-[16px] font-black text-[#0095FF] font-montserrat hover:bg-blue-50 transition-all active:scale-[0.98]"
                            >
                                Accept
                            </button>
                        </div>
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
                date={inspection.date}
                time={inspection.time}
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
                initialDate={inspection.date}
                initialTime={inspection.time}
            />

            <AssignStaffModal
                isOpen={isAssignStaffModalOpen}
                onClose={() => setIsAssignStaffModalOpen(false)}
                onAssign={handleAssignStaff}
                onReschedule={handleRescheduleFromAssign}
            />

            <ConfirmDeclineModal
                isOpen={isConfirmDeclineModalOpen}
                onClose={() => setIsConfirmDeclineModalOpen(false)}
                onConfirm={handleConfirmDecline}
            />
        </main>
    );
}
