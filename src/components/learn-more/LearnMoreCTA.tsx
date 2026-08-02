"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function LearnMoreCTA() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const handleGetStarted = () => {
        router.push(isAuthenticated ? "/properties/add" : "/login");
    };

    return (
        <section className="relative py-20 px-6 bg-[#0B2545] text-center overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight" style={{ color: "#fff" }}>
                    Ready to List Your Property?
                </h2>
                <p className="text-white/90 text-lg md:text-xl mb-10 font-medium">
                    Join Housing Hub and connect with verified renters and buyers across Nigeria.
                </p>
                <button
                    onClick={handleGetStarted}
                    className="bg-white text-[#0B2545] px-8 py-3 rounded-full font-bold text-lg hover:bg-white/90 transition-all shadow-xl"
                >
                    Get Started
                </button>
            </div>
        </section>
    );
}
