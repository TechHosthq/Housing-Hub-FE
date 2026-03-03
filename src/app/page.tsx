import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PropertyGrid from "@/components/home/PropertyGrid";
import HowItWorks from "@/components/home/HowItWorks";
import HomeownerCTA from "@/components/home/HomeownerCTA";
import Footer from "@/components/layout/Footer";
import { propertyService } from "@/services/propertyService";

export default function Home() {
  const properties = propertyService.getProperties();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-0">
        <Hero />

        <div id="trending" className="scroll-mt-20">
          <PropertyGrid
            title="Trending Properties"
            properties={properties}
          />
        </div>

        <div id="nearby" className="py-10 scroll-mt-20">
          <PropertyGrid
            title="Properties near you"
            properties={properties}
          />
        </div>

        <HowItWorks />

        <HomeownerCTA />
      </div>

      <Footer />
    </main>
  );
}
