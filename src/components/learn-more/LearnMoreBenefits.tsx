import { Bell } from "lucide-react";

export default function LearnMoreBenefits() {
    const benefits = [
        {
            icon: <img src="/verified.svg" alt="Verified" />,
            title: "Verified Renters & Buyers",
            description: "Every prospective renter and buyer completes KYC verification before they can request an inspection."
        },
        {
            icon: <img src="/manage.svg" alt="Manage" />,
            title: "Manage Inspections Easily",
            description: "Accept, decline, or reschedule inspection requests from a single dashboard, on your own schedule."
        },
        {
            icon: <img src="/privacy.svg" alt="Privacy" />,
            title: "Your Privacy, Protected",
            description: "Your contact details stay private until you choose to share them with a prospective tenant or buyer."
        },
        {
            icon: <Bell className="text-[#3b82f6]" size={28} />,
            title: "Real-Time Updates",
            description: "Get instant in-app notifications and emails the moment something changes with your listing."
        }
    ];

    return (
        <section className="py-24 px-8 bg-[#f8fafc] dark:bg-gray-950">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-[#1A1A1A] dark:text-gray-100 mb-16 text-center tracking-tight">Why List on Housing Hub?</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-6 p-6 bg-white dark:bg-gray-900 rounded-[17px] border border-gray-100 dark:border-gray-800 shadow-sm hover:border-[#07358B] hover:shadow-md transition-all duration-500">
                            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                {benefit.icon}
                            </div>
                            <div className="flex flex-col justify-center">
                                <h3 className="font-bold text-[#1A1A1A] dark:text-gray-100 mb-1.5 text-xl tracking-tight">{benefit.title}</h3>
                                <p className="text-gray-500 dark:text-gray-500 font-medium text-base leading-relaxed">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
