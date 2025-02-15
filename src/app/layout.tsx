import type { Metadata, Viewport } from "next";
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

// App name and metadata constants
const APP_NAME = "الإتحاد العام للطلبة الموريتانيين - UGEM";
const APP_DEFAULT_TITLE =
  "الإتحاد العام للطلبة الموريتانيين - منصة تسجيل المنتسبين";
const APP_TITLE_TEMPLATE = "%s - UGEM";
const APP_DESCRIPTION =
  "المنصة الرسمية للإتحاد العام للطلبة الموريتانيين - منصة تسجيل وإدارة المنتسبين";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ugem-candidates.vercel.app/"),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: "https://ugem-candidates.vercel.app/",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "UGEM - الإتحاد العام للطلبة الموريتانيين",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: ["/api/og"],
    creator: "@ugem",
    site: "@ugem",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "UGEM",
    "الإتحاد العام للطلبة الموريتانيين",
    "طلاب موريتانيا",
    "تسجيل المنتسبين",
    "منصة الطلاب",
    "اتحاد الطلبة",
    "موريتانيا",
    "تسجيل الطلاب",
    "جامعة نواكشوط",
    "طلاب موريتانيين",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  category: "education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${tajawal.variable} font-sans antialiased flex flex-col min-h-screen bg-dot-pattern relative`}
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
        <main className="flex-1 flex flex-col relative">
          <div className="p-3 md:p-6 flex-1 flex flex-col">{children}</div>
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
