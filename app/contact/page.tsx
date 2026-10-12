import React from "react";
import { Metadata } from "next";
import { ContactHero } from "@/components/sections/contact/ContactHero";
import { ContactEnquiry } from "@/components/sections/contact/ContactEnquiry";
import { ContactDirectInfo } from "@/components/sections/contact/ContactDirectInfo";

export const metadata: Metadata = {
  title: "Contact Us | WELTRIQ Roofing Solutions",
  description: "Get in touch with WELTRIQ - Kerala's trusted roofing solutions partner. Contact us for site inspection and roofing quotations.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="w-full">
      {/* 01. Contact Hero */}
      <ContactHero />

      {/* 02. Enquiry Section */}
      <ContactEnquiry />

      {/* 03. Direct Contact */}
      <ContactDirectInfo />
    </main>
  );
}
