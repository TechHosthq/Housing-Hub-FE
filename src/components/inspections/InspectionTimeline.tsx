"use client";

interface TimelineStep {
    label: string;
    description: string;
    timestamp?: string;
    isCompleted: boolean;
    isCurrent: boolean;
}

interface InspectionTimelineProps {
    steps: TimelineStep[];
}

export default function InspectionTimeline({ steps }: InspectionTimelineProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 p-8">
            <h3 className="text-[17px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-8">Timeline</h3>

            <div className="space-y-0">
                {steps.map((step, index) => (
                    <div key={step.label} className="flex gap-6 relative">
                        {/* Line */}
                        {index !== steps.length - 1 && (
                            <div
                                className={`absolute left-[5px] top-[14px] w-[2px] h-full ${step.isCompleted ? "bg-primary-dark" : "bg-[#F2F2F2]"
                                    }`}
                            />
                        )}

                        {/* Dot */}
                        <div className="relative z-10 pt-1.5">
                            <div
                                className={`w-3 h-3 rounded-full border-2 ${step.isCompleted
                                    ? "bg-primary-dark border-primary-dark"
                                    : step.isCurrent
                                        ? "bg-white dark:bg-gray-900 border-primary-dark"
                                        : "bg-white dark:bg-gray-900 border-[#E5E5E5] dark:border-gray-800"
                                    }`}
                            />
                        </div>

                        {/* Content */}
                        <div className="pb-10">
                            <h4 className={`text-[14px] font-black font-montserrat mb-1 ${step.isCompleted || step.isCurrent ? "text-[#1A1A1A] dark:text-gray-100" : "text-[#999999] dark:text-gray-500"
                                }`}>
                                {step.label}
                            </h4>
                            <p className="text-[11px] font-bold text-[#999999] dark:text-gray-500 mb-1">
                                {step.description}
                            </p>
                            {step.timestamp && (
                                <p className="text-[9px] font-bold text-[#999999] dark:text-gray-500 uppercase tracking-wider">
                                    {step.timestamp}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
