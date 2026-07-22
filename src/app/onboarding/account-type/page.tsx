"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Search, Building2, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import { useAccountType } from "@/hooks/useAuth";
import { CustomerType } from "@/types/auth";
import { needsAccountTypeSelection } from "@/utils/authRouting";
import { resolveApiError } from "@/utils/errorResolver";

const OPTIONS = [
    {
        value: CustomerType.Customer,
        title: "I'm looking for a home",
        description: "Browse verified listings, book inspections and track your requests.",
        icon: Search,
    },
    {
        value: CustomerType.HouseOwner,
        title: "I own property to list",
        description: "List your properties, manage inspection requests and reach verified renters.",
        icon: Home,
    },
    {
        value: CustomerType.Agent,
        title: "I'm an agent",
        description: "Manage listings and inspections on behalf of property owners.",
        icon: Building2,
    },
];

export default function AccountTypePage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { setAccountType, isSettingAccountType } = useAccountType();

    const [selected, setSelected] = useState<CustomerType | null>(null);
    const [error, setError] = useState<string>("");

    // Only reachable while signed in and still Unset.
    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
        } else if (!needsAccountTypeSelection(user?.customerType)) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, user?.customerType, router]);

    const handleContinue = async () => {
        if (selected === null) return;
        setError("");
        try {
            const response = await setAccountType(selected);
            if (response.isSuccessful) {
                router.replace("/dashboard");
            } else {
                setError(response.message || "Couldn't save your choice. Please try again.");
            }
        } catch (err: unknown) {
            setError(resolveApiError(err)[0] ?? "Couldn't save your choice. Please try again.");
        }
    };

    if (!isAuthenticated) return null;

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
                <h1 className="text-[24px] md:text-[28px] font-black text-[#1A1A1A] font-montserrat text-center">
                    How will you use Housing Hub?
                </h1>
                <p className="text-[14px] text-[#666666] text-center mt-3 mb-10">
                    This sets up your dashboard. You can only choose once, so pick what fits you best.
                </p>

                {error && (
                    <div className="mb-6 px-4 py-3 text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center font-semibold">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {OPTIONS.map(({ value, title, description, icon: Icon }) => {
                        const isSelected = selected === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setSelected(value)}
                                aria-pressed={isSelected}
                                className={`w-full flex items-start gap-4 text-left p-5 rounded-2xl border-2 transition-all ${
                                    isSelected
                                        ? "border-[#002D6B] bg-[#F5F8FF]"
                                        : "border-gray-100 hover:border-gray-200"
                                }`}
                            >
                                <span
                                    className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                                        isSelected ? "bg-[#002D6B] text-white" : "bg-gray-50 text-gray-400"
                                    }`}
                                >
                                    <Icon size={20} />
                                </span>
                                <span className="flex-1">
                                    <span className="block text-[15px] font-bold text-[#1A1A1A]">{title}</span>
                                    <span className="block text-[13px] text-[#666666] mt-1">{description}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={selected === null || isSettingAccountType}
                    className="mt-10 w-full bg-primary-dark text-white py-4 rounded-full font-bold text-base hover:bg-primary-dark/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSettingAccountType && <Loader2 className="animate-spin" size={20} />}
                    Continue
                </button>
            </div>
        </main>
    );
}
