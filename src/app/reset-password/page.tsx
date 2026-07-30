import Navbar from "@/components/layout/Navbar";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />

            <div className="flex min-h-screen pt-16">
                {/* Left Side - Image Background */}
                <div
                    className="hidden md:block w-1/2 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("/images/hero-bg.png")',
                    }}
                />

                {/* Right Side - Content */}
                <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-gray-900">
                    <ResetPasswordForm />
                </div>
            </div>
        </main>
    );
}
