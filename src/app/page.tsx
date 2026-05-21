import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PropertyGrid from "@/components/home/PropertyGrid";
import HowItWorks from "@/components/home/HowItWorks";
import HomeownerCTA from "@/components/home/HomeownerCTA";
import Footer from "@/components/layout/Footer";
import { propertyService } from "@/services/propertyService";

import TrendingGrid from "@/components/home/TrendingGrid";
import NearbyGrid from "@/components/home/NearbyGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-0">
        <Hero />

        <div id="trending" className="scroll-mt-20">
          <TrendingGrid />
        </div>

        <div id="nearby" className="scroll-mt-20">
          <NearbyGrid />
        </div>

        <HowItWorks />

        <HomeownerCTA />
      </div>

      <Footer />
    </main>
  );
}

