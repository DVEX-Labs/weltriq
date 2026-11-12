import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WeltriqLoader } from "@/components/ui/WeltriqLoader";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { InspectionModalProvider } from "@/components/providers/InspectionModalProvider";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const bakbakOne = localFont({
  src: "./fonts/Bakbak_One/BakbakOne-Regular.ttf",
  variable: "--font-bakbak-one",
  weight: "400",
  style: "normal",
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
  metadataBase: new URL("https://weltriq.in"),
  title: {
    default: "WELTRIQ | Kerala's Trusted Roofing Solutions Partner",
    template: "%s | WELTRIQ Roofing Solutions",
  },
  description:
    "Kerala's Trusted Roofing Solutions Partner. Professionally managed residential, commercial, and industrial roofing projects with single-point accountability.",
  keywords: [
    "Roofing Kerala",
    "Roofing Contractor Palakkad",
    "Kerala Villa Roofing",
    "Truss Work Kerala",
    "Clay Tile Roofing Kerala",
    "Metal Roofing Kerala",
    "Shingles Roofing Kerala",
    "Stone Coated Roofing Kerala",
    "Ceramic Roofing Kerala",
    "Polycarbonate Roofing Kerala",
    "UPVC Roofing Kerala",
    "Roof Renovation Kerala",
    "Weltriq Roofing Solutions",
  ],
  authors: [{ name: "WELTRIQ Roofing Solutions" }],
  creator: "WELTRIQ",
  publisher: "WELTRIQ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/images/logo/weltriq-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://weltriq.in",
    siteName: "WELTRIQ Roofing Solutions",
    title: "WELTRIQ | Kerala's Trusted Roofing Solutions Partner",
    description:
      "Professionally managed roofing across Kerala with single-point accountability, transparent pricing, and guaranteed 24-hr site inspection.",
    images: [
      {
        url: "/images/logo/weltriq-logo.png",
        width: 1200,
        height: 630,
        alt: "WELTRIQ Architectural Roofing Solutions Kerala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WELTRIQ | Kerala's Trusted Roofing Solutions Partner",
    description: "Professionally managed roofing across Kerala from planning to handover.",
    images: ["/images/logo/weltriq-logo.png"],
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

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  "name": "WELTRIQ Roofing Solutions",
  "image": "https://weltriq.in/images/logo/weltriq-logo.png",
  "logo": "https://weltriq.in/images/logo/weltriq-icon.png",
  "@id": "https://weltriq.in",
  "url": "https://weltriq.in",
  "telephone": ["+919747506015", "+918136983928"],
  "email": "info@weltriq.in",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2nd Mile, Mepparambu",
    "addressLocality": "Palakkad",
    "addressRegion": "Kerala",
    "postalCode": "678006",
    "addressCountry": "IN",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 10.7867,
    "longitude": 76.6548,
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:30",
    },
  ],
  "areaServed": [
    { "@type": "State", "name": "Kerala" },
    { "@type": "City", "name": "Palakkad" },
    { "@type": "City", "name": "Thrissur" },
    { "@type": "City", "name": "Ernakulam" },
    { "@type": "City", "name": "Kozhikode" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bakbakOne.variable} ${garet.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans overflow-x-clip" suppressHydrationWarning>
        <WeltriqLoader />
        <SmoothScrollProvider>
          <InspectionModalProvider>
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <WhatsAppButton />
          </InspectionModalProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
