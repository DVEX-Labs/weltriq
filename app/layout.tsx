import type { Metadata } from "next";
import { Bakbak_One } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const bakbakOne = Bakbak_One({
  weight: "400",
  variable: "--font-bakbak-one",
  subsets: ["latin"],
});

const garet = localFont({
  src: [
    {
      path: "./fonts/garet/Garet-Book.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/garet/Garet-Heavy.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-garet",
});

export const metadata: Metadata = {
  title: "Weltriq | Roofing Solutions",
  description: "Kerala's Trusted Roofing Solutions Partner. Professionally managed roofing projects from planning to completion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bakbakOne.variable} ${garet.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden" suppressHydrationWarning>
        <SmoothScrollProvider>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
