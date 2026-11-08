"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/data/navigation";
import { useInspectionModal } from "@/components/providers/InspectionModalProvider";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  const { openModal } = useInspectionModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const prevPathname = useRef(pathname);

  // Scroll detection for floating capsule compression & shadow elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setIsOpen(false);
    }
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const menu = menuRef.current;
    const trigger = menuTriggerRef.current;

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusFirst = () => {
      const first = menu?.querySelector<HTMLElement>(focusableSelector);
      first?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        requestAnimationFrame(() => trigger?.focus());
        return;
      }

      if (event.key !== "Tab" || !menu) return;

      const focusables = Array.from(
        menu.querySelectorAll<HTMLElement>(focusableSelector)
      );

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(focusFirst);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Island Navigation Header */}
      <header className="fixed top-3 sm:top-4 md:top-5 inset-x-0 z-50 w-full px-3 sm:px-4 md:px-6 pointer-events-none transition-all duration-300 animate-navbar-entrance">
        <div 
          className={`mx-auto max-w-6xl w-full pointer-events-auto transition-all duration-300 rounded-full border backdrop-blur-xl ${
            isScrolled 
              ? "bg-brand-white/95 border-brand-navy/15 shadow-[0_12px_36px_rgba(12,21,51,0.12)] py-2 sm:py-2.5 px-4 sm:px-6" 
              : "bg-brand-white/90 border-brand-navy/10 shadow-[0_8px_30px_rgba(12,21,51,0.07)] py-2.5 sm:py-3 px-4 sm:px-6"
          }`}
        >
          <div className="flex items-center justify-between gap-3 md:gap-4">
            {/* Official Brand Logo */}
            <Link 
              href="/" 
              className="flex items-center shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-xl transition-transform duration-200 group-hover:scale-[1.02]"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/images/logo/weltriq-logo.png"
                alt="WELTRIQ - Professional Roofing Solutions"
                width={180}
                height={50}
                priority
                className="h-9 sm:h-10 md:h-11 w-auto object-contain"
              />
            </Link>
            
            {/* Centered Segmented Navigation Dock */}
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-full border border-brand-navy/8 bg-brand-navy/[0.03]">
              {navLinks.map((link) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-xs font-display uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                      isActive 
                        ? "bg-brand-navy text-brand-white shadow-xs scale-[1.02]" 
                        : "text-brand-navy/75 hover:text-brand-navy hover:bg-brand-navy/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* Right Action Utilities */}
            <div className="hidden md:flex items-center shrink-0">
              <Button 
                variant="primary" 
                size="default" 
                onClick={() => openModal("General Site Inspection")}
                className="rounded-full px-5 py-2 sm:py-2.5 text-xs font-display uppercase tracking-wider shadow-[0_2px_12px_rgba(255,198,39,0.3)] hover:shadow-[0_4px_16px_rgba(255,198,39,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5"
              >
                <span>Book Site Inspection</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden flex items-center z-50 relative">
              <button 
                className="flex items-center justify-center w-10 h-10 text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-full bg-brand-navy/5 border border-brand-navy/10 transition-colors" 
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsOpen(!isOpen)}
                ref={menuTriggerRef}
              >
                {isOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-brand-navy/25 backdrop-blur-xs md:hidden pointer-events-auto transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Floating Drawer */}
      {isOpen && (
        <div 
          id="mobile-menu"
          className="fixed inset-x-3 sm:inset-x-4 top-18 sm:top-20 max-w-lg mx-auto z-50 rounded-3xl border border-brand-navy/10 bg-brand-white/98 backdrop-blur-2xl shadow-2xl p-6 md:hidden flex flex-col justify-between pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-200"
          ref={menuRef}
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-display uppercase tracking-widest text-brand-navy/40">
                Menu Navigation
              </span>
              <span className="text-[11px] font-sans text-brand-navy/50">
                Kerala, India
              </span>
            </div>
            <nav className="flex flex-col space-y-1.5">
              {navLinks.map((link) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-2xl text-sm font-display uppercase tracking-wider transition-all duration-200 flex items-center justify-between ${
                      isActive 
                        ? "bg-brand-navy text-brand-white shadow-md" 
                        : "text-brand-navy hover:bg-brand-navy/5"
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-brand-yellow" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-brand-navy/30" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-brand-navy/10 pt-5 mt-6 space-y-3.5">
            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-full text-xs font-display uppercase tracking-wider shadow-md"
              onClick={() => {
                setIsOpen(false);
                openModal("General Site Inspection");
              }}
            >
              Book Site Inspection
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
