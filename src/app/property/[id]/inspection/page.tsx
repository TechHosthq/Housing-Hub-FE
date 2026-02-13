import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import InspectionForm from "@/components/property/InspectionForm";
import propertiesData from "@/data/properties.json";
import { notFound } from "next/navigation";

export default async function InspectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = propertiesData.properties.find(p => p.id === id);

    if (!property) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            <DashboardNavbar />

            <div className="pt-24 pb-20">
                <InspectionForm property={property} />
            </div>

            <Footer />
        </main>
    );
}
