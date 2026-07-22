"use client";

// Public route: Navbar adapts to signed-in vs signed-out, DashboardNavbar assumes a user.
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyInfo from "@/components/property/PropertyInfo";
import ListingSidebar from "@/components/property/ListingSidebar";
import PropertyDetailHeader from "@/components/property/PropertyDetailHeader";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProperty } from "@/hooks/useProperty";
import { use } from "react";

export default function PropertyDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { useGetProperty } = useProperty();
    const { data: propertyResponse, isLoading } = useGetProperty(id);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="animate-spin text-primary-dark w-12 h-12" />
                </div>
                <Footer />
            </main>
        );
    }

    const property = propertyResponse?.data;

    if (!property) {
        return (
            <main className="min-h-screen bg-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <h1 className="text-2xl font-bold">Property Not Found</h1>
                    <Link href="/dashboard" className="text-[#0095FF] font-bold">Return to Dashboard</Link>
                </div>
                <Footer />
            </main>
        );
    }

    // Map API files to gallery images
    const images = property.files?.length > 0 
        ? property.files.map(f => f.fileUrl).filter(Boolean) as string[]
        : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070"];

    // Map PropertyDetail to PropertyInfo expected format
    const displayProperty = {
        title: property.title || "Untitled Property",
        price: property.price ? `₦ ${property.price.toLocaleString()}` : "Price upon request",
        location: property.propertyAddress?.city || "Lagos",
        bedrooms: 4, // API doesn't have these specific counts yet
        bathrooms: 3,
        description: property.description || ""
    };

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-[#6BB5FF] hover:text-primary-dark transition-colors font-semibold text-[11px] mb-8"
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
                            <PropertyInfo propertyId={property.id} property={displayProperty} />
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
