"use client";

import React, { useState } from "react";
import { contactInfo } from "@/data/contact";

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = contactInfo.whatsappNumber || "918136983928";
  const defaultMessage = encodeURIComponent(
    contactInfo.whatsappDefaultMessage ||
      "Hello WELTRIQ Team, I would like to enquire about your roofing solutions."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-5 sm:bottom-6 right-5 sm:right-6 z-40 pointer-events-auto select-none print:hidden flex items-center">
      {/* Left-Side Navy Tooltip Pill with White Text on Hover */}
      <div
        className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2 pointer-events-none"
        }`}
        aria-hidden="true"
      >
        <div className="relative bg-brand-navy text-white text-[11px] sm:text-xs font-display uppercase tracking-wider font-bold py-1.5 px-3 rounded-full shadow-[0_6px_20px_rgba(12,21,51,0.35)] border border-white/15 whitespace-nowrap flex items-center gap-1.5">
          {/* Active online green pulse indicator */}
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] shrink-0 animate-pulse" />
          <span>Chat with us</span>
          {/* Subtle Right Caret Pointer */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-brand-navy rotate-45 border-r border-t border-white/15" />
        </div>
      </div>

      {/* Circular Green WhatsApp Button (Enhanced Comfortable Touch & Click Size) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with WELTRIQ Roofing on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white shadow-[0_4px_16px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_24px_rgba(37,211,102,0.6)] animate-whatsapp-breathe hover:scale-105 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] touch-manipulation cursor-pointer focus:outline-none focus-visible:ring-3 focus-visible:ring-[#25D366]/40"
      >
        {/* Official WhatsApp Vector Icon */}
        <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110">
          <svg
            viewBox="0 0 24 24"
            width="100%"
            height="100%"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-xs"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.995.545 1.761.779 2.796.779h.001c3.181 0 5.768-2.586 5.768-5.766 0-3.18-2.587-5.766-5.769-5.766zm3.377 8.203c-.145.408-.738.747-1.02.779-.272.03-.62.052-1.008-.073-.243-.078-.553-.191-.979-.375-1.815-.783-2.999-2.616-3.09-2.738-.09-.122-.738-.982-.738-1.871 0-.89.467-1.328.633-1.508.167-.18.364-.225.485-.225.122 0 .243.002.349.007.112.005.263-.042.411.314.152.365.517 1.26.562 1.352.045.092.076.2.015.321-.061.122-.091.198-.182.305-.091.107-.191.239-.273.321-.092.091-.188.191-.081.374.106.183.473.78 1.014 1.262.697.621 1.285.814 1.468.905.182.091.289.076.395-.046.107-.121.456-.531.578-.714.121-.182.243-.152.408-.091.167.061 1.061.501 1.243.592.182.091.304.137.349.213.045.076.045.439-.1.847z" />
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.527 3.66 1.442 5.176L2 22l4.982-1.409A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.053c-1.615 0-3.167-.441-4.526-1.235l-.324-.191-2.97.779.792-2.894-.21-.334A8.04 8.04 0 013.947 12c0-4.441 3.612-8.053 8.053-8.053 4.441 0 8.053 3.612 8.053 8.053 0 4.441-3.612 8.053-8.053 8.053z" />
          </svg>
        </div>
      </a>
    </div>
  );
}

