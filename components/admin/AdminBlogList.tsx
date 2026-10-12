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
} from "lucide-react";
import { BlogArticle } from "@/lib/blog/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AdminBlogListProps {
  initialArticles: BlogArticle[];
}

export function AdminBlogList({ initialArticles }: AdminBlogListProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<BlogArticle[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = articles.filter((a) => {
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
    } catch (err) {
      alert("Error deleting article.");
    } finally {
      setIsDeleting(false);
    }
  };

  const articleToDelete = articles.find((a) => a.id === deletingId);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-brand-navy/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display uppercase text-brand-navy tracking-tight">
            Articles &amp; Guides
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy/70 mt-1">
            Manage your published roofing guides and technical insights
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy px-4 py-2.5 rounded-lg text-xs font-display uppercase tracking-wider font-bold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Article</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-brand-white p-3.5 rounded-xl border border-brand-navy/10 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy/40" />
          <Input
            type="text"
            placeholder="Search articles by title, slug, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 text-xs sm:text-sm bg-brand-island-spice/30 border-brand-navy/15 focus:border-brand-navy"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md text-xs font-display uppercase tracking-wider border border-brand-navy/20 bg-brand-island-spice/30 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow w-full sm:w-auto"
          >
            <option value="all">All Statuses ({articles.length})</option>
            <option value="published">
              Published ({articles.filter((a) => a.status === "published").length})
            </option>
            <option value="draft">
              Drafts ({articles.filter((a) => a.status === "draft").length})
            </option>
          </select>
        </div>
      </div>

      {/* Articles Table / Grid */}
      {filtered.length === 0 ? (
        <div className="bg-brand-white rounded-xl border border-brand-navy/10 p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-brand-yellow/15 flex items-center justify-center mx-auto text-brand-navy">
            <Edit3 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-display uppercase text-brand-navy">
            {searchTerm || statusFilter !== "all"
              ? "No matching articles found"
              : "No articles created yet"}
          </h2>
          <p className="text-xs sm:text-sm text-brand-navy/70 font-sans max-w-sm mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search query or status filter to find articles."
              : "Start sharing roofing insights and practical advice with your clients."}
          </p>
          <div className="pt-2">
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 bg-brand-navy text-brand-white hover:bg-brand-navy/90 px-4 py-2 rounded-lg text-xs font-display uppercase tracking-wider font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write First Article</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-brand-white rounded-xl border border-brand-navy/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-brand-island-spice/70 text-brand-navy/70 border-b border-brand-navy/10 uppercase font-display tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/5 font-sans">
                {filtered.map((article) => {
                  const isPublished = article.status === "published";
                  const dateStr = new Date(article.updatedAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  );

                  return (
                    <tr
                      key={article.id}
                      className="hover:bg-brand-island-spice/30 transition-colors"
                    >
                      {/* Title & Cover Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 max-w-md">
                          <div className="relative w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-brand-navy/10">
                            {article.coverImage ? (
                              <Image
                                src={article.coverImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-brand-navy/40 text-[10px]">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display font-bold uppercase text-brand-navy text-xs sm:text-sm truncate">
                              {article.title}
                            </h3>
                            <p className="text-[11px] text-brand-navy/50 font-mono truncate">
                              /{article.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-display uppercase tracking-wider text-brand-navy/80 bg-brand-navy/5 px-2.5 py-1 rounded border border-brand-navy/10 whitespace-nowrap">
                          {article.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-display uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Published</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-display uppercase tracking-wider font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Draft</span>
                          </span>
                        )}
                      </td>

                      {/* Updated Date */}
                      <td className="py-3.5 px-4 text-brand-navy/60 text-xs whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {isPublished ? (
                            <Link
                              href={`/blog/${article.slug}`}
                              target="_blank"
                              className="p-1.5 text-brand-navy/60 hover:text-brand-navy hover:bg-brand-navy/5 rounded transition-colors"
                              title="View live article"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="p-1.5 text-brand-navy/20 cursor-not-allowed"
                              title="Draft is private"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          <Link
                            href={`/admin/blogs/${article.id}/edit`}
                            className="p-1.5 text-brand-navy/60 hover:text-brand-navy hover:bg-brand-navy/5 rounded transition-colors"
                            title="Edit article"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => setDeletingId(article.id)}
                            className="p-1.5 text-red-500/70 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-xs p-4">
          <div className="bg-brand-white rounded-xl shadow-2xl border border-brand-navy/10 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-display font-bold uppercase text-brand-navy text-base">
                  Delete Article
                </h3>
                <p className="text-xs text-brand-navy/60">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-brand-navy/80">
              Are you sure you want to delete{" "}
              <strong className="text-brand-navy">
                &ldquo;{articleToDelete?.title}&rdquo;
              </strong>
              ? This article will be permanently removed from all public listings
              and the database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-navy/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-brand-white border-red-600"
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
