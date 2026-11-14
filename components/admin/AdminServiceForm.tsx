"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Upload,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ImageIcon,
  Hash,
  X,
} from "lucide-react";
import { ManagedService, MAX_DESCRIPTION_LENGTH } from "@/lib/services/types";

interface AdminServiceFormProps {
  initialService?: ManagedService;
  isEditing?: boolean;
  allServices?: ManagedService[];
}

export function AdminServiceForm({
  initialService,
  isEditing = false,
  allServices = [],
}: AdminServiceFormProps) {
  const router = useRouter();

  // Compute next available number for a new service
  const existingCount = allServices.length > 0 ? allServices.length : 9;
  const nextNumber = String(existingCount + 1).padStart(2, "0");

  const [title, setTitle] = useState(initialService?.title || "");
  const [description, setDescription] = useState(initialService?.description || "");
  const [image, setImage] = useState(initialService?.image || "");
  const [number, setNumber] = useState(
    initialService?.number || (isEditing ? "01" : nextNumber)
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const charCount = description.length;
  const isOverLimit = charCount > MAX_DESCRIPTION_LENGTH;
  const isNearLimit = charCount > 145 && !isOverLimit;

  // Determine which card would be swapped when the user changes number
  const currentCardNumber = initialService?.number || nextNumber;
  const targetNumber = String(parseInt(number, 10) || 1).padStart(2, "0");
  const isNumberChanged = targetNumber !== currentCardNumber;

  const conflictingCard = allServices.find(
    (s) => s.id !== initialService?.id && s.number === targetNumber
  );

  // Generate sequence options: from 01 to (existingCount + 1)
  const maxOption = isEditing
    ? Math.max(existingCount, parseInt(initialService?.number || "1", 10))
    : existingCount + 1;

  const numberOptions = Array.from({ length: maxOption }, (_, i) => {
    const numStr = String(i + 1).padStart(2, "0");
    const matched = allServices.find((s) => s.number === numStr);
    return {
      value: numStr,
      label: matched
        ? `#${numStr} — ${matched.title}${
            isEditing && matched.id === initialService?.id ? " (Current)" : ""
          }`
        : `#${numStr} — Next Card Position (End of Deck)`,
      isCurrent: isEditing && matched?.id === initialService?.id,
    };
  });

  // Handle image upload via API
  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Image upload failed.");
      }

      setImage(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Please provide a service title.");
      return;
    }
    if (!description.trim()) {
      setError("Please provide a service description.");
      return;
    }
    if (isOverLimit) {
      setError(`Description exceeds the ${MAX_DESCRIPTION_LENGTH} character limit for UI/UX stability.`);
      return;
    }
    if (!image.trim()) {
      setError("Please upload an image for this service card.");
      return;
    }

    setSaving(true);

    try {
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing
        ? { id: initialService?.id, title, description, image, number: targetNumber }
        : { title, description, image, number: targetNumber };

      const res = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save service.");
      }

      setSuccess(
        isEditing
          ? isNumberChanged && conflictingCard
            ? `Service updated! Number swapped with "${conflictingCard.title}".`
            : "Service updated successfully!"
          : "Service created successfully!"
      );

      setTimeout(() => {
        router.push("/admin/services");
        router.refresh();
      }, 700);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred.");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-brand-navy hover:bg-gray-50 transition-colors shadow-2xs"
            title="Back to Services"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-display uppercase tracking-widest font-bold text-brand-navy bg-brand-yellow/20 px-2.5 py-0.5 rounded-md border border-gray-200">
                <Sparkles className="w-3 h-3 text-brand-navy" />
                {isEditing ? "Edit Service" : "New Service"}
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                Card #{targetNumber}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display uppercase font-bold text-brand-navy tracking-tight truncate max-w-xl">
              {title || "Untitled Service"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Link
            href="/admin/services"
            className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-display uppercase tracking-wider font-bold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || isOverLimit}
            className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-[#F3B81F] text-brand-navy px-5 py-2.5 rounded-xl text-xs font-display uppercase tracking-wider font-bold transition-all shadow-xs hover:shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{saving ? "Saving..." : isEditing ? "Update Service" : "Create Service"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 font-bold ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 2-Column Balanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDE: Service Card Number, Title, and Description */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-xs font-display uppercase tracking-wider font-bold text-brand-navy mb-1">
              Service Details
            </h2>
            <p className="text-xs text-gray-500 font-sans">
              Set the card sequence order, title, and architectural description.
            </p>
          </div>

          {/* Card Sequence Number Section */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-display uppercase tracking-wider font-bold text-gray-700 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-brand-navy" />
                <span>Card Sequence Number (Deck Order)</span>
              </label>
              <span className="text-[11px] font-mono font-bold text-brand-navy bg-white px-2 py-0.5 rounded border border-gray-200">
                #{targetNumber}
              </span>
            </div>

            <select
              value={targetNumber}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl text-xs sm:text-sm font-sans font-medium border border-gray-200 bg-white text-brand-navy focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-yellow/30 cursor-pointer transition-all"
            >
              {numberOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <p className="text-[11px] text-gray-500 font-sans">
              {isEditing
                ? `Currently set to position #${currentCardNumber}. Select any position to change order.`
                : `Defaults to next card position (#${nextNumber}) at the end of the deck.`}
            </p>

            {/* Live Swap Warning / Explanation */}
            {isNumberChanged && conflictingCard && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5 animate-fadeIn">
                <RefreshCw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 font-sans leading-relaxed">
                  <p className="font-bold">Automatic Card Swap:</p>
                  <p>
                    Position <strong>#{targetNumber}</strong> is currently held by{" "}
                    <strong>&ldquo;{conflictingCard.title}&rdquo;</strong>.
                  </p>
                  <p className="text-[11px] text-amber-700">
                    When you save, this service becomes <strong>#{targetNumber}</strong>, and{" "}
                    <strong>&ldquo;{conflictingCard.title}&rdquo;</strong> will automatically take position{" "}
                    <strong>#{currentCardNumber}</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Service Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-display uppercase tracking-wider font-bold text-gray-700">
              Service Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={45}
              placeholder="e.g. Clay Tile Roofing, Standing Seam Metal"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-yellow/30 text-sm font-sans font-medium text-brand-navy bg-gray-50 placeholder:text-gray-400 outline-none transition-all"
              required
            />
            <p className="text-[11px] text-gray-400 font-sans">
              Keep titles concise and architectural (maximum 45 characters).
            </p>
          </div>

          {/* Service Description with Live Character Limit Counter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-display uppercase tracking-wider font-bold text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md transition-colors border border-gray-200 ${
                  isOverLimit
                    ? "bg-red-100 text-red-700 border-red-300"
                    : isNearLimit
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-emerald-50 text-emerald-800"
                }`}
              >
                {charCount} / {MAX_DESCRIPTION_LENGTH} chars
              </span>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Describe the roofing material, weather resistance, and architectural application..."
              className={`w-full px-4 py-3 rounded-xl border text-sm text-brand-navy placeholder:text-gray-400 outline-none transition-all resize-none font-sans leading-relaxed ${
                isOverLimit
                  ? "border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-navy focus:ring-2 focus:ring-brand-yellow/30"
              }`}
              required
            />

            <div className="flex items-center justify-between text-[11px] font-sans">
              <p className="text-gray-500">
                <span className="font-bold text-brand-navy">UI/UX Guardrail:</span> Max 160 characters
                protects mobile card viewports and desktop deck stacking.
              </p>
              {isOverLimit && (
                <span className="text-red-600 font-bold">
                  Exceeds limit by {charCount - MAX_DESCRIPTION_LENGTH} chars!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Image Preview / Upload Box */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-display uppercase tracking-wider font-bold text-brand-navy">
                Service Photo &amp; Preview
              </h2>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                Upload a high-resolution image for this roofing service card.
              </p>
            </div>
            <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
              16:10 Ratio
            </span>
          </div>

          {/* Live Image Preview / Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative aspect-16/10 rounded-2xl overflow-hidden border transition-all ${
              isDragging
                ? "border-brand-navy bg-brand-yellow/10 ring-2 ring-brand-yellow"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            {image ? (
              <>
                <Image
                  src={image}
                  alt={title || "Service photo preview"}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute top-3 right-3 p-2 rounded-full bg-brand-navy/80 hover:bg-red-600 text-white transition-colors shadow-md cursor-pointer z-10"
                  title="Remove image"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
                <div className="absolute top-3 left-3 bg-brand-navy/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border border-white/20">
                  Card #{targetNumber}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[10px] font-display uppercase tracking-wider font-bold">
                  Live Preview
                </div>
              </>
            ) : (
              <label
                htmlFor="service-image-file-input"
                className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-3 cursor-pointer hover:bg-gray-100/70 transition-all border-2 border-dashed border-gray-300 hover:border-brand-navy rounded-2xl group"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-yellow/20 text-brand-navy flex items-center justify-center border border-brand-yellow/30 group-hover:scale-105 transition-transform">
                  <Upload className="w-7 h-7 text-brand-navy stroke-[2.2]" />
                </div>
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-display uppercase tracking-wider font-bold shadow-xs group-hover:bg-[#14204A] transition-colors">
                    <Upload className="w-4 h-4 text-brand-yellow" />
                    <span>{uploading ? "Uploading..." : "Upload Service Photo"}</span>
                  </span>
                  <p className="text-[11px] text-gray-400 font-sans pt-1">
                    Click to select photo or drag and drop (JPG, PNG, WebP up to 5MB)
                  </p>
                </div>
              </label>
            )}
          </div>

          <input
            id="service-image-file-input"
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
