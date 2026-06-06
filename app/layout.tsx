import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist_Mono, Poppins } from "next/font/google";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { AppToaster } from "@/components/ui/app-toaster";
import { getSiteOrigin } from "@/lib/blog/site-url";
import {
  pageDescriptions,
  pageTitles,
  SITE_NAME,
  TITLE_TEMPLATE,
} from "@/lib/seo/page-metadata";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteOrigin = getSiteOrigin();
const defaultDescription = pageDescriptions.home;
const defaultOgImage = "/opengraph-image";

export const metadata: Metadata = {
  metadataBase: siteOrigin ? new URL(`${siteOrigin}/`) : undefined,
  title: {
    default: pageTitles.home,
    template: TITLE_TEMPLATE,
  },
  description: defaultDescription,
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: pageTitles.home,
    description: defaultDescription,
    type: "website",
    siteName: SITE_NAME,
    url: siteOrigin ?? undefined,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Connect Call AI voice agent platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitles.home,
    description: defaultDescription,
    images: [defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip">
        <Navbar />
        <AppToaster />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
