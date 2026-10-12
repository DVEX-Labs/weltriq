import React from "react";
import Link from "next/link";
import { BookOpen, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function BlogEmptyState() {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-6 py-12 px-6 sm:px-10 rounded-2xl border border-brand-navy/10 bg-brand-white shadow-xs">
      <div className="w-12 h-12 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center mx-auto text-brand-navy">
        <BookOpen className="w-6 h-6 text-brand-navy" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-yellow bg-brand-navy/5 px-3.5 py-1 rounded-full border border-brand-navy/10 inline-block">
          COMING SOON
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display uppercase text-brand-navy tracking-tight leading-tight">
          NEW ROOFING INSIGHTS ARE ON THE WAY
        </h2>
        <p className="text-sm sm:text-base text-brand-navy/75 leading-relaxed font-sans max-w-lg mx-auto">
          We&apos;re preparing practical guides and helpful information for your roofing project. Check back soon.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="primary" asChild>
          <Link href="/services">Explore Our Services</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact" className="inline-flex items-center gap-2">
            <PhoneCall className="w-4 h-4" />
            <span>Consult an Expert</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
