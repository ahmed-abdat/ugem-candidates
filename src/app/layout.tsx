import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Configure Tajawal font for Arabic text
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "الإتحاد العام للطلبة الموريتانيين - UGEM",
  description: "المنصة الرسمية للإتحاد العام للطلبة الموريتانيين",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${tajawal.variable} font-sans min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 antialiased flex flex-col`}
      >
        <Header />
        <main className="flex-1 md:py-4 py-2">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
