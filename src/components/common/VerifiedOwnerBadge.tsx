import { BadgeCheck, Building2, ShieldCheck } from "lucide-react";
import { VerificationTier } from "@/types/verification";

interface VerifiedOwnerBadgeProps {
    /** Highest verification the lister currently holds. Nothing renders below IdentityVerified. */
    tier: VerificationTier;
    /** `compact` for listing cards, `full` for the detail page and profiles. */
    variant?: "compact" | "full";
    className?: string;
}

/**
 * What Housing Hub has actually checked about the person behind a listing.
 *
 * ONE BADGE, NOT SEVERAL — read before adding another.
 *
 * The temptation as more checks ship is to put a badge beside each one. Don't.
 * Two or three badges in a row invite the reader to average them into a general
 * impression of safety, which is precisely the reasoning tiers exist to prevent.
 * A renter should read one claim and know exactly what it covers.
 *
 * SCOPE OF EACH TIER
 *
 * - IdentityVerified — a government ID was submitted and an admin matched it to
 *   the account holder. Says nothing about any company or property.
 * - BusinessVerified — additionally, their company registration was checked
 *   against the CAC record. Still says nothing about who owns the property.
 * - TitleVerified — additionally, the title documents for THIS property were
 *   reviewed. The only tier whose copy may say anything about ownership, and the
 *   only one gated behind a server-side flag (Verification:ShowTitleBadge),
 *   because it is the claim a defrauded buyer's lawyer will point at first.
 *
 * Every variant states its own limit in the tooltip or on the face of it. Once a
 * listing carries a badge a renter relies on it, and if they are defrauded later
 * the badge is the first thing their lawyer points at.
 */
export default function VerifiedOwnerBadge({
    tier,
    variant = "compact",
    className = "",
}: VerifiedOwnerBadgeProps) {
    if (tier < VerificationTier.IdentityVerified) return null;

    const isTitle = tier >= VerificationTier.TitleVerified;
    const isBusiness = tier >= VerificationTier.BusinessVerified;

    const label = isTitle
        ? "Title Verified"
        : isBusiness
            ? "Verified Business"
            : "Verified Owner";

    const Icon = isTitle ? ShieldCheck : isBusiness ? Building2 : BadgeCheck;

    // The limit travels with the claim at every tier. Only the title tier may say
    // anything about the property itself, and even then it describes what was
    // reviewed rather than guaranteeing an outcome — "documents were reviewed", not
    // "this property is safe to buy".
    const scopeNote = isTitle
        ? "Housing Hub has reviewed the title documents for this property and "
          + "confirmed the lister's identity. This is not legal advice or a guarantee "
          + "of title — take your own legal search before you transact."
        : isBusiness
            ? "Housing Hub has confirmed this lister's identity and that their company is "
              + "registered with the CAC. Ownership of the property has not been verified."
            : "Housing Hub has confirmed this owner's identity with a government-issued ID. "
              + "Ownership of the property has not been verified.";

    if (variant === "compact") {
        return (
            <span
                title={scopeNote}
                aria-label={`${label}. ${scopeNote}`}
                className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 ${className}`}
            >
                <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                {label}
            </span>
        );
    }

    return (
        <div
            className={`rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-3 ${className}`}
        >
            <span className="flex items-center gap-1.5 text-[13px] font-bold text-emerald-800 dark:text-emerald-300">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
            </span>
            {/* Visible, not just a tooltip. This is the page where a renter decides,
                and it is the one place there is room to say what was checked. */}
            <p className="mt-1 text-[11px] leading-snug text-emerald-900/80 dark:text-emerald-200/70">
                {isTitle
                    ? "Title documents for this property have been reviewed and the lister's identity confirmed. This is not legal advice or a guarantee of title — please take your own legal search before you transact."
                    : isBusiness
                        ? "Identity confirmed with a government-issued ID, and company registration checked against the CAC. Housing Hub has not verified ownership of this property."
                        : "Identity confirmed with a government-issued ID. Housing Hub has not verified ownership of this property."}
            </p>
        </div>
    );
}
