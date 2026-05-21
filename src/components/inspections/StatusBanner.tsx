"use client";

import { InspectionStatus } from "@/types/inspection";

interface StatusBannerProps {
    status: InspectionStatus;
}

const statusConfigs: Record<InspectionStatus, { title: string; message: string; bgColor: string; borderColor: string; titleColor: string; textColor: string }> = {
    [InspectionStatus.Confirmed]: {
        title: "Your inspection has been confirmed!",
        message: "We'll send you a reminder 24 hours before your scheduled inspection.",
        bgColor: "bg-[#E6FFF0]",
        borderColor: "border-[#00CC44]",
        titleColor: "text-[#1A1A1A]",
        textColor: "text-[#666666]"
    },
    [InspectionStatus.Pending]: {
        title: "Awaiting confirmation",
        message: "The property owner will review and respond to your request within 24 hours.",
        bgColor: "bg-[#FFF9E6]",
        borderColor: "border-[#FFCC00]",
        titleColor: "text-[#1A1A1A]",
        textColor: "text-[#666666]"
    },
    [InspectionStatus.Completed]: {
        title: "Awaiting Feedback",
        message: "Your inspection visit is complete. Please add your feedback to finalize.",
        bgColor: "bg-[#F2F2F2]",
        borderColor: "border-[#E5E5E5]",
        titleColor: "text-[#1A1A1A]",
        textColor: "text-[#666666]"
    },
    [InspectionStatus.Cancelled]: {
        title: "Inspection cancelled",
        message: "This inspection request has been cancelled. You can schedule a new one from the property page.",
        bgColor: "bg-[#FFF2F2]",
        borderColor: "border-[#FF3B30]",
        titleColor: "text-[#1A1A1A]",
        textColor: "text-[#666666]"
    },
    [InspectionStatus.Declined]: {
        title: "Inspection declined",
        message: "The owner has declined the inspection request.",
        bgColor: "bg-[#FFF2F2]",
        borderColor: "border-[#FF3B30]",
        titleColor: "text-[#1A1A1A]",
        textColor: "text-[#666666]"
    },
    [InspectionStatus.RescheduleRequested]: {
        title: "Reschedule Proposed",
        message: "A new time has been proposed for this inspection.",
        bgColor: "bg-[#F2F7FF]",
        borderColor: "border-[#0095FF]",
        titleColor: "text-[#1A1A1A]",
        textColor: "text-[#666666]"
    }
};

export default function StatusBanner({ status }: StatusBannerProps) {
    const config = statusConfigs[status] || statusConfigs[InspectionStatus.Pending];

    return (
        <div className={`${config.bgColor} border ${config.borderColor} rounded-[10px] p-6 mb-8`}>
            <h3 className={`${config.titleColor} text-[15px] font-black font-montserrat mb-1`}>
                {config.title}
            </h3>
            <p className={`${config.textColor} text-[13px] font-medium`}>
                {config.message}
            </p>
        </div>
    );
}
