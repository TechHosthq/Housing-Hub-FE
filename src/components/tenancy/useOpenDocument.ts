"use client";

import { useState } from "react";
import { useTenancy } from "@/hooks/useTenancy";
import { TenancyDocumentFile } from "@/types/tenancy";
import { useToastStore } from "@/store/useToastStore";
import { resolveApiError } from "@/utils/errorResolver";

/**
 * Opens a document in a new tab through a short-lived link.
 *
 * The tab is opened synchronously, before the request, and pointed at the URL once
 * it arrives. Opening it after the await is what a popup blocker stops — the click
 * is no longer the thing that caused it.
 *
 * `noopener` is set by hand rather than passed to `window.open`, because passing it
 * makes the call return null and there is then no tab to navigate.
 */
export function useOpenDocument(tenancyId: string) {
    const { fetchDocumentUrl } = useTenancy();
    const { showError } = useToastStore();
    const [openingId, setOpeningId] = useState<string | null>(null);

    const openDocument = async (documentId: string, file: TenancyDocumentFile) => {
        const tab = window.open("", "_blank");
        if (tab) tab.opener = null;

        setOpeningId(documentId);
        try {
            const result = await fetchDocumentUrl(tenancyId, documentId, file);

            if (result.isSuccessful && result.data) {
                if (tab) tab.location.href = result.data;
                else window.location.href = result.data;
                return;
            }

            tab?.close();
            showError(result.message || "Could not open that document.");
        } catch (error) {
            tab?.close();
            showError(resolveApiError(error));
        } finally {
            setOpeningId(null);
        }
    };

    return { openDocument, openingId };
}
