import DashboardNavbar from "@/components/layout/DashboardNavbar";
import PersonalInfoForm from "@/components/kyc/PersonalInfoForm";
import Footer from "@/components/layout/Footer";

export default function PersonalInfoPage() {
    return (
        <main className="min-h-screen bg-white">
            <DashboardNavbar />

            <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
                <PersonalInfoForm />
            </div>

            <Footer />
        </main>
    );
}
