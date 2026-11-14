"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Edit3,
  ExternalLink,
  Eye,
  Plus,
  Search,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BlogArticle } from "@/lib/blog/types";
import { Button } from "@/components/ui/Button";

interface AdminBlogListProps {
  initialArticles: BlogArticle[];
}

const ITEMS_PER_PAGE = 10;

export function AdminBlogList({ initialArticles }: AdminBlogListProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<BlogArticle[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftCount = articles.filter((a) => a.status === "draft").length;

  const filtered = articles.filter((a) => {
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Centered Pagination calculations (Max 10 cards per page)
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedArticles = filtered.slice(startIndex, endIndex);

  // Helper to generate numbered page buttons with ellipses
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: number[] = [];
    if (validPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(-1); // -1 indicates ellipsis (...)
      pages.push(totalPages);
    } else if (validPage >= totalPages - 3) {
      pages.push(1);
      pages.push(-1);
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push(-1);
      pages.push(validPage - 1);
      pages.push(validPage);
      pages.push(validPage + 1);
      pages.push(-1);
      pages.push(totalPages);
    }
    return pages;
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/blogs?id=${deletingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== deletingId));
        setDeletingId(null);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete article.");
      }
    } catch {
      alert("Error deleting article.");
    } finally {
      setIsDeleting(false);
    }
  };

  const articleToDelete = articles.find((a) => a.id === deletingId);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-display uppercase font-bold text-brand-navy tracking-tight">
              Articles &amp; Guides
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              {articles.length} total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-sans leading-relaxed">
            Manage your published roofing guides, technical insights, and architectural knowledge articles.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-[#F3B81F] text-brand-navy px-4 py-2.5 rounded-xl text-xs font-display uppercase tracking-wider font-bold transition-all shadow-xs hover:shadow-sm self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles by title, slug, excerpt, or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-9 h-10 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl text-brand-navy placeholder:text-gray-400 focus:outline-none focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-yellow/30 font-sans transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-xl text-xs font-display uppercase tracking-wider font-bold border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-yellow/30 w-full sm:w-auto cursor-pointer"
          >
            <option value="all">All Statuses ({articles.length})</option>
            <option value="published">Published ({publishedCount})</option>
            <option value="draft">Drafts ({draftCount})</option>
          </select>
        </div>
      </div>

      {/* Individual Single Article Cards with Grey Border (Uniform with Service Cards) */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mx-auto border border-gray-200/80 shadow-2xs">
            <BookOpen className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h2 className="text-lg font-display uppercase font-bold text-brand-navy">
            {searchTerm || statusFilter !== "all"
              ? "No matching articles found"
              : "No articles created yet"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto font-sans leading-relaxed">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search query or status filter to find articles."
              : "Start sharing roofing insights and practical architectural advice with your clients."}
          </p>
          <div className="pt-2">
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-[#F3B81F] text-brand-navy px-4 py-2.5 rounded-xl text-xs font-display uppercase tracking-wider font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Write First Article</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedArticles.map((article) => {
            const isPublished = article.status === "published";
            const dateStr = new Date(article.updatedAt || article.createdAt).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" }
            );

            return (
              <div
                key={article.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                {/* Left: Thumbnail + Title, Badges & Excerpt */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0 flex-1">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0 shadow-2xs">
                    {article.coverImage ? (
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                        No img
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-display uppercase tracking-wider font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-md border border-gray-200">
                        {article.category}
                      </span>

                      {isPublished ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-display uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 border border-gray-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-display uppercase tracking-wider font-bold text-amber-800 bg-amber-50 border border-gray-200 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Draft</span>
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/admin/blogs/${article.id}/edit`}
                      className="text-base sm:text-lg font-bold text-brand-navy hover:text-brand-yellow-hover transition-colors truncate font-sans block"
                    >
                      {article.title}
                    </Link>

                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed font-sans">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-xs text-gray-400 font-sans flex-wrap">
                      <span className="font-mono text-[11px]">/blog/{article.slug}</span>
                      <span>•</span>
                      <span>Updated {dateStr}</span>
                      {article.readingTimeMinutes && (
                        <>
                          <span>•</span>
                          <span>{article.readingTimeMinutes} min read</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 w-full md:w-auto justify-end">
                  {isPublished && (
                    <Link
                      href={`/blog/${article.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-display uppercase tracking-wider font-bold text-gray-700 hover:text-brand-navy hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-2xs"
                      title="View live article"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      <span className="hidden sm:inline">View Live</span>
                    </Link>
                  )}

                  <Link
                    href={`/admin/blogs/${article.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-display uppercase tracking-wider font-bold text-gray-700 hover:text-brand-navy hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Article</span>
                  </Link>

                  <button
                    onClick={() => setDeletingId(article.id)}
                    className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered Pagination (Max 10 cards per page) */}
        {filtered.length > 0 && (
          <div className="flex flex-col items-center justify-center gap-3 pt-6 border-t border-gray-200 mt-6">
            {/* Showing Count Information */}
            <div className="text-xs text-gray-500 font-sans">
              Showing <span className="font-bold text-brand-navy">{startIndex + 1}</span>–
              <span className="font-bold text-brand-navy">{Math.min(endIndex, filtered.length)}</span> of{" "}
              <span className="font-bold text-brand-navy">{filtered.length}</span> articles
              {totalPages > 1 && (
                <span className="text-gray-400 ml-1.5">• Page {validPage} of {totalPages}</span>
              )}
            </div>

            {/* Centered Page Navigation Controls */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Prev Button */}
              <button
                type="button"
                onClick={() => {
                  setCurrentPage((p) => Math.max(p - 1, 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={validPage <= 1}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-display uppercase tracking-wider font-bold text-brand-navy hover:bg-gray-50 hover:border-brand-navy disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Numbered Page Buttons */}
              {getPageNumbers().map((p, idx) => {
                if (p === -1) {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="w-9 h-9 flex items-center justify-center text-xs font-bold text-gray-400 select-none"
                    >
                      …
                    </span>
                  );
                }

                const isActive = p === validPage;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setCurrentPage(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`min-w-9 h-9 px-3 rounded-xl text-xs font-display uppercase tracking-wider font-bold transition-all shadow-2xs cursor-pointer ${
                      isActive
                        ? "bg-brand-navy text-white border border-brand-navy shadow-xs"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-brand-navy hover:text-brand-navy"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => {
                  setCurrentPage((p) => Math.min(p + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={validPage >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-display uppercase tracking-wider font-bold text-brand-navy hover:bg-gray-50 hover:border-brand-navy disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
                title="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </>
    )}

      {/* Delete Confirmation Modal Card */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-display uppercase font-bold text-brand-navy text-base">
                  Delete Article
                </h3>
                <p className="text-xs text-gray-500 font-sans">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
              Are you sure you want to delete{" "}
              <strong className="text-brand-navy font-bold">
                &ldquo;{articleToDelete?.title}&rdquo;
              </strong>
              ? This article will be permanently removed from all public listings
              and the database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 font-display uppercase tracking-wider text-xs font-bold">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600 rounded-xl"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
