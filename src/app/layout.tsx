import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Apply the persisted theme before first paint to avoid a flash of the wrong theme. */}
        <script
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
