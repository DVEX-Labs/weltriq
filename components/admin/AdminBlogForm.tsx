"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Save,
  Send,
  UploadCloud,
  Bold,
  Italic,
} from "lucide-react";
import { BlogArticle, BlogStatus } from "@/lib/blog/types";
import { BLOG_CATEGORIES, generateSlug } from "@/lib/blog/config";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { BlogArticleBody } from "@/components/blog/BlogArticleBody";

interface AdminBlogFormProps {
  initialData?: BlogArticle;
  isEditing?: boolean;
}

export function AdminBlogForm({ initialData, isEditing = false }: AdminBlogFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData?.slug));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [category, setCategory] = useState(initialData?.category || BLOG_CATEGORIES[0]);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [coverImageAlt, setCoverImageAlt] = useState(initialData?.coverImageAlt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [authorName, setAuthorName] = useState(initialData?.author?.name || "WELTRIQ Technical Team");
  const [authorRole, setAuthorRole] = useState(initialData?.author?.role || "Roofing Specialist");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");
  const [status, setStatus] = useState<BlogStatus>(initialData?.status || "draft");

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title unless manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugEdited(true);
    setSlug(generateSlug(val));
  };

  // Image upload handler
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
        setError(data.error || "Failed to upload image.");
      } else {
        setCoverImage(data.url);
      }
    } catch (err) {
      setError("Error uploading image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Toolbar markdown helper
  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("article-content-input") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);

    const replacement = `${prefix}${selected || "text"}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 50);
  };

  // Submit Handler
  const handleSubmit = async (targetStatus?: BlogStatus) => {
    setError(null);
    const finalStatus = targetStatus || status;

    if (!title.trim()) {
      setError("Please provide an article title.");
      return;
    }
    if (!excerpt.trim()) {
      setError("Please provide a short excerpt.");
      return;
    }
    if (!content.trim()) {
      setError("Article content cannot be empty.");
      return;
    }
    if (!coverImage.trim()) {
      setError("Please upload or provide a cover image.");
      return;
    }

    setSaving(true);

    const payload = {
      id: initialData?.id,
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      excerpt: excerpt.trim(),
      category: category.trim(),
      coverImage: coverImage.trim(),
      coverImageAlt: coverImageAlt.trim() || title.trim(),
      content: content.trim(),
      author: authorName.trim() ? { name: authorName.trim(), role: authorRole.trim() } : undefined,
      seoTitle: seoTitle.trim() || title.trim(),
      seoDescription: seoDescription.trim() || excerpt.trim(),
      status: finalStatus,
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
    } catch (err) {
      setError("Network error while saving article.");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-navy/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2 rounded-lg bg-brand-white border border-brand-navy/10 text-brand-navy/60 hover:text-brand-navy hover:bg-brand-island-spice/50 transition-colors"
            title="Back to Articles"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[11px] font-display uppercase tracking-widest text-brand-yellow font-bold block">
              {isEditing ? "EDIT ARTICLE" : "NEW ARTICLE"}
            </span>
            <h1 className="text-xl sm:text-2xl font-display uppercase text-brand-navy tracking-tight truncate max-w-xl">
              {title || "Untitled Article"}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={() => handleSubmit("draft")}
            className="text-xs uppercase font-display tracking-wider"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>Save Draft</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={saving}
            onClick={() => handleSubmit("published")}
            className="text-xs uppercase font-display tracking-wider"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            <span>{isEditing && initialData?.status === "published" ? "Update Published" : "Publish Now"}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-sans flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 font-bold ml-2">
            &times;
          </button>
        </div>
      )}

      {/* Main Grid: Form Inputs (Left) and Meta Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Title, Excerpt, Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="bg-brand-white p-5 sm:p-6 rounded-xl border border-brand-navy/10 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy/80 mb-1.5">
                Article Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. Complete Guide to Metal Roofing in Kerala"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="h-11 font-display font-bold text-sm sm:text-base text-brand-navy bg-brand-island-spice/30"
              />
            </div>

            <div>
              <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy/80 mb-1.5">
                URL Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-navy/50 font-mono">/blog/</span>
                <Input
                  type="text"
                  placeholder="complete-guide-to-metal-roofing-kerala"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="h-9 text-xs font-mono text-brand-navy bg-brand-island-spice/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy/80 mb-1.5">
                Short Excerpt <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="A concise 1-2 sentence preview for cards and social sharing..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="text-xs sm:text-sm font-sans bg-brand-island-spice/30 text-brand-navy"
              />
            </div>
          </div>

          {/* Article Content Editor & Live Preview */}
          <div className="bg-brand-white rounded-xl border border-brand-navy/10 shadow-xs overflow-hidden">
            {/* Editor Tab Bar */}
            <div className="flex items-center justify-between border-b border-brand-navy/10 px-4 py-2.5 bg-brand-island-spice/40">
              {/* Tabs */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display uppercase tracking-wider font-bold transition-colors ${
                    activeTab === "edit"
                      ? "bg-brand-navy text-brand-white"
                      : "text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Write Markdown</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display uppercase tracking-wider font-bold transition-colors ${
                    activeTab === "preview"
                      ? "bg-brand-navy text-brand-white"
                      : "text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>
              </div>

              {/* Formatting Toolbar (Active during Edit tab) */}
              {activeTab === "edit" && (
                <div className="hidden sm:flex items-center gap-1 border-l border-brand-navy/10 pl-2">
                  <button
                    type="button"
                    onClick={() => insertMarkdown("## ")}
                    className="p-1.5 text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5 rounded"
                    title="Heading 2"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("### ")}
                    className="p-1.5 text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5 rounded"
                    title="Heading 3"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("**", "**")}
                    className="p-1.5 text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5 rounded"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("*", "*")}
                    className="p-1.5 text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5 rounded"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("- ")}
                    className="p-1.5 text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5 rounded"
                    title="Bullet list"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("1. ")}
                    className="p-1.5 text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5 rounded"
                    title="Numbered list"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("> ")}
                    className="p-1.5 text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5 rounded"
                    title="Quote"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown("[Link text](", ")")}
                    className="p-1.5 text-brand-navy/70 hover:text-brand-navy hover:bg-brand-navy/5 rounded"
                    title="Link"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6">
              {activeTab === "edit" ? (
                <textarea
                  id="article-content-input"
                  rows={20}
                  placeholder="Write your article in Markdown... Use ## for section headings, - for lists, and > for quotes."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full font-sans text-sm text-brand-navy bg-transparent outline-none resize-y min-h-[400px] leading-relaxed"
                />
              ) : (
                <div className="min-h-[400px] prose-container">
                  <BlogArticleBody content={content || "*Nothing written yet. Switch to Edit tab to add content.*"} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata, Cover Image, SEO (1 Col) */}
        <div className="space-y-6">
          {/* Status & Category Card */}
          <div className="bg-brand-white p-5 rounded-xl border border-brand-navy/10 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy/80 mb-1.5">
                Publication Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-display uppercase tracking-wider font-bold border transition-colors ${
                    status === "draft"
                      ? "bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-400/30"
                      : "bg-brand-island-spice/30 text-brand-navy/60 border-brand-navy/15 hover:bg-brand-island-spice/60"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Draft</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-display uppercase tracking-wider font-bold border transition-colors ${
                    status === "published"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/30"
                      : "bg-brand-island-spice/30 text-brand-navy/60 border-brand-navy/15 hover:bg-brand-island-spice/60"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Published</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy/80 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg text-xs font-display uppercase tracking-wider border border-brand-navy/20 bg-brand-island-spice/30 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image Upload Card */}
          <div className="bg-brand-white p-5 rounded-xl border border-brand-navy/10 shadow-xs space-y-4">
            <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy/80">
              Featured Cover Image <span className="text-red-500">*</span>
            </label>

            {coverImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-brand-navy/10 group">
                <Image
                  src={coverImage}
                  alt={coverImageAlt || "Cover Preview"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label
                    htmlFor="cover-image-upload"
                    className="cursor-pointer bg-brand-white text-brand-navy px-3 py-1.5 rounded text-xs font-display uppercase tracking-wider font-bold"
                  >
                    Change Image
                  </label>
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="bg-red-600 text-brand-white px-3 py-1.5 rounded text-xs font-display uppercase tracking-wider font-bold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="cover-image-upload"
                className="cursor-pointer border-2 border-dashed border-brand-navy/20 hover:border-brand-yellow rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors bg-brand-island-spice/30"
              >
                <UploadCloud className="w-8 h-8 text-brand-navy/40 mb-2" />
                <span className="text-xs font-display uppercase tracking-wider font-bold text-brand-navy">
                  {uploadingImage ? "Uploading Image..." : "Upload Cover Image"}
                </span>
                <span className="text-[11px] text-brand-navy/50 mt-1">
                  JPEG, PNG, WebP up to 5MB
                </span>
              </label>
            )}

            <input
              id="cover-image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploadingImage}
            />

            <div>
              <label className="block text-[11px] font-display uppercase tracking-wider text-brand-navy/70 mb-1">
                Image URL or Preset Path
              </label>
              <Input
                type="text"
                placeholder="/images/refined/blog_hero.webp"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="h-8 text-xs font-mono text-brand-navy"
              />
            </div>

            <div>
              <label className="block text-[11px] font-display uppercase tracking-wider text-brand-navy/70 mb-1">
                Image Alt Text
              </label>
              <Input
                type="text"
                placeholder="Descriptive caption for accessibility"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                className="h-8 text-xs text-brand-navy"
              />
            </div>
          </div>

          {/* Author Card */}
          <div className="bg-brand-white p-5 rounded-xl border border-brand-navy/10 shadow-xs space-y-3">
            <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy/80">
              Author Information
            </label>
            <div>
              <Input
                type="text"
                placeholder="Author Name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="h-8 text-xs text-brand-navy mb-2"
              />
              <Input
                type="text"
                placeholder="Role / Title"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="h-8 text-xs text-brand-navy"
              />
            </div>
          </div>

          {/* SEO Metadata Card */}
          <div className="bg-brand-white p-5 rounded-xl border border-brand-navy/10 shadow-xs space-y-3">
            <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy/80">
              SEO Optimization
            </label>
            <div>
              <label className="block text-[11px] text-brand-navy/70 mb-1">
                Meta Title
              </label>
              <Input
                type="text"
                placeholder="Defaults to article title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="h-8 text-xs text-brand-navy mb-3"
              />
              <label className="block text-[11px] text-brand-navy/70 mb-1">
                Meta Description
              </label>
              <Textarea
                placeholder="Defaults to article excerpt"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                className="text-xs text-brand-navy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
