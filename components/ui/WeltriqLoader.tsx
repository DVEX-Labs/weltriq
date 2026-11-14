"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export function WeltriqLoader() {
  const [show, setShow] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 1. Allow natural breathing cycle, then begin smooth curtain fade at 1.4s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      if (typeof window !== "undefined") {
        (window as unknown as { __WELTRIQ_LOADED__?: boolean }).__WELTRIQ_LOADED__ = true;
        window.dispatchEvent(new CustomEvent("weltriq-loader-finish"));
      }
    }, 1400);

    // 2. Completely unmount from DOM at 2.0s once fade-out completes
    const unmountTimer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-white flex items-center justify-center transition-opacity duration-600 ease-out select-none ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Pristine Clean Solid White Canvas - Zero Yellow, Zero Lines */}
      <div className="relative flex items-center justify-center px-6">
        {/* Navbar Logo with Smooth "Breathe In / Breathe Out" Animation */}
        <div className="animate-logo-breathe">
          <Image
            src="/logo/weltriq-logo.svg"
            alt="WELTRIQ - Professional Roofing Solutions"
            width={320}
            height={80}
            priority
            className="h-14 sm:h-16 md:h-20 w-auto object-contain select-none"
          />
        </div>
      </div>
    </div>
  );
}
