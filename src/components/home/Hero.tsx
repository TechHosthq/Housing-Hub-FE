"use client";

import PropertyFilterBar from "./PropertyFilterBar";

export default function Hero() {
    return (
        <section className="relative min-h-[480px] md:h-[500px] flex items-center justify-center pt-16 pb-6 md:pb-0">
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url("/images/hero-bg.png")',
                }}
            />

            <div className="relative z-10 text-center text-white px-4 max-w-[1008px] mx-auto w-full">
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[80px] font-bold mb-3 md:mb-5 drop-shadow-2xl tracking-tight text-white leading-tight">
                    Find Homes in Nigeria
                </h1>
                <p className="text-base md:text-2xl mb-5 md:mb-10 opacity-90 drop-shadow-lg font-medium max-w-3xl mx-auto tracking-wide">
                    Browse trusted listings, book inspections, and move in faster
                </p>

                <PropertyFilterBar />
            </div>
        </section>
    );
}
