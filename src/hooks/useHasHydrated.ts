"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * True once zustand's persist middleware has restored the auth store from
 * localStorage.
 *
 * On the first client render the store is still empty, so `isAuthenticated` is
 * false even for a signed-in user. Anything that gates on auth must wait for this
 * or it will act on a state that's about to change — e.g. redirecting someone to
 * /login while their valid token is still being read back.
 *
 * useSyncExternalStore keeps the server snapshot false so SSR and the first client
 * render agree (no hydration mismatch), then re-renders when hydration finishes.
 */
export function useHasHydrated(): boolean {
    return useSyncExternalStore(
        (onStoreChange) => useAuthStore.persist.onFinishHydration(onStoreChange),
        () => useAuthStore.persist.hasHydrated(),
        () => false
    );
}
