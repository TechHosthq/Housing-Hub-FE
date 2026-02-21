import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQAccordion from "@/components/faq/FAQAccordion";

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* FAQ Hero Section */}
            <section className="relative h-[168px] md:h-[280px] flex items-center justify-center pt-14 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 45, 107, 0.15), rgba(0, 45, 107, 0.15)), url("/images/hero-bg.png")',
                    }}
                />
                <div className="relative z-10 text-center px-6 mt-12">
                    <h1 className="text-4xl md:text-[35px] text-white tracking-tight font-montserrat leading-tight" style={{color: "white"}}>
                        Frequently Asked Questions
                    </h1>
                </div>
            </section>

            {/* FAQ Content Section */}
            <section className="bg-white">
                <FAQAccordion />
            </section>

            <Footer />
        </main>
    );
}
