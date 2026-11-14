"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Check,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Globe,
  Pencil,
  Sparkles,
  Navigation,
} from "lucide-react";
import { CompanyInfo } from "@/lib/company/types";

interface FieldProps {
  fieldKey: keyof CompanyInfo;
  label: string;
  required?: boolean;
  helperText?: string;
  type?: "text" | "email" | "url" | "textarea";
  rows?: number;
  isMono?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  placeholder?: string;
}

type TabType = "contact" | "whatsapp" | "location";

export function AdminCompanyInfo() {
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("contact");

  // Form states
  const [form, setForm] = useState<CompanyInfo>({
    companyName: "WELTRIQ Roofing Solutions",
    tagline: "Kerala's Trusted Roofing Solutions Partner",
    address: "2nd Mile, Mepparambu, Palakkad, Kerala 678006",
    city: "Palakkad",
    district: "Palakkad",
    state: "Kerala",
    pincode: "678006",
    phone: "+91 81369 83928",
    phoneSecondary: "+91 97475 06015",
    email: "weltriq@gmail.com",
    whatsapp: "+91 81369 83928",
    whatsappNumber: "918136983928",
    whatsappDefaultMessage: "Hello WELTRIQ Team, I would like to enquire about your roofing solutions.",
    workingHours: "Mon – Sat: 8:30 AM – 6:30 PM",
    mapEmbedUrl: "",
    mapDirectionsUrl: "https://maps.google.com/?q=Weltriq+Roofing+Palakkad+Kerala",
    website: "www.weltriq.in",
  });
  const [originalForm, setOriginalForm] = useState<CompanyInfo | null>(null);

  // Individual field tracking
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
  const [savingFields, setSavingFields] = useState<Record<string, boolean>>({});
  const [fieldSuccess, setFieldSuccess] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/company");
      if (res.ok) {
        const data = await res.json();
        if (data.info) {
          setForm(data.info);
          setOriginalForm(data.info);
        }
      }
    } catch (err) {
      console.error("Failed to load company info:", err);
      setStatusMessage({ type: "error", text: "Could not fetch company info. Please refresh." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CompanyInfo, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "whatsapp") {
        const digits = value.replace(/[^0-9]/g, "");
        next.whatsappNumber = digits.startsWith("91") ? digits : digits ? `91${digits}` : "";
      }
      return next;
    });
  };

  const startEditField = (key: keyof CompanyInfo) => {
    setEditingFields((prev) => ({ ...prev, [key]: true }));
    setStatusMessage(null);
  };

  const cancelEditField = (key: keyof CompanyInfo) => {
    if (originalForm) {
      setForm((prev) => ({ ...prev, [key]: originalForm[key] }));
    }
    setEditingFields((prev) => ({ ...prev, [key]: false }));
  };

  const saveField = async (key: keyof CompanyInfo) => {
    setSavingFields((prev) => ({ ...prev, [key]: true }));
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update field.");
      }

      if (data.info) {
        setForm(data.info);
        setOriginalForm(data.info);
      }

      setEditingFields((prev) => ({ ...prev, [key]: false }));
      setFieldSuccess((prev) => ({ ...prev, [key]: true }));

      setTimeout(() => {
        setFieldSuccess((prev) => ({ ...prev, [key]: false }));
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving field.";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setSavingFields((prev) => ({ ...prev, [key]: false }));
    }
  };

  const renderField = ({
    fieldKey,
    label,
    required,
    helperText,
    type = "text",
    rows = 3,
    isMono = false,
    icon: Icon,
    placeholder,
  }: FieldProps) => {
    const isEditingThis = !!editingFields[fieldKey];
    const isSavingThis = !!savingFields[fieldKey];
    const isSuccessThis = !!fieldSuccess[fieldKey];

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy">
            {label} {required && <span className="text-red-500">*</span>}
          </label>

          {/* Individual Field Action Button (Edit / Save / Cancel) */}
          <div className="flex items-center gap-1.5">
            {isSuccessThis && (
              <span className="text-[10px] font-sans font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 animate-pulse">
                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                Saved
              </span>
            )}

            {isEditingThis ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => cancelEditField(fieldKey)}
                  disabled={isSavingThis}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-sans text-gray-500 hover:text-brand-navy hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => saveField(fieldKey)}
                  disabled={isSavingThis}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-yellow hover:bg-[#e0b028] text-brand-navy font-display uppercase text-[10px] tracking-wider font-bold shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSavingThis ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  )}
                  <span>{isSavingThis ? "Saving..." : "Save"}</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => startEditField(fieldKey)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-sans font-bold text-brand-navy hover:text-brand-navy/80 hover:bg-brand-navy/5 border border-transparent hover:border-brand-navy/15 transition-all cursor-pointer"
              >
                <Pencil className="w-3 h-3 text-brand-yellow stroke-[2.2]" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          {Icon && (
            <Icon className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400 pointer-events-none" />
          )}

          {type === "textarea" ? (
            <textarea
              rows={rows}
              disabled={!isEditingThis}
              value={form[fieldKey]}
              onChange={(e) => handleChange(fieldKey, e.target.value)}
              placeholder={placeholder}
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all ${
                isMono ? "font-mono" : "font-sans"
              } ${Icon ? "pl-9" : ""} ${
                isEditingThis
                  ? "bg-white border-brand-navy text-brand-navy shadow-xs ring-2 ring-brand-navy/10 focus:outline-none"
                  : "bg-gray-50/80 border-gray-200 text-gray-700 cursor-not-allowed select-text"
              }`}
            />
          ) : (
            <input
              type={type}
              disabled={!isEditingThis}
              value={form[fieldKey]}
              onChange={(e) => handleChange(fieldKey, e.target.value)}
              placeholder={placeholder}
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all ${
                isMono ? "font-mono" : "font-sans"
              } ${Icon ? "pl-9" : ""} ${
                isEditingThis
                  ? "bg-white border-brand-navy text-brand-navy shadow-xs ring-2 ring-brand-navy/10 focus:outline-none"
                  : "bg-gray-50/80 border-gray-200 text-gray-700 cursor-not-allowed select-text"
              }`}
            />
          )}
        </div>

        {helperText && (
          <p className="text-[11px] text-gray-400 font-sans mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-brand-navy animate-spin" />
        <p className="text-xs font-sans text-gray-500 uppercase tracking-widest font-bold">
          Loading Company Profile...
        </p>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: "contact", label: "Phone & Email", icon: Phone, badge: form.phone ? "Active" : undefined },
    { id: "whatsapp", label: "WhatsApp Setup", icon: MessageSquare, badge: form.whatsapp ? "Connected" : undefined },
    { id: "location", label: "Office & Location", icon: MapPin, badge: form.city || "Palakkad" },
  ];

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-yellow" />

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-display uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-navy/5 text-brand-navy border border-brand-navy/15 font-bold flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-brand-yellow" />
              Dynamic Business Data
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display uppercase tracking-tight text-brand-navy font-bold">
            Company Info &amp; Contact Setup
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-sans max-w-2xl leading-relaxed">
            Select a category tab below to review and edit specific contact lines, WhatsApp routing, physical address, or Google Maps navigation.
          </p>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-sans font-medium">{statusMessage.text}</div>
        </div>
      )}

      {/* Tabs Navigation Strip */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/80 overflow-x-auto scrollbar-none select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-display uppercase tracking-wider font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-brand-navy text-brand-white shadow-xs"
                  : "text-gray-600 hover:text-brand-navy hover:bg-white/60"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-brand-yellow stroke-[2.2]" : "text-gray-400"}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-sans px-2 py-0.5 rounded-full font-bold transition-colors ${
                    isActive
                      ? "bg-brand-yellow text-brand-navy"
                      : "bg-gray-200/80 text-gray-600"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div>
        {/* Tab 1: Phone & Email */}
        {activeTab === "contact" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 border border-gray-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                <Phone className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-display uppercase font-bold text-brand-navy tracking-wide">
                  Calling Lines &amp; Customer Inquiries
                </h2>
                <p className="text-xs text-gray-400 font-sans">
                  Direct telephone numbers and email displayed in the website header, footer, and contact section.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderField({
                fieldKey: "phone",
                label: "Primary Phone Number",
                required: true,
                placeholder: "+91 81369 83928",
                helperText: "Main customer hotline displayed prominently across the site.",
              })}

              {renderField({
                fieldKey: "phoneSecondary",
                label: "Secondary Phone Number (Alternative)",
                placeholder: "+91 97475 06015",
                helperText: "Backup engineer line for emergency consultations and site inspections.",
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-gray-100">
              {renderField({
                fieldKey: "email",
                label: "Official Email Address",
                type: "email",
                icon: Mail,
                placeholder: "weltriq@gmail.com",
                helperText: "Used for RFPs, technical drawings, and official estimates.",
              })}

              {renderField({
                fieldKey: "workingHours",
                label: "Business & Consultation Hours",
                icon: Clock,
                placeholder: "Mon – Sat: 8:30 AM – 6:30 PM",
                helperText: "Shown on the Contact page cards and site footer.",
              })}
            </div>
          </div>
        )}

        {/* Tab 2: WhatsApp Setup */}
        {activeTab === "whatsapp" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 border border-gray-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                <MessageSquare className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-display uppercase font-bold text-brand-navy tracking-wide">
                  Connected WhatsApp Business Routing
                </h2>
                <p className="text-xs text-gray-400 font-sans">
                  Controls the floating chat widget on every page and automatic customer consultation redirects.
                </p>
              </div>
            </div>

            {renderField({
              fieldKey: "whatsapp",
              label: "WhatsApp Phone Number",
              required: true,
              placeholder: "+91 81369 83928",
              helperText: "Customer chat hotline. Country code and formatting for WhatsApp chat links are configured automatically.",
            })}

            {renderField({
              fieldKey: "whatsappDefaultMessage",
              label: "Default Pre-filled Chat Greeting",
              type: "textarea",
              rows: 3,
              placeholder: "Hello WELTRIQ Team, I would like to enquire about your roofing solutions.",
              helperText: "Pre-typed message that appears when a customer opens WhatsApp.",
            })}

            {/* Test WhatsApp Link Preview Box */}
            {(() => {
              const rawWa = (form.whatsapp || "").replace(/[^0-9]/g, "");
              const activeWaDigits = rawWa.startsWith("91")
                ? rawWa
                : rawWa
                ? `91${rawWa}`
                : "918136983928";

              return (
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-display uppercase font-bold text-emerald-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Live WhatsApp Chat Link Preview
                    </span>
                    <span className="text-xs text-emerald-700 font-mono block break-all">
                      https://wa.me/{activeWaDigits}?text=...
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/${activeWaDigits}?text=${encodeURIComponent(
                      form.whatsappDefaultMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-bold flex items-center gap-2 shrink-0 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Test Live Chat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })()}
          </div>
        )}

        {/* Tab 3: Office & Location */}
        {activeTab === "location" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 border border-gray-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                <MapPin className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-display uppercase font-bold text-brand-navy tracking-wide">
                  Physical Office &amp; Google Maps Navigation
                </h2>
                <p className="text-xs text-gray-400 font-sans">
                  Official registered office address, district details, and Google Maps destination link.
                </p>
              </div>
            </div>

            {renderField({
              fieldKey: "address",
              label: "Full Physical Address",
              required: true,
              type: "textarea",
              rows: 2,
              placeholder: "2nd Mile, Mepparambu, Palakkad, Kerala 678006",
              helperText: "Complete building, street, and location address.",
            })}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderField({
                fieldKey: "city",
                label: "City / Town",
                placeholder: "Palakkad",
              })}

              {renderField({
                fieldKey: "district",
                label: "District",
                placeholder: "Palakkad",
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderField({
                fieldKey: "state",
                label: "State",
                placeholder: "Kerala",
              })}

              {renderField({
                fieldKey: "pincode",
                label: "Postal PIN Code",
                placeholder: "678006",
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              {renderField({
                fieldKey: "mapDirectionsUrl",
                label: "Google Maps Navigation Link",
                type: "url",
                placeholder: "https://maps.google.com/?q=Weltriq+Roofing+Palakkad+Kerala",
                helperText: "Direct Google Maps link from your phone or browser. Powers 'Get Directions' across the website.",
              })}

              {/* Test Navigation Link Pill (Lightweight, No Heavy Iframe) */}
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-display uppercase font-bold text-blue-900 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    Google Maps Navigation Link
                  </span>
                  <span className="text-xs text-blue-700 font-mono block break-all">
                    {form.mapDirectionsUrl || "https://maps.google.com/?q=Weltriq+Roofing+Palakkad+Kerala"}
                  </span>
                </div>
                <a
                  href={form.mapDirectionsUrl || "https://maps.google.com/?q=Weltriq+Roofing+Palakkad+Kerala"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-[#14204A] text-white text-xs font-sans font-bold flex items-center gap-2 shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  <span>Test Navigation</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-yellow" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
