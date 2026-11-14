"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { WeltriqLoader } from "@/components/ui/WeltriqLoader";

interface PublicSiteChromeProps {
  children: React.ReactNode;
}

export function PublicSiteChrome({ children }: PublicSiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // On Admin routes: No public navbar, no public footer, no WhatsApp button, no loader
  if (isAdmin) {
    return <div className="min-h-screen w-full flex flex-col">{children}</div>;
  }

  // On Public Website routes: Render full chrome
  return (
    <>
      <WeltriqLoader />
      <Navbar />
      <div className="flex-1 w-full">{children}</div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

