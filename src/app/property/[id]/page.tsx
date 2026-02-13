import DashboardNavbar from "@/components/layout/DashboardNavbar";
import Footer from "@/components/layout/Footer";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyInfo from "@/components/property/PropertyInfo";
import ListingSidebar from "@/components/property/ListingSidebar";
import PropertyDetailHeader from "@/components/property/PropertyDetailHeader";
import propertiesData from "@/data/properties.json";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = propertiesData.properties.find(p => p.id === id);

    if (!property) {
        notFound();
    }

    // Demo images for gallery
    const images = [
        property.image,
        "https://images.unsplash.com/photo-1600607687940-4e2a09697d6b?auto=format&fit=crop&q=80&w=2070",
        "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=2070",
        "https://images.unsplash.com/photo-1600121848594-d86cc4f595e5?auto=format&fit=crop&q=80&w=2070",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=2070"
    ];

    return (
        <main className="min-h-screen bg-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
                {/* Back Button */}
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-[#6BB5FF] hover:text-[#002D6B] transition-colors font-semibold text-[11px] mb-8"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Side */}
                    <div className="flex-1 bg-white rounded-[28px] border border-[#F2F2F2] p-8 shadow-sm">
                        <PropertyDetailHeader />

                        <div className="space-y-10">
                            <PropertyGallery images={images} />
                            <PropertyInfo property={property} />
                        </div>
                    </div>

                    {/* Sidebar Side */}
                    <ListingSidebar propertyId={property.id} />
                </div>
            </div>

            <Footer />
        </main>
    );
}
