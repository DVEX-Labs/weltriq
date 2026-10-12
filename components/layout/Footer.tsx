import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { footerLinks } from "@/data/navigation";
import { contactInfo } from "@/data/contact";

export function Footer() {
  return (
    <footer className="bg-brand-navy text-brand-white pt-16 pb-8 border-t border-brand-navy/10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-display text-3xl font-bold uppercase tracking-tight text-brand-yellow">
                Weltriq
              </span>
            </Link>
            <p className="text-brand-white/80 text-sm max-w-xs text-balance font-sans">
              Professionally managed roofing, with one accountable partner from planning to completion.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display text-lg uppercase text-brand-white">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-brand-white/70 hover:text-brand-yellow transition-colors font-sans">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-1">
              <Link 
                href="/services" 
                className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-brand-yellow hover:text-brand-yellow/80 transition-colors group"
              >
                View All Services <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display text-lg uppercase text-brand-white">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-brand-white/70 hover:text-brand-yellow transition-colors font-sans">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display text-lg uppercase text-brand-white">Contact</h4>
            <ul className="space-y-2 text-sm text-brand-white/70 font-sans">
              <li>{contactInfo.address}</li>
              <li>
                <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="hover:text-brand-yellow transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-brand-yellow transition-colors">
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-brand-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-brand-white/50 font-sans">
            © {new Date().getFullYear()} WELTRIQ. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-brand-white/50 font-sans">
            <span>Facebook</span>
            <span>Instagram</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

