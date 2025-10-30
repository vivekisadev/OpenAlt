import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AlternativesProvider } from "@/context/AlternativesContext";
import Background from "@/components/Background";
import { Header } from "@/components/Header";
import CustomCursor from "@/components/CustomCursor";
import { Providers } from "@/components/Providers";
import Footer from "@/components/Footer";

// Load Inter font
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "OpenAlt - Open Source Alternatives",
  description: "Discover free, open‑source alternatives for paid AI tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-[#030014] text-white selection:bg-indigo-500/30 cursor-none">
        <Providers>
          <AlternativesProvider>
            <CustomCursor />
            <Background />
            <Header />
            {children}
            <Footer />
          </AlternativesProvider>
        </Providers>
      </body>
    </html>
  );
}
