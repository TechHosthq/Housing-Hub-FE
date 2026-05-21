import { Info } from "lucide-react";
import Link from "next/link";
import { useUserRole } from "@/context/UserRoleContext";
import { useAuthStore } from "@/store/useAuthStore";
import { useCustomer } from "@/hooks/useCustomer";

export default function KYCBanner() {
    const { role } = useUserRole();
    const user = useAuthStore((state) => state.user);
    const { useGetCustomer } = useCustomer();

    // Fetch the latest customer data to check KYC status
    const { data: customerResponse, isLoading } = useGetCustomer(user?.id || null);

    const isKycVerified = customerResponse?.data?.isKycVerified;

    // Do not show the banner while loading or if KYC is already verified
    if (isLoading || isKycVerified) {
        return null;
    }

    return (
        <div className="bg-[#0095FF] text-white p-4 rounded-2xl flex items-center justify-between mb-8 shadow-sm animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Info size={20} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-base">KYC Not Submitted</h3>
                    <p className="text-sm text-white/90">
                        {role === "Owner"
                            ? "Verify your identity to receive request inspections and List a property."
                            : "Verify your identity to request inspections"}
                    </p>
                </div>
            </div>

            <Link
                href="/kyc/personal-info"
                className="bg-white/20 hover:bg-white/30 text-white border border-white/50 px-6 py-2.5 rounded-xl font-bold text-sm transition-all text-center"
            >
                Complete KYC
            </Link>
        </div>
    );
}
