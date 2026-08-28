"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserRole } from "@/context/UserRoleContext";

export default function Footer() {
    // Three audiences, from the two column sets already here. Signed out, both are
    // shown, because the footer is doing marketing to people who could be either.
    // Signed in, we know which they are, and offering an owner "Request Inspection"
    // or a renter "List properties" is at best noise and at worst a dead end — a
    // renter following "List properties" landed on the owner's add-listing form.
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { isOwner } = useUserRole();

    const showCustomerLinks = !isAuthenticated || !isOwner;
    const showOwnerLinks = !isAuthenticated || isOwner;

    return (
        <footer className="bg-[#0B2545] text-white pt-16 md:pt-24 pb-16 px-6 sm:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-20 mb-16">
                <div className="space-y-6 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/footerlogo.svg"
                            alt="Housing Hub Logo"
                            width={180}
                            height={45}
                            className="w-auto h-12 object-contain"
                            />
                    </Link>
                    </div>
                    <p className="text-white/80 text-base font-medium max-w-[280px]">
                        Find Verified Properties And Book Inspections With Ease.
                    </p>
                </div>

                {showCustomerLinks && <div>
                    <h4 className="text-xl mb-8 text-white" style={{color:"#FFFFFF"}}>For Customers</h4>
                    <ul className="space-y-4 text-white/70 text-base font-medium">
                        <li><Link href="/" className="hover:text-white transition-colors">Search Properties</Link></li>
                        <li><Link href="/inspections" className="hover:text-white transition-colors">Request Inspection</Link></li>
                        <li><Link href="/inspections" className="hover:text-white transition-colors">Track Status</Link></li>
                        <li><Link href="/profile" className="hover:text-white transition-colors">Profile & KYC</Link></li>
                    </ul>
                </div>}

                {showOwnerLinks && <div>
                    <h4 className="font-bold text-xl mb-8 text-white" style={{color:"#FFFFFF"}}>For Homeowners</h4>
                    <ul className="space-y-4 text-white/70 text-base font-medium">
                        <li><Link href="/properties/add" className="hover:text-white transition-colors">List properties</Link></li>
                        <li><Link href="/properties" className="hover:text-white transition-colors">Manage Listings</Link></li>
                        <li><Link href="/inspections" className="hover:text-white transition-colors">Inspection Requests</Link></li>
                        <li><Link href="/kyc/personal-info" className="hover:text-white transition-colors">KYC Verification</Link></li>
                    </ul>
                </div>}

                <div>
                    <h4 className="font-bold text-xl mb-8 text-white" style={{color:"#FFFFFF"}}>Support</h4>
                    <ul className="space-y-4 text-white/70 text-base font-medium">
                        <li><a href="mailto:support@housinghub.ng" className="hover:text-white transition-colors">Contact Us</a></li>
                        <li><Link href="/faq" className="hover:text-white transition-colors">Help Center</Link></li>
                        <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-white/5 pt-10 text-center text-white/30 text-xs font-bold tracking-widest uppercase">
                © {new Date().getFullYear()} HOUSING HUB. ALL RIGHTS RESERVED.
            </div>
        </footer>
    );
}
