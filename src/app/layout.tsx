import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";

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
        className={`${tajawal.variable} font-sans min-h-screen antialiased flex flex-col bg-dot-pattern relative`}
      >
        {/* Background decorative elements */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-white">
          <div className="absolute inset-0 bg-gradient-to-tr bg-white" />
          <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        {/* Gradient blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-[40%] -top-[40%] h-[80%] w-[80%] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-[30%] -left-[30%] h-[70%] w-[70%] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <Header />
        <main className="flex-1 md:py-4 py-2 relative bg-white">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
            {children}
          </div>
        </main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              direction: "rtl",
              fontFamily: "var(--font-tajawal)",
            },
          }}
          duration={2000}
          theme="light"
          richColors
        />
      </body>
    </html>
  );
}
