import DashboardNavbar from "@/components/layout/DashboardNavbar";
import SubmitIDForm from "@/components/kyc/SubmitIDForm";
import Footer from "@/components/layout/Footer";

export default function SubmitIDPage() {
    return (
        <main className="min-h-screen bg-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
                <SubmitIDForm />
            </div>

            <Footer />
        </main>
    );
}
