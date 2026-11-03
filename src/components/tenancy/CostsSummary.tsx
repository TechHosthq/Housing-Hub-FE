import { TenancyFee } from "@/types/tenancy";
import { formatKobo } from "@/utils/money";

interface CostsSummaryProps {
    rentKobo: number;
    fees: TenancyFee[];
    totalKobo: number;
    /** The owner is looking at what they are about to ask for, not what they owe. */
    audience: "owner" | "tenant";
}

/**
 * Rent, every fee, and one total.
 *
 * Shown above the documents on the tenant's screen rather than below them. The
 * whole reason fees are carried in the same response as the documents is that they
 * have to be visible before anything is signed — putting them after the thing
 * they are meant to inform would undo that.
 */
export default function CostsSummary({ rentKobo, fees, totalKobo, audience }: CostsSummaryProps) {
    return (
        <div className="rounded-[22px] border border-[#F2F2F2] bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-[15px] font-black text-[#1A1A1A] dark:text-gray-100">
                {audience === "tenant" ? "What this will cost you" : "What you're asking for"}
            </h2>

            <dl className="mt-5 space-y-4">
                <div className="flex items-start justify-between gap-6">
                    <dt className="text-[13px] font-bold text-[#1A1A1A] dark:text-gray-200">Rent</dt>
                    <dd className="shrink-0 text-[13px] font-bold text-[#1A1A1A] dark:text-gray-200">
                        {formatKobo(rentKobo)}
                    </dd>
                </div>

                {fees.map((fee) => (
                    <div key={fee.id} className="flex items-start justify-between gap-6">
                        <dt className="min-w-0">
                            <span className="block text-[13px] font-bold text-[#1A1A1A] dark:text-gray-200">
                                {fee.name}
                            </span>
                            {/*
                                The description is required by the server for this reason:
                                "Agency fee — ₦250,000" with nothing attached is what gets
                                disputed later, and only the owner can say what it covers.
                            */}
                            <span className="mt-0.5 block text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
                                {fee.description}
                            </span>
                        </dt>
                        <dd className="shrink-0 text-[13px] font-bold text-[#1A1A1A] dark:text-gray-200">
                            {formatKobo(fee.amountKobo)}
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="mt-5 flex items-center justify-between gap-6 border-t border-gray-100 pt-5 dark:border-gray-800">
                <span className="text-[13px] font-black text-[#1A1A1A] dark:text-gray-100">Total</span>
                <span className="font-montserrat text-[20px] font-black text-[#0B2545] dark:text-[#6BB5FF]">
                    {formatKobo(totalKobo)}
                </span>
            </div>

            {audience === "tenant" && (
                <p className="mt-4 text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
                    This is the figure the owner has set. Nothing is taken until you&apos;ve
                    completed the documents and chosen to pay.
                </p>
            )}
        </div>
    );
}
