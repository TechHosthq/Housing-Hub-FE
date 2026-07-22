"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { CustomerType } from "@/types/auth";

export type Role = "Customer" | "Owner";

/**
 * Mirrors CustomerTypeExtensions.CanManageProperties() on the backend.
 * CustomerType is a [Flags] enum, so test bits rather than compare equality.
 */
export const canManageProperties = (customerType?: number | null): boolean => {
    const type = customerType ?? CustomerType.Unset;
    return (type & (CustomerType.HouseOwner | CustomerType.Agent | CustomerType.Developer)) !== 0;
};

interface UserRoleContextType {
    /** Derived from the signed-in account — not user-switchable. */
    role: Role;
    isOwner: boolean;
    customerType: number;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

/**
 * Role is derived from the authenticated user's customerType.
 *
 * It used to be a localStorage toggle the user could flip freely, which meant the
 * UI role could disagree with what the API would actually authorize — a "Customer"
 * could switch to "Owner", be shown owner screens, and then get 403s from the API.
 */
export function UserRoleProvider({ children }: { children: React.ReactNode }) {
    const user = useAuthStore((state) => state.user);
    const customerType = user?.customerType ?? CustomerType.Unset;

    const value = useMemo<UserRoleContextType>(() => {
        const isOwner = canManageProperties(customerType);
        return { role: isOwner ? "Owner" : "Customer", isOwner, customerType };
    }, [customerType]);

    return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>;
}

export function useUserRole() {
    const context = useContext(UserRoleContext);
    if (context === undefined) {
        throw new Error("useUserRole must be used within a UserRoleProvider");
    }
    return context;
}
