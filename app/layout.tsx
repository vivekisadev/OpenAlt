import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AlternativesProvider } from "@/context/AlternativesContext";
import Background from "@/components/Background";
import { Header } from "@/components/Header";
import CustomCursor from "@/components/CustomCursor";
import { Providers } from "@/components/Providers";
import Footer from "@/components/Footer";
import GitHubStarPopup from "@/components/GitHubStarPopup";
import FeaturedToolPopup from "@/components/FeaturedToolPopup";

// Load Inter font
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://openalt.org"),
  title: {
    default: "OpenAlt - Free & Open Source Alternatives to Paid AI Tools",
    template: "%s | OpenAlt",
  },
  description: "Discover the best free and open-source alternatives to popular paid AI tools and SaaS products. Save money and reclaim your privacy with community-driven software.",
  keywords: ["Open Source", "Free Software", "AI Tools", "SaaS Alternatives", "Self-hosted", "Developer Tools", "Free AI", "OpenAI Alternatives", "Midjourney Alternatives"],
  authors: [{ name: "OpenAlt Team" }],
  creator: "OpenAlt",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://openalt.org",
    title: "OpenAlt - Free & Open Source Alternatives to Paid AI Tools",
    description: "Find free, open-source replacements for the expensive software you use every day. Join the community moving towards open software.",
    siteName: "OpenAlt",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenAlt - Free & Open Source Alternatives",
    description: "Discover the best free and open-source alternatives to popular paid AI tools. Save money with OpenAlt.",
    creator: "@openalt",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-[#030014] text-white selection:bg-indigo-500/30 cursor-auto">
        <Providers>
          <AlternativesProvider>
            <CustomCursor />
            <Background />
            <Header />
            {children}
            <Footer />
            <GitHubStarPopup />
            <FeaturedToolPopup />
          </AlternativesProvider>
        </Providers>
      </body>
    </html>
  );
}
