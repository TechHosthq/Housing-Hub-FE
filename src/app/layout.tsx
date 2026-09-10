import type { Metadata } from "next";
import { headers } from "next/headers";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-montserrat'
});

export const metadata: Metadata = {
  title: "Housing Hub | Find Homes in Nigeria",
  description: "Browse, inspect, and buy/rent trusted listings in Nigeria.",
};

import { UserRoleProvider } from "@/context/UserRoleContext";
import QueryProvider from "@/providers/QueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import SignalRProvider from "@/providers/SignalRProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
   * The nonce middleware minted for this response.
   *
   * script-src no longer allows 'unsafe-inline', so the theme script below runs
   * only if it carries this. Reading a header here is also what makes every route
   * dynamic — see the note in middleware.ts; that is the accepted cost of a nonce.
   *
   * Undefined in contexts where middleware did not run. React omits a nullish
   * nonce attribute, which fails closed: the script is refused and the page loads
   * in light mode rather than executing unnonced.
   */
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    /*
     * suppressHydrationWarning because the theme script below sets `class="dark"`
     * on this element before React hydrates, so the server's markup and the client's
     * DOM legitimately differ on exactly one attribute. React reports that as a
     * mismatch and declines to patch it, which is noise on every page load and
     * hides real mismatches underneath.
     *
     * Scoped to this element only — it does not suppress anything inside the tree.
     * The alternative is to stop applying the theme before paint, which trades a
     * console warning for a flash of the wrong theme on every visit.
     */
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply the persisted theme before first paint to avoid a flash of the wrong theme. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=JSON.parse(localStorage.getItem('theme-storage')||'{}');if(s.state&&s.state.isDarkMode){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${montserrat.className} antialiased font-sans`}>
        <ThemeProvider>
          <QueryProvider>
            <SignalRProvider>
              <UserRoleProvider>
                <ToastProvider>
                  <AuthGuard>
                    {children}
                  </AuthGuard>
                </ToastProvider>
              </UserRoleProvider>
            </SignalRProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
