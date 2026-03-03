"use client";

import { InspectionStatus } from "./InspectionListCard";

interface StatusBannerProps {
    status: InspectionStatus;
}

const statusConfigs: Record<InspectionStatus, { title: string; message: string; bgColor: string; borderColor: string; titleColor: string; textColor: string }> = {
    Confirmed: {
        title: "Your inspection has been confirmed!",
        message: "We'll send you a reminder 24 hours before your scheduled inspection.",
        bgColor: "bg-[#E6FFF0]",
        borderColor: "border-[#00CC44]",
        titleColor: "text-[#1A1A1A]",
        textColor: "text-[#666666]"
    },
    Pending: {
        title: "Awaiting confirmation",
        message: "The property owner will review and respond to your request within 24 hours.",
        bgColor: "bg-[#FFF9E6]",
        borderColor: "border-[#FFCC00]",
        titleColor: "text-[#1A1A1A]",
        textColor: "text-[#666666]"
    },
    Completed: {
        title: "Awaiting Feedback",
        message: "Your inspection visit is complete. Please add your feedback to finalize.",
        bgColor: "bg-[#F2F2F2]",
        borderColor: "border-[#E5E5E5]",
        titleColor: "text-[#1A1A1A]",
        textColor: "text-[#666666]"
    },
    Cancelled: {
        title: "Inspection cancelled",
        message: "This inspection request has been cancelled. You can schedule a new one from the property page.",
        bgColor: "bg-[#FFF2F2]",
        borderColor: "border-[#FF3B30]",
        titleColor: "text-[#1A1A1A]",
        textColor: "text-[#666666]"
    }
};

export default function StatusBanner({ status }: StatusBannerProps) {
    const config = statusConfigs[status];

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
