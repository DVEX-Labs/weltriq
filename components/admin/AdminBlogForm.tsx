"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  UploadCloud,
  Sparkles,
  ImageIcon,
  X,
  Plus,
  Check,
} from "lucide-react";
import { BlogArticle } from "@/lib/blog/types";
import { BLOG_CATEGORIES, generateSlug } from "@/lib/blog/config";
import { Button } from "@/components/ui/Button";

interface AdminBlogFormProps {
  initialData?: BlogArticle;
  isEditing?: boolean;
}

export function AdminBlogForm({ initialData, isEditing = false }: AdminBlogFormProps) {
  const router = useRouter();

  // Categories list (defaults + any existing category from initialData)
  const initialCategories = Array.from(
    new Set([
      ...BLOG_CATEGORIES,
      ...(initialData?.category ? [initialData.category] : []),
    ])
  );

  // Core Simple Fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || BLOG_CATEGORIES[0]);
  const [categoriesList, setCategoriesList] = useState<string[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryAddedNotice, setCategoryAddedNotice] = useState(false);

  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [content, setContent] = useState(initialData?.content || "");

  // UI state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
  };

  // Add new category handler
  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    if (!categoriesList.includes(trimmed)) {
      setCategoriesList((prev) => [...prev, trimmed]);
    }
    setCategory(trimmed);
    setNewCategoryName("");
    setCategoryAddedNotice(true);
    setTimeout(() => setCategoryAddedNotice(false), 2500);
  };

  // Image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
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
        setError(data.error || "Image upload failed.");
      } else {
        setCoverImage(data.url);
      }
    } catch {
      setError("Network error while uploading image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Handler - Every article saved is automatically live on site
  const handleSave = async () => {
    setError(null);

    if (!title.trim()) {
      setError("Please write an article title before saving.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!content.trim()) {
      setError("Please write the article description/content.");
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    // Auto-generate clean excerpt from description opening sentences
    const cleanText = content.replace(/[#*`>_\-[\]]/g, "").trim();
    const finalExcerpt = cleanText.slice(0, 150) + (cleanText.length > 150 ? "..." : "");

    if (!coverImage.trim()) {
      setError("Please upload a featured cover photo for this article.");
      window.scrollTo({ top: 180, behavior: "smooth" });
      return;
    }

    const finalCover = coverImage.trim();

    setSaving(true);

    const payload = {
      id: initialData?.id,
      title: title.trim(),
      slug: initialData?.slug || generateSlug(title),
      excerpt: finalExcerpt,
      category: category.trim() || BLOG_CATEGORIES[0],
      coverImage: finalCover,
      coverImageAlt: title.trim(),
      content: content.trim(),
      author: {
        name: "WELTRIQ Technical Team",
        role: "Roofing Specialist",
      },
      seoTitle: title.trim(),
      seoDescription: finalExcerpt,
      status: "published" as const, // Always published & live on website
    };

    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save article.");
        setSaving(false);
        return;
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch {
      setError("Network error while saving. Please check your connection.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-brand-navy hover:bg-gray-50 transition-colors shadow-2xs"
            title="Back to Articles list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-display uppercase tracking-widest font-bold text-brand-navy bg-brand-yellow/20 px-2.5 py-0.5 rounded-md border border-gray-200">
                <Sparkles className="w-3 h-3 text-brand-navy" />
                {isEditing ? "Edit Article" : "New Article"}
              </span>
              <span className="text-[10px] font-display uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-gray-200 bg-emerald-50 text-emerald-800">
                Live on Website
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display uppercase font-bold text-brand-navy tracking-tight truncate max-w-xl">
              {title || "Untitled Article"}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Link
            href="/admin/blogs"
            className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-display uppercase tracking-wider font-bold transition-colors"
          >
            Cancel
          </Link>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={saving}
            onClick={handleSave}
            className="h-10 px-5 rounded-xl bg-brand-yellow hover:bg-[#F3B81F] text-brand-navy text-xs font-display uppercase tracking-wider font-bold shadow-xs hover:shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 mr-1.5 text-brand-navy" />
            <span>{isEditing ? "Update Article" : "Publish Article Now"}</span>
          </Button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 font-bold ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Article Title & Category Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy mb-2">
            Article Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 5 Signs Your Roof Needs Pre-Monsoon Maintenance in Kerala"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full h-12 px-4 rounded-xl text-base sm:text-lg font-bold text-brand-navy bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-navy focus:ring-2 focus:ring-brand-yellow/30 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal font-sans"
            required
          />
          <p className="text-xs text-gray-400 mt-1.5 font-sans">
            Make it clear and helpful for home and commercial building owners.
          </p>
        </div>

        {/* Category Selection & Add Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Select Category Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-display uppercase tracking-wider font-bold text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl text-xs sm:text-sm font-sans font-medium border border-gray-200 bg-gray-50 text-brand-navy focus:outline-none focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-yellow/30 cursor-pointer"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Add New Category Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-display uppercase tracking-wider font-bold text-gray-700">
                + Add Category
              </label>
              {categoryAddedNotice && (
                <span className="text-[11px] text-emerald-600 font-bold font-sans inline-flex items-center gap-1">
                  <Check className="w-3 h-3" /> Added &amp; Selected!
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Kerala Architecture"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
                className="flex-1 h-11 px-3.5 rounded-xl text-xs sm:text-sm font-sans bg-gray-50 border border-gray-200 text-brand-navy placeholder:text-gray-400 focus:bg-white focus:border-brand-navy focus:ring-2 focus:ring-brand-yellow/30 outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="h-11 px-4 rounded-xl bg-brand-navy hover:bg-[#14204A] text-white text-xs font-display uppercase tracking-wider font-bold transition-all disabled:opacity-40 cursor-pointer shrink-0 inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Featured Cover Photo Card (ONLY Upload and Preview) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-display uppercase tracking-wider font-bold text-brand-navy">
              Featured Cover Photo
            </h2>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              Upload a high-resolution cover photo for this article.
            </p>
          </div>
          <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
            16:9 Landscape
          </span>
        </div>

        {/* Upload Box / Image Preview Box */}
        <div className="relative aspect-video max-w-xl mx-auto rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-2xs group">
          {coverImage ? (
            <>
              <Image
                src={coverImage}
                alt={title || "Article cover photo"}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="absolute top-3 right-3 p-2 rounded-full bg-brand-navy/80 hover:bg-red-600 text-white transition-colors shadow-md cursor-pointer z-10"
                title="Remove image"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[10px] font-display uppercase tracking-wider font-bold">
                Cover Preview
              </div>
            </>
          ) : (
            <label
              htmlFor="simple-photo-upload"
              className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-3 cursor-pointer hover:bg-gray-100/70 transition-all border-2 border-dashed border-gray-300 hover:border-brand-navy rounded-2xl group"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-yellow/20 text-brand-navy flex items-center justify-center border border-brand-yellow/30 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-7 h-7 text-brand-navy stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-display uppercase tracking-wider font-bold shadow-xs group-hover:bg-[#14204A] transition-colors">
                  <UploadCloud className="w-4 h-4 text-brand-yellow" />
                  <span>{uploadingImage ? "Uploading..." : "Upload Cover Photo"}</span>
                </span>
                <p className="text-[11px] text-gray-400 font-sans pt-1">
                  Click to select photo or drag and drop (JPG, PNG, WebP up to 5MB)
                </p>
              </div>
            </label>
          )}
        </div>

        <input
          id="simple-photo-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploadingImage}
          className="hidden"
        />
      </div>

      {/* 3. SIMPLE BIG DESCRIPTION / CONTENT CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-display uppercase tracking-wider font-bold text-brand-navy">
              Article Description &amp; Content <span className="text-red-500">*</span>
            </h2>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              Write your article description and details here. Paragraphs format automatically.
            </p>
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            {content.length} characters
          </span>
        </div>

        {/* Simple Big Textarea */}
        <textarea
          id="article-main-editor"
          rows={16}
          placeholder="Write your article description here... Type naturally in full paragraphs.

You can explain roofing solutions, maintenance advice, materials, or architectural guidelines here."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 sm:p-5 rounded-xl border border-gray-200 focus:bg-white focus:border-brand-navy focus:ring-2 focus:ring-brand-yellow/30 bg-gray-50 text-base text-brand-navy placeholder:text-gray-400 outline-none resize-y min-h-[380px] leading-relaxed font-sans transition-all"
          required
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-sans">
          <span>Category:</span>
          <span className="font-bold text-brand-navy uppercase tracking-wider font-display">
            {category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-display uppercase tracking-wider font-bold transition-colors"
          >
            Cancel
          </Link>

          <Button
            type="button"
            variant="primary"
            disabled={saving}
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-brand-yellow hover:bg-[#F3B81F] text-brand-navy text-xs font-display uppercase tracking-wider font-bold shadow-xs hover:shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 mr-1.5 text-brand-navy" />
            <span>{isEditing ? "Update Article" : "Publish Article Now"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
