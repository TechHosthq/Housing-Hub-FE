import { Search, Eye, FileText, CheckCircle } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            title: "Browse & Search",
            description: "Search properties by location, price, type, and bedrooms. Filter to find exactly what you need."
        },
        {
            title: "View Property Details",
            description: "See photos, videos, features, and full address. All listings are verified through our KYC process."
        },
        {
            title: "Request Inspection",
            description: "Book an inspection at your preferred date and time. We coordinate with the homeowner for you."
        },
        {
            title: "Get Confirmed",
            description: "Receive confirmation, track inspection status, and get notified about any changes in real-time."
        }
    ];

    return (
        <section className="py-24 px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-black text-[#1A1A1A] mb-20 text-center tracking-tight">How Housing Hub Works</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Visual Graphic */}
                    <div className="relative w-full aspect-square max-w-lg mx-auto lg:mx-0">
                        <img
                            src="/images/how-it-works.png"
                            alt="How Housing Hub Works Graphic"
                            className="w-full h-full object-contain rounded-[22px]"
                        />
                    </div>

                    {/* Steps Container */}
                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-6 p-6 bg-white rounded-[17px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#3b82f6] font-bold text-2xl border border-blue-100">
                                    {index + 1}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="font-bold text-[#1A1A1A] mb-1.5 text-xl tracking-tight">{step.title}</h3>
                                    <p className="text-gray-500 font-medium text-base leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
