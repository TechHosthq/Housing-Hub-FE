"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AccountSidebar from "@/components/profile/AccountSidebar";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20 md:pb-10">
            {/* Header */}
            <div className="bg-white px-6 py-6 border-b border-[#E5E5E5] sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <Link href="/settings" className="text-gray-500 hover:text-[#1A1A1A] transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-[24px] font-black text-[#1A1A1A] font-montserrat tracking-tight">
                        Privacy Policy
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row privacy-layout-spacing">
                    {/* Sidebar - Desktop Only */}
                    <div className="hidden md:block w-64 flex-shrink-0">
                        <AccountSidebar />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 bg-white rounded-[22px] border border-[#F2F2F2] p-8 md:p-10 shadow-sm h-fit">
                        <h2 className="text-[24px] font-black text-[#1A1A1A] font-montserrat mb-8 border-b border-[#F2F2F2] pb-6">
                            Privacy Policy
                        </h2>
                        
                        <div className="flex flex-col gap-6 text-[14px] text-gray-600 leading-relaxed">
                            <p className="text-[15px]">
                                Last Updated: May 20, 2026
                            </p>
                            <p>
                                At <strong>Real-estacy</strong>, protecting your privacy and the confidentiality of your personal and financial information is fundamental to the way we do business. This detailed Privacy Policy explains how we collect, use, share, and protect your information when you interact with our platform, whether as a property owner, renter, or site visitor.
                            </p>
                            
                            <h3 className="text-[18px] font-bold text-[#1A1A1A] mt-6">1. Information We Collect</h3>
                            <p>
                                We collect various types of information to provide you with secure and personalized real estate services:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Personal Identification:</strong> Name, email address, phone number, and physical address provided during account registration.</li>
                                <li><strong>KYC & Verification Data:</strong> Government-issued IDs, proof of address, and other documents required for owner verification and anti-fraud measures.</li>
                                <li><strong>Financial Information:</strong> Payment details, bank account information for rent transfers, and transaction history.</li>
                                <li><strong>Property Data:</strong> Details about properties listed, including addresses, images, lease terms, and inspection reports.</li>
                                <li><strong>Usage Data:</strong> Information about how you interact with our platform, including IP addresses, browser types, and device identifiers collected via cookies.</li>
                            </ul>
                            
                            <h3 className="text-[18px] font-bold text-[#1A1A1A] mt-6">2. How We Use Your Information</h3>
                            <p>
                                Your information helps us operate efficiently and improve your experience. We use your data to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Facilitate secure property listings, lease agreements, and rent payments.</li>
                                <li>Verify the identity of property owners and tenants to ensure a safe community.</li>
                                <li>Communicate with you regarding account updates, inspection schedules, and support inquiries.</li>
                                <li>Analyze platform usage to improve our interface, features, and overall service quality.</li>
                                <li>Comply with legal obligations, resolve disputes, and enforce our terms of service.</li>
                            </ul>
                            
                            <h3 className="text-[18px] font-bold text-[#1A1A1A] mt-6">3. Information Sharing and Disclosure</h3>
                            <p>
                                We do not sell your personal information. We only share your data in the following specific circumstances:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Service Providers:</strong> We share data with trusted third parties who assist us with payment processing, identity verification, and hosting services. These partners are bound by strict confidentiality agreements.</li>
                                <li><strong>Other Users:</strong> Relevant information is shared between owners and renters (e.g., contact info after a lease agreement) to facilitate the rental process.</li>
                                <li><strong>Legal Requirements:</strong> We may disclose information if required by law, subpoena, or other legal processes, or to protect the rights and safety of Real-estacy and our users.</li>
                            </ul>
                            
                            <h3 className="text-[18px] font-bold text-[#1A1A1A] mt-6">4. Data Security</h3>
                            <p>
                                We implement robust technical and organizational security measures designed to protect your personal information from unauthorized access, loss, or alteration. This includes encryption of sensitive data (like financial details and KYC documents) both in transit and at rest. While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the internet is 100% secure.
                            </p>

                            <h3 className="text-[18px] font-bold text-[#1A1A1A] mt-6">5. Your Privacy Rights and Choices</h3>
                            <p>
                                Depending on your location, you may have the right to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Access, update, or delete your personal information through your Account Settings.</li>
                                <li>Opt-out of promotional communications by clicking the "unsubscribe" link in our emails.</li>
                                <li>Request a copy of the personal data we hold about you.</li>
                                <li>Disable cookies through your browser settings, though this may affect the functionality of our platform.</li>
                            </ul>

                            <h3 className="text-[18px] font-bold text-[#1A1A1A] mt-6">6. Changes to This Privacy Policy</h3>
                            <p>
                                We may update our Privacy Policy periodically to reflect changes in our practices or relevant laws. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
                            </p>

                            <h3 className="text-[18px] font-bold text-[#1A1A1A] mt-6">7. Contact Us</h3>
                            <p>
                                If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact our Data Protection Officer at:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg mt-2 border border-gray-100">
                                <p><strong>Email:</strong> privacy@real-estacy.com</p>
                                <p><strong>Address:</strong> 123 Real Estate Avenue, Tech District, 90210</p>
                                <p><strong>Phone:</strong> +1 (800) 555-0199</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
