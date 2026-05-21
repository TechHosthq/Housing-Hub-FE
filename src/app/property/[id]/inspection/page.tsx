import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import InspectionForm from "@/components/property/InspectionForm";
import { propertyService } from "@/services/propertyService";
import { notFound } from "next/navigation";

export default async function InspectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    if (!id) {
        notFound();
    }

    let property = null;
    try {
        const response = await propertyService.getProperty(id);
        if (response.isSuccessful && response.data) {
            const data = response.data;
            property = {
                id: data.id,
                title: data.title || "Untitled Property",
                price: `₦ ${data.price.toLocaleString()}`,
                location: data.propertyAddress?.city || "Lagos",
                image: data.files?.[0]?.fileUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070"
            };
        }
    } catch (err) {
        console.error("Failed to fetch property for inspection:", err);
    }

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
