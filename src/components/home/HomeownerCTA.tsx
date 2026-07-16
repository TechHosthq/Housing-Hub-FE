import Link from "next/link";

export default function HomeownerCTA() {
    return (
        <section className="relative py-22 px-4 overflow-hidden bg-[#e9f3ff] min-h-[280px] flex items-center">
            {/* Background Image positioned to the right */}
            <div
                className="absolute w-full md:w-[100%] h-[100%] z-0 pointer-events-none"
                style={{
                    backgroundImage: "url('/images/home-owner.svg')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain"
                }}
            />

            <div className="relative max-w-[1008px] mx-auto w-full z-10">
                <div className="w-full md:w-2/3 text-center md:text-left px-4">
                    <h2 className="text-5xl md:text-7xl font-bold text-[#1A1A1A] mb-4 tracking-tight leading-[1.1]">
                        Are You a Homeowner?
                    </h2>
                    <p className="text-gray-600 text-xl md:text-2xl mb-12 font-medium leading-relaxed whitespace-nowrap">
                        List your property and connect with verified buyers and renters
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start items-center">
                        <Link
                            href="/list-property"
                            className="bg-primary-dark text-white px-7 py-3.5 rounded-[14px] font-bold text-lg hover:bg-primary-dark/90 transition-all text-center min-w-[154px]"
                        >
                            List Your Property
                        </Link>
                        <Link
                            href="/learn-more"
                            className="bg-transparent text-[#3b82f6] border border-[#3b82f6] px-7 py-3.5 rounded-[14px] font-bold text-lg hover:bg-blue-50 transition-all text-center min-w-[126px]"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
