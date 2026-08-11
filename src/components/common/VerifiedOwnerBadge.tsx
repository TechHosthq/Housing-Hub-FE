import { BadgeCheck } from "lucide-react";

interface VerifiedOwnerBadgeProps {
    /** Nothing renders when false — an absent badge, never a "not verified" one. */
    verified: boolean;
    /** `compact` for listing cards, `full` for the detail page and profiles. */
    variant?: "compact" | "full";
    className?: string;
}

/**
 * What Housing Hub has actually checked about the person behind a listing.
 *
 * SCOPE — read before changing the copy.
 *
 * This badge means one thing: a government-issued ID was submitted and a Housing
 * Hub admin matched it to the account holder. It does not mean the person owns the
 * property, is entitled to let it, or that the title is clean. None of that is
 * verified yet; it arrives with title verification in Phase 2.
 *
 * That distinction is not pedantry. The moment a listing carries a badge, a renter
 * relies on it, and if they are later defrauded the badge is the first thing their
 * lawyer will point at. So the tooltip states the limit explicitly and sits on both
 * variants — including the compact one, where the label alone is ambiguous.
 *
 * When title verification ships this should become tiered rather than gaining a
 * second badge beside it: two badges invite the reader to average them into a
 * general impression of safety, which is the thing to avoid.
 */
export default function VerifiedOwnerBadge({
    verified,
    variant = "compact",
    className = "",
}: VerifiedOwnerBadgeProps) {
    if (!verified) return null;

    const scopeNote =
        "Housing Hub has confirmed this owner's identity with a government-issued ID. " +
        "Ownership of the property has not been verified.";

    if (variant === "compact") {
        return (
            <span
                title={scopeNote}
                aria-label={`Verified Owner. ${scopeNote}`}
                className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 ${className}`}
            >
                <BadgeCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
                Verified Owner
            </span>
        );
    }

    return (
        <div
            className={`rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-3 ${className}`}
        >
            <span className="flex items-center gap-1.5 text-[13px] font-bold text-emerald-800 dark:text-emerald-300">
                <BadgeCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                Verified Owner
            </span>
            {/* Visible, not just a tooltip. On the detail page there is room to say
                what was checked, and this is the page where a renter decides. */}
            <p className="mt-1 text-[11px] leading-snug text-emerald-900/80 dark:text-emerald-200/70">
                Identity confirmed with a government-issued ID. Housing Hub has not
                verified ownership of this property.
            </p>
        </div>
    );
}
