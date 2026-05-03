import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { AppToaster } from "@/components/ui/app-toaster";
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

export const metadata: Metadata = {
  title: "CCAI",
  description: "AI voice agent landing page for CCAI.",
  icons: {
    icon: "/tab-logo.png",
    apple: "/tab-logo.png",
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
      <body className="min-h-full flex flex-col">
        <Navbar />
        <AppToaster />
        {children}
        <Footer />
      </body>
    </html>
  );
}
