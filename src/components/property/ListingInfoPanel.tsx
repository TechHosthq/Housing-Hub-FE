import { format } from "date-fns";
import { AvailabilityStatus } from "@/types/property";

interface ListingInfoPanelProps {
    propertyId?: string;
    /** ISO timestamp from the API. */
    listedDate?: string | null;
    availability?: AvailabilityStatus;
}

const AVAILABILITY_LABEL: Record<AvailabilityStatus, string> = {
    [AvailabilityStatus.Available]: "Available",
    [AvailabilityStatus.Occupied]: "Occupied",
    [AvailabilityStatus.Sold]: "Sold",
};

const AVAILABILITY_STYLE: Record<AvailabilityStatus, string> = {
    [AvailabilityStatus.Available]: "bg-[#E9F3FF] text-[#0095FF]",
    [AvailabilityStatus.Occupied]: "bg-amber-50 text-amber-600",
    [AvailabilityStatus.Sold]: "bg-gray-100 text-gray-500",
};

/**
 * The "Listing Information" block shown on the property page and the inspection
 * booking page.
 *
 * Extracted because it was duplicated across both, and the duplicate meant the same
 * hardcoded placeholders — property ID "SPH-12024", "Dec 1, 2024" and a permanent
 * "Available" badge — rendered on every listing in two separate places.
 */
export default function ListingInfoPanel({
    propertyId,
    listedDate,
    availability,
}: ListingInfoPanelProps) {
    // The raw GUID is unreadable in a UI; a short prefix is enough for a user to
    // quote back to support and still maps to exactly one property in practice.
    const shortId = propertyId ? `HH-${propertyId.slice(0, 8).toUpperCase()}` : "—";

    const formattedDate = listedDate ? format(new Date(listedDate), "d MMM yyyy") : "—";
    const status = availability ?? AvailabilityStatus.Available;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[22px] border border-[#F2F2F2] dark:border-gray-800 p-6 shadow-sm">
            <h3 className="text-[14px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat mb-6">
                Listing Information
            </h3>

            <div className="space-y-4">
                <Row label="Property ID" value={shortId} />
                <Row label="Listed Date" value={formattedDate} />

                <div className="flex justify-between items-center">
                    <span className="text-[11px] text-[#999999] dark:text-gray-500">Status</span>
                    <span
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${AVAILABILITY_STYLE[status]}`}
                    >
                        {AVAILABILITY_LABEL[status]}
                    </span>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-[11px] text-[#999999] dark:text-gray-500">{label}</span>
            <span className="text-[11px] font-bold text-[#333333] dark:text-gray-300">{value}</span>
        </div>
    );
}
