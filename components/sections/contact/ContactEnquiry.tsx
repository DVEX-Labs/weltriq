"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Wrench,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  KERALA_DISTRICTS,
  ROOFING_SERVICES,
} from "@/components/ui/FormField";
import { contactInfo } from "@/data/contact";

export function ContactEnquiry() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    requirement: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    const waMessage = `*New Roofing Enquiry - WELTRIQ*
• *Name:* ${formData.name}
• *Phone:* ${formData.phone}
${formData.email ? `• *Email:* ${formData.email}` : ""}
${formData.district ? `• *District:* ${formData.district}` : ""}
${formData.requirement ? `• *Service:* ${formData.requirement}` : ""}
${formData.message ? `• *Project Notes:* ${formData.message}` : ""}`;

    const targetPhone = contactInfo.whatsappNumber || "918136983928";
    const waLink = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;
    setWhatsappUrl(waLink);

    // 1. Silent Safety Backup: Save to Admin Database
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          district: formData.district,
          service: formData.requirement,
          message: `${formData.message}${formData.email ? ` (Email: ${formData.email})` : ""}`,
          source: "Contact Form",
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
    setIsSubmitted(true);
  };

  return (
    <Section id="enquiry" className="bg-brand-white border-b border-brand-navy/5 py-16 md:py-20 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column - Intro & Commitments */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-display uppercase tracking-widest text-brand-navy/70 bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 inline-block">
                Enquiry Form
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display uppercase leading-[1.15] text-brand-navy tracking-tight">
                Book free site inspection.
              </h2>
              <p className="text-sm sm:text-base text-brand-navy/70 leading-relaxed font-sans text-balance pt-1">
                Tell us about your project. Our technical team will review your requirements, conduct an on-site evaluation, and provide a transparent quotation.
              </p>
            </div>

            {/* Documented Commitments */}
            <div className="space-y-5 pt-6 border-t border-brand-navy/10">
              <div className="flex items-start gap-4 group">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10 transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-white">
                  <Clock className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-display uppercase text-brand-navy tracking-wide">
                    SITE INSPECTION WITHIN 24 HOURS
                  </h3>
                  <p className="text-xs text-brand-navy/65 font-sans mt-0.5 leading-relaxed">
                    Prompt, professional on-site assessment by our senior engineer
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10 transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-white">
                  <ShieldCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-display uppercase text-brand-navy tracking-wide">
                    QUOTATION WITHIN 48 HOURS
                  </h3>
                  <p className="text-xs text-brand-navy/65 font-sans mt-0.5 leading-relaxed">
                    Itemized, transparent cost breakdown with zero hidden fees
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy border border-brand-navy/10 transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-white">
                  <UserCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-display uppercase text-brand-navy tracking-wide">
                    ONE ACCOUNTABLE PARTNER
                  </h3>
                  <p className="text-xs text-brand-navy/65 font-sans mt-0.5 leading-relaxed">
                    Single point of contact from initial plan to final handover
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Enquiry Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-gray-200 bg-brand-white p-6 sm:p-8 md:p-10 shadow-[0_12px_40px_rgba(12,21,51,0.06)] relative">

              {isSubmitted ? (
                <div className="py-12 text-center space-y-6 flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow/20 text-brand-navy">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display uppercase text-brand-navy">
                      Enquiry Received &amp; Connecting!
                    </h3>
                    <p className="text-sm text-brand-navy/70 max-w-md mx-auto font-sans leading-relaxed">
                      Thank you for reaching out to WELTRIQ. Your project details have been recorded, and WhatsApp has been launched to connect you directly with our roofing specialist.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display uppercase tracking-wider text-xs font-bold transition-all shadow-md"
                      >
                        <span>Open WhatsApp Chat Directly</span>
                      </a>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: "",
                          phone: "",
                          email: "",
                          district: "",
                          requirement: "",
                          message: "",
                        });
                      }}
                    >
                      Submit Another Enquiry
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-[system-ui,sans-serif]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Name */}
                    <FormInput
                      label="Full Name"
                      icon={User}
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                    {/* Phone */}
                    <FormInput
                      label="Phone Number"
                      icon={Phone}
                      name="phone"
                      type="tel"
                      required
                      placeholder="Enter your phone number (e.g. +91 97475 06015)"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Email */}
                  <FormInput
                    label="Email Address"
                    icon={Mail}
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  {/* District & Roofing Requirement Grid */}
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
                      label="Roofing Requirement"
                      icon={Wrench}
                      name="requirement"
                      value={formData.requirement}
                      placeholder="Select Roofing Requirement"
                      options={ROOFING_SERVICES}
                      onChange={(val) => setFormData((prev) => ({ ...prev, requirement: val }))}
                    />
                  </div>

                  {/* Location Details & Message */}
                  <FormTextarea
                    label="Location Details & Project Description"
                    icon={FileText}
                    name="message"
                    rows={3}
                    placeholder="Enter location/landmark and describe your roofing requirements..."
                    value={formData.message}
                    onChange={handleChange}
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
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Enquiry</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5] text-inherit" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Trust Micro-badges */}
                  <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-brand-navy/70 font-sans font-medium">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-navy" />
                      100% Free Consultation
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-navy" />
                      Guaranteed 24-Hr Response
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
