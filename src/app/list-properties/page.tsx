import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ListHero from "@/components/list-property/ListHero";
import WhyList from "@/components/list-property/WhyList";

export default function ListPropertiesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <ListHero />
            <WhyList />
            <Footer />
        </main>
    );
}
