"use client";

import Link from "next/link";

export default function ListHero() {
    return (
        <section className="relative h-[385px] flex items-center justify-center pt-14 overflow-hidden">
            {/* Background with modern apartment buildings overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(7, 53, 139, 0.45), rgba(7, 53, 139, 0.45)), url("/images/hero-bg.png")',
                }}
            />

            <div className="relative z-10 text-center px-6">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight" style={{ color: "#fff" }}>
                    List Your Property
                </h1>
                <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
                    Connect with verified buyers and renters across Nigeria
                </p>
                <Link
                    href="#get-started"
                    className="bg-[#07358B] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-primary-dark/90 transition-all shadow-xl"
                >
                    Get Started
                </Link>
            </div>
        </section>
    );
}
