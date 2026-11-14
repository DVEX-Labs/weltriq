"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useLenis } from "./SmoothScrollProvider";
import { X, CheckCircle2, Phone, MapPin, User, Clock, ShieldCheck, ArrowRight, Loader2, Wrench } from "lucide-react";
import { FormInput, FormSelect, FormTextarea, KERALA_DISTRICTS, ROOFING_SERVICES } from "@/components/ui/FormField";
import { contactInfo } from "@/data/contact";

interface InspectionModalContextType {
  isOpen: boolean;
  openModal: (defaultService?: string) => void;
  closeModal: () => void;
}

const InspectionModalContext = createContext<InspectionModalContextType | undefined>(undefined);

export function useInspectionModal() {
  const context = useContext(InspectionModalContext);
  if (!context) {
    throw new Error("useInspectionModal must be used within an InspectionModalProvider");
  }
  return context;
}

export function InspectionModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    district: "",
    service: "",
    notes: "",
  });

  const lenis = useLenis();

  const openModal = useCallback((defaultService?: string) => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setWhatsappUrl("");
    setFormData((prev) => ({
      ...prev,
      service: defaultService || prev.service || "",
    }));
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Control scrolling with Lenis and body styles when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (lenis) {
        lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      if (lenis) {
        lenis.start();
      }
    }

    return () => {
      document.body.style.overflow = "";
      if (lenis) {
        lenis.start();
      }
    };
  }, [isOpen, lenis]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      return;
    }
    setIsSubmitting(true);

    const waMessage = `*Free Site Inspection Request - WELTRIQ*
• *Name:* ${formData.name}
• *Phone:* ${formData.phone}
${formData.district ? `• *District:* ${formData.district}` : ""}
${formData.service ? `• *Service:* ${formData.service}` : ""}
${formData.notes ? `• *Notes:* ${formData.notes}` : ""}`;

    const targetPhone = contactInfo.whatsappNumber || "918136983928";
    const waLink = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;
    setWhatsappUrl(waLink);

    // 1. Silent Safety Backup: Save lead to Admin Database
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          district: formData.district,
          service: formData.service,
          message: formData.notes,
          source: "Inspection Modal",
        }),
      });
    } catch (err) {
      console.warn("Silent backup lead error:", err);
    }

    // 2. Immediate WhatsApp Launch
    try {
      window.open(waLink, "_blank");
    } catch { }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <InspectionModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}

      {/* MODAL OVERLAY & DIALOG */}
      {isOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-[#0B1526]/80 backdrop-blur-md transition-opacity"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal Card - Fully responsive across small phones, tablets, and large displays */}
          <div
            data-lenis-prevent="true"
            className="relative w-full max-w-lg sm:max-w-xl bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-brand-navy z-10 my-auto max-h-[calc(100dvh-1.5rem)] sm:max-h-[min(90dvh,840px)] flex flex-col animate-in zoom-in-95 duration-200"
          >
            {/* Top Brand Accent Gradient Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-yellow via-amber-400 to-brand-navy shrink-0" />

            {/* Close Button - Large touch target with comfortable padding */}
            <button
              onClick={closeModal}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-400 hover:text-brand-navy bg-slate-100/70 hover:bg-slate-200/90 rounded-full transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Scrollable Modal Content Body */}
            <div className="overflow-y-auto overscroll-contain flex-1 p-5 sm:p-7 md:p-8">
              {isSuccess ? (
                /* SUCCESS STATE */
                <div className="py-4 sm:py-6 flex flex-col items-center text-center space-y-4 sm:space-y-5 animate-in fade-in duration-300">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-navy/5 border border-brand-navy/15 flex items-center justify-center text-brand-navy">
                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <span className="text-[11px] sm:text-xs font-sans uppercase tracking-widest text-brand-navy/60 font-semibold">
                      Booking Confirmed
                    </span>
                    <h3 id="modal-title" className="text-xl sm:text-2xl md:text-3xl font-display uppercase text-brand-navy">
                      Request Received!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto font-sans leading-relaxed">
                      Thank you, <span className="font-semibold text-brand-navy">{formData.name || "valued client"}</span>! Our technical site coordinator will call you at{" "}
                      <span className="font-semibold text-brand-navy">{formData.phone}</span> within 24 hours to schedule the on-site inspection.
                    </p>
                  </div>

                  <div className="w-full pt-3 sm:pt-4 flex flex-col gap-2.5">
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-11 sm:h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-display uppercase tracking-wider text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
                      >
                        <span>Open WhatsApp Chat Directly</span>
                      </a>
                    )}
                    <button
                      type="button"
                      className="w-full h-10 sm:h-11 bg-brand-navy/10 hover:bg-brand-navy/15 text-brand-navy rounded-xl font-display uppercase tracking-wider text-xs font-bold transition-all cursor-pointer active:scale-[0.99]"
                      onClick={closeModal}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM STATE */
                <div>
                  {/* Header */}
                  <div className="mb-4 sm:mb-6 space-y-1.5 sm:space-y-2 pr-7 sm:pr-8">
                    <Image
                      src="/logo/weltriq-logo.svg"
                      alt="WELTRIQ - Professional Roofing Solutions"
                      width={190}
                      height={48}
                      className="h-8 sm:h-9.5 w-auto object-contain mb-1.5"
                    />
                    <h2 id="modal-title" className="text-xl sm:text-2xl md:text-3xl font-display uppercase text-brand-navy tracking-tight leading-[1.15]">
                      Book free site inspection.
                    </h2>

                    <p className="text-xs sm:text-sm text-brand-navy/70 font-sans leading-relaxed">
                      Share your contact details. A WELTRIQ technical engineer will visit your site within 24 hours with zero obligations.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 font-[system-ui,sans-serif]">
                    {/* Full Name */}
                    <FormInput
                      label="Full Name"
                      icon={User}
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />

                    {/* Phone Number */}
                    <FormInput
                      label="Phone Number"
                      icon={Phone}
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number (e.g. +91 97475 06015)"
                    />

                    {/* District & Service Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                      <FormSelect
                        label="District (Kerala)"
                        icon={MapPin}
                        name="district"
                        value={formData.district}
                        placeholder="Select District"
                        options={KERALA_DISTRICTS}
                        onChange={(val) => setFormData((prev) => ({ ...prev, district: val }))}
                      />

                      <FormSelect
                        label="Project Type"
                        icon={Wrench}
                        name="service"
                        value={formData.service}
                        placeholder="Select Project Type"
                        options={ROOFING_SERVICES}
                        onChange={(val) => setFormData((prev) => ({ ...prev, service: val }))}
                      />
                    </div>

                    {/* Location & Project Description */}
                    <FormTextarea
                      label="Location Details & Project Description"
                      icon={MapPin}
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Enter location/landmark (e.g. Near Lulu Mall, Edappally) and describe your roofing requirements..."
                    />

                    {/* Submit Button */}
                    <div className="pt-1.5 sm:pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 sm:h-12 bg-brand-navy text-brand-white hover:bg-[#14204A] hover:shadow-lg font-display uppercase tracking-wider text-xs sm:text-sm font-bold rounded-xl border border-brand-navy shadow-md active:scale-[0.99] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-inherit" />
                            <span>Confirming Inspection...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm Site Inspection</span>
                            <ArrowRight className="w-4 h-4 stroke-[2.5] text-inherit" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Bottom Badges */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3.5 pt-1 text-[10px] sm:text-[11px] text-brand-navy/70 font-sans font-medium text-center">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-navy shrink-0" />
                        100% Free &amp; No Obligation
                      </span>
                      <span className="hidden sm:inline text-brand-navy/30">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-navy shrink-0" />
                        Guaranteed 24-Hr Visit
                      </span>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </InspectionModalContext.Provider>
  );
}
