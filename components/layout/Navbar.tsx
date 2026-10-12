"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/data/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const prevPathname = useRef(pathname);

  // Close menu when route changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setIsOpen(false);
    }
  }, [pathname]);

  // Lock body scroll when menu is open
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
    <header className="sticky top-0 z-50 w-full border-b border-brand-navy/5 bg-brand-white/95 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 z-50 relative">
            <span className="font-display text-2xl font-bold uppercase tracking-tight text-brand-navy">
              Weltriq
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-brand-yellow font-semibold" : "text-brand-black hover:text-brand-yellow"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="primary" asChild>
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center z-50 relative">
            <button 
              className="flex items-center justify-center w-11 h-11 text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-sm bg-transparent border-0" 
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsOpen(!isOpen)}
              ref={menuTriggerRef}
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div 
          id="mobile-menu"
          className="fixed inset-0 z-40 bg-brand-white pt-24 px-6 md:hidden flex flex-col overflow-y-auto"
          ref={menuRef}
        >
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-2xl font-display uppercase tracking-wide transition-colors ${
                    isActive ? "text-brand-yellow font-bold" : "text-brand-navy hover:text-brand-yellow"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 border-t border-brand-navy/10 pt-8">
            <Button variant="primary" size="lg" className="w-full" asChild>
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
