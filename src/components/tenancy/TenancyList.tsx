"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight, FileText, Loader2 } from "lucide-react";
import { useTenancy } from "@/hooks/useTenancy";
import { useAuthStore } from "@/store/useAuthStore";
import { TENANCY_STATUS_LABELS, TenancyStatus, isTenancyLive } from "@/types/tenancy";
import { formatKobo } from "@/utils/money";

/**
 * Both sides in one list.
 *
 * Somebody letting one flat while renting another is an ordinary case here, so the
 * list says which side each row is rather than assuming a person is one thing.
 */
export default function TenancyList() {
    const currentUserId = useAuthStore((state) => state.user?.id);
    const { useMyTenancies } = useTenancy();
    const { data, isLoading } = useMyTenancies();

    const tenancies = data?.data ?? [];

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center rounded-[22px] border border-[#F2F2F2] bg-white py-20 dark:border-gray-800 dark:bg-gray-900">
                <Loader2 className="animate-spin text-[#0095FF]" size={26} />
            </div>
        );
    }

    if (tenancies.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center rounded-[22px] border border-[#F2F2F2] bg-white py-20 text-center dark:border-gray-800 dark:bg-gray-900">
                <FileText className="mb-4 text-gray-300" size={38} />
                <p className="mb-1 text-[15px] font-bold text-[#1A1A1A] dark:text-gray-100">
                    Nothing here yet
                </p>
                <p className="max-w-sm text-[12px] leading-relaxed text-gray-400 dark:text-gray-500">
                    A tenancy appears once an owner has chosen you for a property, or once
                    you&apos;ve chosen somebody for one of yours.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 rounded-[22px] border border-[#F2F2F2] bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-[16px] font-black text-[#1A1A1A] dark:text-gray-100">Tenancies</h2>

            <ul className="mt-5 divide-y divide-gray-100 dark:divide-gray-800">
                {tenancies.map((tenancy) => {
                    const isOwner = tenancy.landlordCustomerId === currentUserId;
                    const live = isTenancyLive(tenancy.status);

                    return (
                        <li key={tenancy.id}>
                            <Link
                                href={`/tenancies/${tenancy.id}`}
                                className="flex items-center justify-between gap-4 py-5 transition-opacity hover:opacity-70"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-[14px] font-bold text-[#1A1A1A] dark:text-gray-100">
                                        {tenancy.propertyTitle ?? "A property"}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                                        {isOwner
                                            ? `Letting to ${tenancy.tenantName ?? "your chosen tenant"}`
                                            : `From ${tenancy.landlordName ?? "the owner"}`}
                                        {" · "}
                                        {formatKobo(tenancy.agreedRentKobo)}
                                        {" · "}
                                        {format(new Date(tenancy.selectedAt), "d MMM yyyy")}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-3">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${live
                                            ? tenancy.status === TenancyStatus.Active
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                            }`}
                                    >
                                        {TENANCY_STATUS_LABELS[tenancy.status] ?? "In progress"}
                                    </span>
                                    <ChevronRight size={16} className="text-gray-300" />
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
