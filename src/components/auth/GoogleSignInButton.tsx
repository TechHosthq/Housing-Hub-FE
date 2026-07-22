"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const GSI_SRC = "https://accounts.google.com/gsi/client";

interface GoogleCredentialResponse {
    credential?: string;
}

interface GoogleIdApi {
    initialize(config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        ux_mode?: "popup" | "redirect";
    }): void;
    renderButton(parent: HTMLElement, options: Record<string, string | number>): void;
}

declare global {
    interface Window {
        google?: { accounts: { id: GoogleIdApi } };
    }
}

// Module-level so the script is only ever injected once per page load.
let gsiPromise: Promise<void> | null = null;

function loadGoogleIdentityServices(): Promise<void> {
    if (typeof window === "undefined") return Promise.resolve();
    if (gsiPromise) return gsiPromise;

    gsiPromise = new Promise<void>((resolve, reject) => {
        if (window.google?.accounts?.id) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = GSI_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => {
            gsiPromise = null; // allow a retry on remount
            reject(new Error("Failed to load Google Identity Services"));
        };
        document.head.appendChild(script);
    });

    return gsiPromise;
}

interface GoogleSignInButtonProps {
    /** Receives the Google ID token (JWT credential) to POST to /api/v1/Auth/google */
    onCredential: (idToken: string) => void;
    isLoading?: boolean;
}

/**
 * Renders Google's official Sign-In button (required by Google's branding guidelines)
 * and hands the resulting ID token back to the caller.
 */
export default function GoogleSignInButton({ onCredential, isLoading }: GoogleSignInButtonProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Keep the latest callback without re-running the init effect.
    const callbackRef = useRef(onCredential);
    useEffect(() => {
        callbackRef.current = onCredential;
    }, [onCredential]);

    useEffect(() => {
        if (!clientId) return;

        let cancelled = false;

        loadGoogleIdentityServices()
            .then(() => {
                const google = window.google;
                if (cancelled || !hostRef.current || !google) return;

                google.accounts.id.initialize({
                    client_id: clientId,
                    ux_mode: "popup",
                    callback: (response) => {
                        if (response?.credential) callbackRef.current(response.credential);
                    },
                });

                const width = wrapperRef.current?.offsetWidth ?? 320;
                hostRef.current.innerHTML = "";
                google.accounts.id.renderButton(hostRef.current, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    shape: "pill",
                    logo_alignment: "center",
                    width: Math.min(Math.max(Math.round(width), 200), 400),
                });

                setReady(true);
            })
            .catch(() => {
                if (!cancelled) setError("Couldn't load Google sign-in. Check your connection.");
            });

        return () => {
            cancelled = true;
        };
    }, [clientId]);

    const message = !clientId ? "Google sign-in is not configured." : error;

    if (message) {
        return (
            <div className="w-full py-3 text-center text-[11px] text-gray-400 border border-[#E5E5E5] rounded-full">
                {message}
            </div>
        );
    }

    return (
        <div ref={wrapperRef} className="relative w-full flex justify-center min-h-[44px]">
            {/* Google renders its button here */}
            <div ref={hostRef} className={isLoading ? "pointer-events-none opacity-60" : ""} />

            {(!ready || isLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                    <Loader2 className="animate-spin text-gray-400" size={20} />
                </div>
            )}
        </div>
    );
}
