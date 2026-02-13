"use client";

import { CheckCircle, ShieldCheck, CalendarRange } from "lucide-react";
import Image from "next/image";

export default function WhyList() {
    const features = [
        {
            icon: <ShieldCheck className="text-blue-500" size={32} />,
            title: "Verified Buyers",
            description: "All customers go through KYC verification"
        },
        {
            icon: <CalendarRange className="text-blue-500" size={32} />,
            title: "Manage Inspections",
            description: "Accept or delegate inspection requests easily"
        },
        {
            icon: <ShieldCheck className="text-blue-500" size={32} />, // Using shield for privacy protected as well
            title: "Privacy Protected",
            description: "Book an inspection at your preferred date and time. We coordinate with the clients for you."
        }
    ];

    return (
        <section className="py-24 px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-[#1A1A1A] mb-20 text-center tracking-tight">Why List on House Hub?</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Visual Graphic */}
                    <div className="relative transform scale-x-[-1] aspect-square max-w-xl mx-auto lg:mx-0 bg-blue-50 rounded-[22px] overflow-hidden p-8">
                        <Image
                            src="/images/home-owner.svg"
                            alt="Hand holding house"
                            fill
                            className="object-contain p-8"
                        />
                    </div>

                    {/*relative aspect-square max-w-xl mx-auto lg:mx-0 bg-blue-50 rounded-[32px] overflow-hidden p-12 */}

                    {/* Features Container */}
                    <div className="space-y-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-6 p-6 bg-white rounded-[17px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                    {feature.icon}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="font-bold text-[#1A1A1A] mb-1.5 text-xl tracking-tight">{feature.title}</h3>
                                    <p className="text-gray-500 font-medium text-base leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
