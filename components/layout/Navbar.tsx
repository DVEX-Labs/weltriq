"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/data/navigation";
import { useInspectionModal } from "@/components/providers/InspectionModalProvider";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  const { openModal } = useInspectionModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  // Secret Admin Portal Trigger: 3 quick clicks on the WELTRIQ logo
  const logoClicksRef = useRef(0);
  const logoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    setIsOpen(false);
    logoClicksRef.current += 1;

    if (logoTimerRef.current) {
      clearTimeout(logoTimerRef.current);
    }

    if (logoClicksRef.current >= 3) {
      e.preventDefault();
      logoClicksRef.current = 0;
      router.push("/admin");
      return;
    }

    // Reset counter after 1.2s of inactivity
    logoTimerRef.current = setTimeout(() => {
      logoClicksRef.current = 0;
    }, 1200);
  };

  const prevPathname = useRef(pathname);

  // Scroll detection for floating capsule compression & shadow elevation with smooth rAF throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 25);
          ticking = false;
        });
        ticking = true;
      }
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
      {/* Floating Island Navigation Header (Contained Pill - Never Edge-to-Edge Full Width) */}
      <header className="fixed top-3 sm:top-4 md:top-5 inset-x-0 z-50 w-full px-3 sm:px-4 md:px-6 pointer-events-none transition-all duration-500 ease-out animate-navbar-entrance">
        <div 
          className={`mx-auto max-w-6xl w-full pointer-events-auto transition-all duration-500 ease-out rounded-full border backdrop-blur-2xl py-1.5 sm:py-2 lg:py-2.5 px-3.5 sm:px-5 lg:px-6 ${
            isScrolled 
              ? "bg-brand-white/95 border-brand-navy/15 shadow-[0_12px_36px_rgba(12,21,51,0.12)]" 
              : "bg-white/25 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          }`}
        >
          <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 w-full min-w-0">
            {/* Official Brand Logo - Authentic Original Colors (Consistent Sleek Height + 3-Click Admin Shortcut) */}
            <Link 
              href="/" 
              className="flex items-center shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-xl transition-transform duration-200 group-hover:scale-[1.02]"
              onClick={handleLogoClick}
            >
              <Image
                src="/logo/weltriq-logo.svg"
                alt="WELTRIQ - Professional Roofing Solutions"
                width={220}
                height={54}
                priority
                className="w-auto object-contain h-9 sm:h-10 lg:h-[40px] xl:h-[42px] transition-all duration-500 ease-out"
              />
            </Link>
            
            {/* Centered Segmented Navigation Dock (Desktop ≥ 1024px) */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0">
              {navLinks.map((link) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-[11px] xl:text-xs font-display uppercase tracking-wider px-2.5 xl:px-3.5 py-1 xl:py-1.5 rounded-full transition-colors duration-500 ease-out whitespace-nowrap ${
                      isActive 
                        ? "bg-brand-navy text-brand-white shadow-xs scale-[1.02]" 
                        : isScrolled 
                          ? "text-brand-navy/75 hover:text-brand-navy hover:bg-brand-navy/5" 
                          : "text-white hover:text-white hover:bg-white/15 drop-shadow-xs"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* Right Action Utilities & Tablet/Mobile Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Full CTA Button on Desktop (≥ 1024px) */}
              <div className="hidden lg:flex items-center">
                <Button 
                  variant="primary" 
                  size="default" 
                  onClick={() => openModal("General Site Inspection")}
                  className="rounded-full text-[11px] xl:text-xs font-display uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap px-3.5 xl:px-4.5 py-1.5 xl:py-2 shadow-none hover:shadow-none hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Book Site Inspection</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Button>
              </div>

              {/* Compact CTA Button on Tablet (640px – 1023px) */}
              <div className="hidden sm:flex lg:hidden items-center">
                <Button 
                  variant="primary" 
                  size="default" 
                  onClick={() => openModal("General Site Inspection")}
                  className="rounded-full px-3.5 py-1.5 text-[11px] font-display uppercase tracking-wider shadow-none hover:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-1 whitespace-nowrap"
                >
                  <span>Book Inspection</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </Button>
              </div>

              {/* Hamburger Toggle (Mobile & Tablet: < 1024px) */}
              <div className="lg:hidden flex items-center z-50 relative">
                <button 
                  className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-full border transition-all duration-500 ease-out cursor-pointer ${
                    isScrolled 
                      ? "text-brand-navy bg-brand-navy/5 border-brand-navy/10 hover:bg-brand-navy/10" 
                      : "text-white bg-white/15 border-white/25 hover:bg-white/25 backdrop-blur-md"
                  }`}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setIsOpen(!isOpen)}
                  ref={menuTriggerRef}
                >
                  {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-brand-navy/25 backdrop-blur-xs lg:hidden pointer-events-auto transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Floating Drawer */}
      {isOpen && (
        <div 
          id="mobile-menu"
          className="fixed inset-x-3 sm:inset-x-4 top-18 sm:top-20 max-w-lg mx-auto z-50 rounded-3xl border border-brand-navy/10 bg-brand-white/98 backdrop-blur-2xl shadow-2xl p-6 lg:hidden flex flex-col justify-between pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-200"
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
