"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Clock, ShieldCheck, UserCheck } from "lucide-react";

export function ContactEnquiry() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "",
    requirement: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setIsSubmitted(true);
  };

  return (
    <Section id="enquiry" className="bg-brand-white border-b border-brand-navy/5 pt-12 md:pt-16 pb-20 md:pb-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column - Intro & Commitments */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs md:text-sm font-display uppercase tracking-widest font-bold text-brand-yellow">
                Enquiry Form
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase leading-[1.15] text-brand-navy">
                Share Your Roofing Requirement
              </h2>
              <p className="text-base md:text-lg text-brand-navy/75 leading-relaxed font-sans text-balance">
                Share your roofing requirement and WELTRIQ will get in touch with you.
              </p>
            </div>

            {/* Documented Commitments */}
            <div className="space-y-4 pt-4 border-t border-brand-navy/10">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-island-spice text-brand-navy">
                  <Clock className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold uppercase text-brand-navy">
                    SITE INSPECTION WITHIN 24 HOURS
                  </h3>
                  <p className="text-xs text-brand-navy/65 font-sans mt-0.5">
                    Within 24 Hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-island-spice text-brand-navy">
                  <ShieldCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold uppercase text-brand-navy">
                    QUOTATION WITHIN 48 HOURS
                  </h3>
                  <p className="text-xs text-brand-navy/65 font-sans mt-0.5">
                    Within 48 Hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-island-spice text-brand-navy">
                  <UserCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold uppercase text-brand-navy">
                    ONE ACCOUNTABLE PARTNER
                  </h3>
                  <p className="text-xs text-brand-navy/65 font-sans mt-0.5">
                    From planning to completion
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Enquiry Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-sm border border-brand-navy/12 bg-white p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-yellow" />

              {isSubmitted ? (
                <div className="py-12 text-center space-y-6 flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow/20 text-brand-navy">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display uppercase font-bold text-brand-navy">
                      Enquiry Received
                    </h3>
                    <p className="text-sm text-brand-navy/70 max-w-md mx-auto font-sans leading-relaxed">
                      Thank you for reaching out to WELTRIQ. Our team has received your details and will contact you shortly.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        phone: "",
                        email: "",
                        projectType: "",
                        requirement: "",
                        message: "",
                      });
                    }}
                  >
                    Submit Another Enquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-xs font-display font-bold uppercase tracking-wider text-brand-navy">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-brand-island-spice/30"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-xs font-display font-bold uppercase tracking-wider text-brand-navy">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-brand-island-spice/30"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-display font-bold uppercase tracking-wider text-brand-navy">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-brand-island-spice/30"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Project Type */}
                    <div className="space-y-2">
                      <label htmlFor="projectType" className="block text-xs font-display font-bold uppercase tracking-wider text-brand-navy">
                        Project Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-sm border border-brand-navy/20 bg-brand-island-spice/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow font-sans text-brand-navy"
                      >
                        <option value="" disabled>Select project type</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>

                    {/* Requirement */}
                    <div className="space-y-2">
                      <label htmlFor="requirement" className="block text-xs font-display font-bold uppercase tracking-wider text-brand-navy">
                        Roofing Requirement <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="requirement"
                        name="requirement"
                        value={formData.requirement}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-sm border border-brand-navy/20 bg-brand-island-spice/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow font-sans text-brand-navy"
                      >
                        <option value="" disabled>Select roofing requirement</option>
                        <option value="Metal Roofing">Metal Roofing</option>
                        <option value="Clay Tile Roofing">Clay Tile Roofing</option>
                        <option value="Ceramic Roofing">Ceramic Roofing</option>
                        <option value="UPVC Roofing">UPVC Roofing</option>
                        <option value="Polycarbonate Roofing">Polycarbonate Roofing</option>
                        <option value="Roofing Sheet Installation">Roofing Sheet Installation</option>
                        <option value="Roof Renovation">Roof Renovation</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-xs font-display font-bold uppercase tracking-wider text-brand-navy">
                      Message / Project Details
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Describe your roofing project, location, or timeline requirements..."
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-brand-island-spice/30 resize-y min-h-[100px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    Submit Enquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
