"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

export const KERALA_DISTRICTS = [
  "Alappuzha",
  "Ernakulam / Kochi",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Thrissur",
  "Wayanad",
] as const;

export const ROOFING_SERVICES = [
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
] as const;

// 1. Reusable FormInput Component
export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ElementType;
  required?: boolean;
}

export function FormInput({
  label,
  icon: Icon,
  required,
  id,
  className = "",
  ...props
}: FormInputProps) {
  const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5 font-[system-ui,sans-serif]">
      <label
        htmlFor={inputId}
        className="text-xs font-semibold text-brand-navy flex items-center gap-1.5 font-[system-ui,sans-serif]"
      >
        <Icon className="w-3.5 h-3.5 text-brand-navy shrink-0" />
        <span>{label}</span>
        {required && <span className="text-red-500 font-bold">*</span>}
      </label>
      <input
        id={inputId}
        required={required}
        className={`w-full h-11 px-3.5 rounded-lg bg-slate-50 border border-brand-navy/20 text-brand-navy text-sm font-[system-ui,sans-serif] placeholder:text-brand-navy/40 focus:outline-none focus:bg-white focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all ${className}`}
        {...props}
      />
    </div>
  );
}

// 2. Reusable FormSelect Component with Touch & Wheel Scrollable Dropdown
export interface FormSelectProps {
  label: string;
  icon: React.ElementType;
  value: string;
  options: readonly string[] | string[];
  placeholder?: string;
  required?: boolean;
  name?: string;
  id?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FormSelect({
  label,
  icon: Icon,
  value,
  options,
  placeholder = "Select an option",
  required,
  name,
  id,
  onChange,
  className = "",
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectId = id || name || label.toLowerCase().replace(/\s+/g, "-");

  // Close dropdown on outside click or tap
  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("touchstart", handleOutside, { passive: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Smooth scroll selected option into view when opened
  useEffect(() => {
    if (isOpen && listRef.current && value) {
      const selectedEl = listRef.current.querySelector<HTMLElement>('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [isOpen, value]);

  // Dedicated wheel listener on the dropdown container to guarantee 100% fluid mouse wheel scrolling
  useEffect(() => {
    const listEl = listRef.current;
    if (!isOpen || !listEl) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      // Directly update scrollTop for instantaneous, responsive mouse wheel scrolling
      listEl.scrollTop += e.deltaY;
      // Prevent parent modal/page from scrolling when cursor is inside the select dropdown
      e.preventDefault();
    };

    listEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      listEl.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen]);

  const hasValue = Boolean(value && value.trim().length > 0);

  return (
    <div className={`space-y-1.5 relative font-[system-ui,sans-serif] ${className}`} ref={containerRef}>
      <label
        htmlFor={selectId}
        className="text-xs font-semibold text-brand-navy flex items-center gap-1.5 font-[system-ui,sans-serif]"
      >
        <Icon className="w-3.5 h-3.5 text-brand-navy shrink-0" />
        <span>{label}</span>
        {required && <span className="text-red-500 font-bold">*</span>}
      </label>

      {/* Visually hidden native input to integrate with standard HTML form validation */}
      <input
        type="text"
        id={selectId}
        name={name}
        value={value}
        required={required}
        readOnly
        tabIndex={-1}
        className="sr-only"
        aria-hidden="true"
        onInvalid={(e) => {
          // If required but not selected, focus the trigger button
          const btn = containerRef.current?.querySelector<HTMLButtonElement>("button");
          btn?.focus();
        }}
      />

      {/* Custom Select Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-11 px-3.5 rounded-lg border text-sm font-[system-ui,sans-serif] focus:outline-none focus:bg-white focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all cursor-pointer flex items-center justify-between text-left ${
          hasValue
            ? "bg-slate-50 border-brand-navy/20 text-brand-navy font-medium"
            : "bg-slate-50 border-brand-navy/20 text-brand-navy/40"
        } ${isOpen ? "bg-white border-brand-navy ring-1 ring-brand-navy" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{hasValue ? value : placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-brand-navy/60 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-brand-navy" : ""
          }`}
        />
      </button>

      {/* Dropdown Options List — Enhanced Touch & Mouse Wheel Scrolling */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          style={{ WebkitOverflowScrolling: "touch" }}
          className="absolute z-50 left-0 right-0 top-[calc(100%+4px)] bg-white border border-brand-navy/15 rounded-lg shadow-2xl max-h-56 sm:max-h-64 overflow-y-auto overscroll-contain touch-pan-y py-1 font-[system-ui,sans-serif] [scrollbar-width:thin] [scrollbar-color:rgba(12,21,51,0.25)_transparent] animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                data-selected={isSelected ? "true" : "false"}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 text-left text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-brand-navy text-white font-medium"
                    : "text-brand-navy hover:bg-brand-navy/5 active:bg-brand-navy/10"
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <span className="truncate">{opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 3. Reusable FormTextarea Component
export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon: React.ElementType;
  required?: boolean;
}

export function FormTextarea({
  label,
  icon: Icon,
  required,
  id,
  className = "",
  rows = 3,
  ...props
}: FormTextareaProps) {
  const textareaId = id || props.name || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5 font-[system-ui,sans-serif]">
      <label
        htmlFor={textareaId}
        className="text-xs font-semibold text-brand-navy flex items-center gap-1.5 font-[system-ui,sans-serif]"
      >
        <Icon className="w-3.5 h-3.5 text-brand-navy shrink-0" />
        <span>{label}</span>
        {required && <span className="text-red-500 font-bold">*</span>}
      </label>
      <textarea
        id={textareaId}
        required={required}
        rows={rows}
        className={`w-full p-3.5 rounded-lg bg-slate-50 border border-brand-navy/20 text-brand-navy text-sm font-[system-ui,sans-serif] placeholder:text-brand-navy/40 focus:outline-none focus:bg-white focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all resize-y min-h-[96px] ${className}`}
        {...props}
      />
    </div>
  );
}

