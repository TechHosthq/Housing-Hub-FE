import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LearnMoreHero from "@/components/learn-more/LearnMoreHero";
import LearnMoreSteps from "@/components/learn-more/LearnMoreSteps";
import LearnMoreBenefits from "@/components/learn-more/LearnMoreBenefits";
import LearnMoreCTA from "@/components/learn-more/LearnMoreCTA";

export default function LearnMorePage() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <LearnMoreHero />
            <LearnMoreSteps />
            <LearnMoreBenefits />
            <LearnMoreCTA />
            <Footer />
        </main>
    );
}
