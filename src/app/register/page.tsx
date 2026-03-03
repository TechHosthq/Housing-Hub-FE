import Navbar from "@/components/layout/Navbar";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-1 flex flex-col md:flex-row pt-16">
                {/* Left Side: Hero Image */}
                <div className="hidden md:block md:w-1/2 relative min-h-[calc(100vh-64px)]">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url("/images/hero-bg.png")',
                        }}
                    />
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 min-h-full flex items-center justify-center bg-white py-12">
                    <RegisterForm />
                </div>
            </div>
        </main>
    );
}
