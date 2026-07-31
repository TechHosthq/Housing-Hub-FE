"use client";

import Navbar from "./Navbar";
import DashboardNavbar from "./DashboardNavbar";
import { useAuthStore } from "@/store/useAuthStore";

// The homepage's filter bar sends every user to /dashboard on selection, and
// /dashboard always renders DashboardNavbar — so a signed-in user filtering
// from here would otherwise see the navbar visibly flip from Navbar to
// DashboardNavbar mid-interaction. Rendering DashboardNavbar here too for
// signed-in users keeps the header identical across that transition.
// AuthGuard blocks all rendering until the persisted auth state has
// hydrated, so there's no flash of the wrong navbar on load.
export default function HomeHeader() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <DashboardNavbar /> : <Navbar />;
}
