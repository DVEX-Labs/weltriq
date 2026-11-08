"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useLenis } from "./SmoothScrollProvider";
import { X, CheckCircle2, Phone, MapPin, User, Clock, ShieldCheck, ArrowRight, Loader2, Wrench, ChevronDown, Check } from "lucide-react";

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

const KERALA_DISTRICTS = [
  "Ernakulam / Kochi",
  "Thrissur",
  "Kozhikode",
  "Thiruvananthapuram",
  "Kottayam",
  "Malappuram",
  "Kannur",
  "Palakkad",
  "Kollam",
  "Alappuzha",
  "Pathanamthitta",
  "Idukki",
  "Wayanad",
  "Kasaragod",
];

const SERVICE_OPTIONS = [
  "General Site Inspection",
  "Clay Tile Roofing",
  "Metal Roofing",
  "Ceramic Roofing",
  "Polycarbonate Roofing",
  "Shingles Roofing",
  "UPVC Roofing",
  "Stone Coated Roofing",
  "Roofing Sheet Installation",
  "Roof Renovation",
];

function CustomSelect({
  label,
  icon: Icon,
  value,
  options,
  required,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  options: readonly string[];
  required?: boolean;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <label className="text-xs font-semibold text-brand-navy flex items-center gap-1.5 font-[system-ui,sans-serif]">
        <Icon className="w-3.5 h-3.5 text-brand-navy shrink-0" />
        <span>{label}</span>
        {required && <span className="text-red-500 font-bold">*</span>}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-3.5 rounded-lg bg-slate-50 border border-brand-navy/20 text-brand-navy text-sm font-[system-ui,sans-serif] focus:outline-none focus:bg-white focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all cursor-pointer flex items-center justify-between text-left"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={`w-4 h-4 text-brand-navy/60 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-brand-navy" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white border border-brand-navy/15 rounded-lg shadow-2xl max-h-48 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-150 font-[system-ui,sans-serif]">
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 text-left text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-brand-navy text-white font-medium"
                    : "text-brand-navy hover:bg-brand-navy/10 hover:text-brand-navy"
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <span className="truncate">{opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-white shrink-0 ml-1.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function InspectionModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState("General Site Inspection");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    district: "Ernakulam / Kochi",
    service: "General Site Inspection",
    notes: "",
  });

  const lenis = useLenis();

  const openModal = useCallback((defaultService?: string) => {
    if (defaultService) {
      setService(defaultService);
      setFormData((prev) => ({ ...prev, service: defaultService }));
    }
    setIsSuccess(false);
    setIsSubmitting(false);
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
          <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden text-brand-navy z-10 animate-in zoom-in-95 duration-200">
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
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-navy flex items-center gap-1.5 font-[system-ui,sans-serif]">
                        <User className="w-3.5 h-3.5 text-brand-navy" />
                        <span>Full Name</span>
                        <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full h-11 px-3.5 rounded-lg bg-slate-50 border border-brand-navy/20 text-brand-navy text-sm font-[system-ui,sans-serif] placeholder:text-brand-navy/40 focus:outline-none focus:bg-white focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-navy flex items-center gap-1.5 font-[system-ui,sans-serif]">
                        <Phone className="w-3.5 h-3.5 text-brand-navy" />
                        <span>Phone Number</span>
                        <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number (e.g. +91 97475 06015)"
                        className="w-full h-11 px-3.5 rounded-lg bg-slate-50 border border-brand-navy/20 text-brand-navy text-sm font-[system-ui,sans-serif] placeholder:text-brand-navy/40 focus:outline-none focus:bg-white focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all"
                      />
                    </div>

                    {/* District & Service Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <CustomSelect
                        label="District (Kerala)"
                        icon={MapPin}
                        value={formData.district}
                        options={KERALA_DISTRICTS}
                        required
                        onChange={(val) => setFormData((prev) => ({ ...prev, district: val }))}
                      />

                      <CustomSelect
                        label="Project Type"
                        icon={Wrench}
                        value={formData.service}
                        options={SERVICE_OPTIONS}
                        required
                        onChange={(val) => setFormData((prev) => ({ ...prev, service: val }))}
                      />
                    </div>

                    {/* Location & Project Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-navy flex items-center gap-1.5 font-[system-ui,sans-serif]">
                        <MapPin className="w-3.5 h-3.5 text-brand-navy" />
                        <span>Location Details & Project Description</span>
                        <span className="text-red-500 font-bold">*</span>
                      </label>
                      <textarea
                        name="notes"
                        required
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Enter location/landmark (e.g. Near Lulu Mall, Edappally) and describe your roofing requirements..."
                        className="w-full p-3.5 rounded-lg bg-slate-50 border border-brand-navy/20 text-brand-navy text-sm font-[system-ui,sans-serif] placeholder:text-brand-navy/40 focus:outline-none focus:bg-white focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all resize-y min-h-[86px]"
                      />
                    </div>

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
