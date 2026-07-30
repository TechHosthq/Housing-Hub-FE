import Navbar from "@/components/layout/Navbar";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { Suspense } from "react";

export default function VerifyEmailPage() {
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
                    <Suspense fallback={<div>Loading...</div>}>
                        <VerifyEmailForm />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
