"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useLenis } from "./SmoothScrollProvider";
import { X, CheckCircle2, Phone, MapPin, User, Clock, ShieldCheck, ArrowRight, Loader2, Wrench } from "lucide-react";
import { FormInput, FormSelect, FormTextarea, KERALA_DISTRICTS, ROOFING_SERVICES } from "@/components/ui/FormField";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      return;
    }
    setIsSubmitting(true);

    // Save lead to local storage for safety/testing
    try {
      const stored = localStorage.getItem("weltriq_leads");
      const leads = stored ? JSON.parse(stored) : [];
      leads.push({
        ...formData,
        date: new Date().toISOString(),
      });
      localStorage.setItem("weltriq_leads", JSON.stringify(leads));
    } catch {
      // Ignore local storage error
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  return (
    <InspectionModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}

      {/* MODAL OVERLAY & DIALOG */}
      {isOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-[#0B1526]/85 backdrop-blur-md transition-opacity"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <div
            data-lenis-prevent="true"
            className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden text-brand-navy z-10 animate-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              {isSuccess ? (
                /* SUCCESS STATE */
                <div className="py-6 flex flex-col items-center text-center space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-brand-navy/5 border border-brand-navy/15 flex items-center justify-center text-brand-navy">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-sans uppercase tracking-widest text-brand-navy/60 font-semibold">
                      Booking Confirmed
                    </span>
                    <h3 id="modal-title" className="text-2xl sm:text-3xl font-display uppercase text-brand-navy">
                      Request Received!
                    </h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto font-sans leading-relaxed">
                      Thank you, <span className="font-semibold text-brand-navy">{formData.name || "valued client"}</span>! Our technical site coordinator will call you at{" "}
                      <span className="font-semibold text-brand-navy">{formData.phone}</span> within 24 hours to schedule the on-site inspection.
                    </p>
                  </div>

                  <div className="w-full pt-4">
                    <button
                      type="button"
                      className="w-full h-12 bg-brand-navy text-brand-white hover:bg-brand-navy/90 rounded-lg font-display uppercase tracking-wider text-sm transition-all cursor-pointer"
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
                  <div className="mb-6 space-y-2">
                    <Image
                      src="/images/logo/weltriq-logo.png"
                      alt="WELTRIQ - Professional Roofing Solutions"
                      width={160}
                      height={44}
                      className="h-8 sm:h-9 w-auto object-contain mb-2"
                    />
                    <h2 id="modal-title" className="text-2xl sm:text-3xl font-display uppercase text-brand-navy tracking-wide">
                      Book Site Inspection
                    </h2>

                    <p className="text-xs sm:text-sm text-brand-navy/70 font-sans leading-relaxed">
                      Share your contact details. A WELTRIQ technical engineer will visit your site within 24 hours with zero obligations.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 font-[system-ui,sans-serif]">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Enter location/landmark (e.g. Near Lulu Mall, Edappally) and describe your roofing requirements..."
                    />

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-brand-navy text-brand-white hover:bg-brand-navy/90 hover:shadow-lg font-display uppercase tracking-wider text-sm rounded-lg border border-brand-navy shadow-md active:translate-y-0 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
                    <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-brand-navy/70 font-sans font-medium">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-navy" />
                        100% Free & No Obligation
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-navy" />
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
