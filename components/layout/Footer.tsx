import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { contactInfo } from "@/data/contact";

export function Footer() {
  return (
    <footer className="bg-brand-navy text-brand-white border-t border-brand-white/10">
      <Container className="py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-brand-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-xl">
              <Image
                src="/images/logo/weltriq-logo-white.png"
                alt="WELTRIQ - Professional Roofing Solutions"
                width={210}
                height={58}
                className="h-10 sm:h-12 w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
            </Link>

            <p className="text-sm text-brand-white/60 max-w-sm leading-relaxed font-sans">
              Professionally managed roofing across Kerala. One accountable partner from planning to handover.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3.5">
            <span className="text-[11px] font-display uppercase tracking-[0.18em] text-brand-white/40 block">
              Pages
            </span>
            <ul className="space-y-2 text-sm text-brand-white/65 font-sans">
              <li>
                <Link href="/" className="hover:text-brand-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-3.5">
            <span className="text-[11px] font-display uppercase tracking-[0.18em] text-brand-white/40 block">
              Solutions
            </span>
            <ul className="space-y-2 text-sm text-brand-white/65 font-sans">
              <li>
                <Link href="/services#service-card-clay-tile" className="hover:text-brand-white transition-colors">
                  Clay Tile Roofing
                </Link>
              </li>
              <li>
                <Link href="/services#service-card-metal" className="hover:text-brand-white transition-colors">
                  Metal Roofing
                </Link>
              </li>
              <li>
                <Link href="/services#service-card-shingles" className="hover:text-brand-white transition-colors">
                  Shingles Roofing
                </Link>
              </li>
              <li>
                <Link href="/services#service-card-stone-coated" className="hover:text-brand-white transition-colors">
                  Stone Coated Roofing
                </Link>
              </li>
              <li>
                <Link href="/services#service-card-renovation" className="hover:text-brand-white transition-colors">
                  Roof Renovation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3.5">
            <span className="text-[11px] font-display uppercase tracking-[0.18em] text-brand-white/40 block">
              Contact
            </span>
            <ul className="space-y-2 text-sm text-brand-white/65 font-sans">
              <li className="text-brand-white/50 leading-relaxed">
                {contactInfo.address}, Kerala
              </li>
              <li>
                <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="hover:text-brand-white transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-brand-white transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/919747506015" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand-white transition-colors"
                >
                  WhatsApp Chat
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-brand-white/40 font-sans">
          <p>© {new Date().getFullYear()} WELTRIQ. All rights reserved.</p>
          <p>Palakkad, Kerala, India</p>
        </div>
      </Container>
    </footer>
  );
}
