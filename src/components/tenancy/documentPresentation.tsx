import { TenancyDocumentMode, TenancyDocumentStatus } from "@/types/tenancy";

/**
 * What the server will accept, repeated here so a wrong file is refused before it
 * is uploaded rather than after. Kept in step with UploadedFileValidator —
 * DocumentExtensions and DocumentMaxBytes.
 */
export const DOCUMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp";
export const DOCUMENT_MAX_BYTES = 4 * 1024 * 1024;

/** The reason a file is unusable, or null when it is fine. */
export const rejectFile = (file: File): string | null => {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!DOCUMENT_ACCEPT.split(",").includes(extension)) {
        return "That file type isn't accepted. Use a PDF or a photo.";
    }

    if (file.size > DOCUMENT_MAX_BYTES) {
        return "That file is over 4MB. Try a smaller scan or a photo instead.";
    }

    return null;
};

/**
 * How each mode reads to the tenant, who is the one doing the work.
 *
 * The owner sees the same sentences when composing, which is the point: what they
 * pick is described in the words the other person will read.
 */
export const DOCUMENT_MODE_COPY: Record<number, { label: string; blurb: string }> = {
    [TenancyDocumentMode.Upload]: {
        label: "You upload it",
        blurb: "Something you already have — upload a photo or a PDF.",
    },
    [TenancyDocumentMode.SignInApp]: {
        label: "Sign here",
        blurb: "Read it and sign in the app. We record the time and your device.",
    },
    [TenancyDocumentMode.SignOffline]: {
        label: "Print, sign, upload",
        blurb: "Download it, sign it on paper, then upload the signed copy.",
    },
};

const STATUS_STYLES: Record<number, string> = {
    [TenancyDocumentStatus.Requested]:
        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    [TenancyDocumentStatus.Submitted]:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    [TenancyDocumentStatus.Accepted]:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    [TenancyDocumentStatus.Rejected]:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};

/**
 * A returned document is amber, not red.
 *
 * Red reads as a refusal. It is a correction the tenant can make, and the colour
 * is doing as much of the explaining as the word is.
 */
export function DocumentStatusPill({ status, label }: { status: TenancyDocumentStatus; label: string }) {
    return (
        <span
            className={`inline-block shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[status] ?? STATUS_STYLES[TenancyDocumentStatus.Requested]}`}
        >
            {label}
        </span>
    );
}
