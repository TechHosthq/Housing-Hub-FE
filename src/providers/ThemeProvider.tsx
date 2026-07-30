"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const isDarkMode = useThemeStore((state) => state.isDarkMode);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    return <>{children}</>;
}
