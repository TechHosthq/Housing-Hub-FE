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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased font-sans`}>
        <UserRoleProvider>
          {children}
        </UserRoleProvider>
      </body>
    </html>
  );
}
