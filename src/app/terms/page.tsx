import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: "Terms of Service | Housing Hub",
    description:
        "The terms governing your use of Housing Hub — property listings, inspection bookings, verification and account rules.",
};

/**
 * Public terms page.
 *
 * Linked from registration and the footer, both of which are reachable signed out,
 * so this uses the public Navbar/Footer rather than the account sidebar the privacy
 * page uses.
 *
 * The content deliberately does not claim Housing Hub processes payments, holds
 * funds, or guarantees any listing — none of which is true today. Section 6 in
 * particular exists because a verification badge is a representation users rely on,
 * and overstating it creates liability.
 */
export default function TermsPage() {
    const lastUpdated = "10 August 2026";

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
                <h1 className="text-[32px] font-black text-[#1A1A1A] dark:text-gray-100 font-montserrat tracking-tight">
                    Terms of Service
                </h1>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-2">
                    Last updated {lastUpdated}
                </p>

                <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-[#4A5568] dark:text-gray-300">
                    <Section title="1. About these terms">
                        <p>
                            These terms govern your use of Housing Hub. By creating an account or
                            using the platform you agree to them. If you do not agree, please do
                            not use Housing Hub.
                        </p>
                        <p>
                            Housing Hub is operated from Lagos, Nigeria, and these terms are
                            governed by Nigerian law.
                        </p>
                    </Section>

                    <Section title="2. What Housing Hub is">
                        <p>
                            Housing Hub is a platform that lets property owners, agents and
                            developers list properties, and lets prospective tenants and buyers
                            find those properties and book inspections.
                        </p>
                        <p>
                            <strong>Housing Hub is not an estate agent, a party to any tenancy or
                            sale, and not a payment processor.</strong> We do not currently process
                            payments or hold funds. Any rent, deposit, agency fee or purchase price
                            is agreed and paid directly between you and the other party. Treat any
                            request to pay Housing Hub itself as fraudulent and report it.
                        </p>
                    </Section>

                    <Section title="3. Your account">
                        <p>
                            You must be at least 18 and provide accurate information. You are
                            responsible for keeping your login credentials secure and for activity
                            on your account. Tell us immediately if you believe your account has
                            been accessed by someone else.
                        </p>
                        <p>
                            You may close your account at any time from your settings.
                        </p>
                    </Section>

                    <Section title="4. Listing a property">
                        <p>If you list a property, you confirm that:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                you own it, or you are authorised in writing by the owner to market
                                it;
                            </li>
                            <li>
                                the details, photographs, price and availability are accurate and
                                current;
                            </li>
                            <li>
                                you hold any registration your activity requires by law, including
                                LASRERA registration where you operate as an agent or developer in
                                Lagos State; and
                            </li>
                            <li>
                                you will remove or update the listing promptly once the property is
                                no longer available.
                            </li>
                        </ul>
                        <p>
                            We may remove a listing, decline to publish it, or suspend an account
                            where we believe these terms have been breached or where a listing is
                            the subject of credible reports.
                        </p>
                    </Section>

                    <Section title="5. Inspections">
                        <p>
                            Booking an inspection creates an arrangement between you and the
                            property owner or agent, not with Housing Hub. Attend on time, bring
                            valid identification, and cancel or reschedule in good time if your
                            plans change. Repeated no-shows may result in restrictions.
                        </p>
                        <p>
                            We recommend never transferring money before physically inspecting a
                            property.
                        </p>
                    </Section>

                    <Section title="6. Verification and what it means">
                        <p>
                            Housing Hub carries out identity checks on users and reviews documents
                            supplied by owners, agents and developers. Where those checks pass, a
                            profile or listing may display a verification badge.
                        </p>
                        <p>
                            <strong>A badge records the checks we performed at a point in time. It
                            is not a guarantee</strong> of title, of the accuracy of a listing, of
                            the condition of a property, or of the conduct of the person you deal
                            with. Documents can be forged and circumstances change. You remain
                            responsible for your own due diligence, including a search at the
                            relevant land registry and independent legal advice before any
                            transaction.
                        </p>
                    </Section>

                    <Section title="7. Acceptable use">
                        <p>You agree not to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>post false, misleading or fraudulent listings;</li>
                            <li>impersonate another person or business;</li>
                            <li>
                                harass other users, or send unsolicited commercial messages through
                                the platform;
                            </li>
                            <li>
                                scrape, copy or republish listings or user data without our written
                                permission; or
                            </li>
                            <li>
                                attempt to interfere with, probe or circumvent the security of the
                                platform.
                            </li>
                        </ul>
                    </Section>

                    <Section title="8. Content you provide">
                        <p>
                            You keep ownership of the photographs, descriptions and other content
                            you upload. You grant Housing Hub a non-exclusive, royalty-free licence
                            to host, display and reproduce that content for the purpose of
                            operating and promoting the platform. You confirm you have the right to
                            grant that licence.
                        </p>
                    </Section>

                    <Section title="9. Availability">
                        <p>
                            We work to keep Housing Hub available, but we do not promise
                            uninterrupted service. We may change, suspend or withdraw features,
                            and will give reasonable notice where a change materially affects you.
                        </p>
                    </Section>

                    <Section title="10. Liability">
                        <p>
                            Housing Hub is not a party to transactions between users and is not
                            liable for the conduct of any user, the condition or title of any
                            property, or any loss arising from a transaction you enter into.
                        </p>
                        <p>
                            Nothing in these terms limits liability that cannot be limited under
                            Nigerian law, including for fraud or for death or personal injury
                            caused by negligence.
                        </p>
                    </Section>

                    <Section title="11. Changes to these terms">
                        <p>
                            We may update these terms. Where a change is material we will notify
                            you by email or in the app before it takes effect. Continuing to use
                            Housing Hub after that point means you accept the updated terms.
                        </p>
                    </Section>

                    <Section title="12. Contact">
                        <p>
                            Questions about these terms, or to report a listing or user, contact us
                            at{" "}
                            <a
                                href="mailto:info@housinghub.ng"
                                className="text-[#0095FF] hover:underline font-semibold"
                            >
                                info@housinghub.ng
                            </a>
                            .
                        </p>
                    </Section>
                </div>
            </div>

            <Footer />
        </main>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-[19px] font-bold text-[#1A1A1A] dark:text-gray-100 font-montserrat">
                {title}
            </h2>
            {children}
        </section>
    );
}
