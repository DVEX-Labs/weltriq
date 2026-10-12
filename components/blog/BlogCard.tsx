import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { BlogArticle } from "@/lib/blog/types";

interface BlogCardProps {
  article: BlogArticle;
  className?: string;
}

export function BlogCard({ article, className = "" }: BlogCardProps) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : new Date(article.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  return (
    <article
      className={`group relative bg-brand-white rounded-xl border border-brand-navy/10 overflow-hidden shadow-xs hover:shadow-md transform-gpu hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between h-full ${className}`}
    >
      <div>
        {/* Cover Image Container (16:9 aspect ratio) */}
        <Link
          href={`/blog/${article.slug}`}
          className="block relative aspect-video w-full overflow-hidden bg-brand-island-spice/60"
          tabIndex={-1}
          aria-hidden="true"
        >
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.coverImageAlt || article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-navy/5 text-brand-navy/40 text-xs font-display uppercase tracking-wider">
              WELTRIQ INSIGHTS
            </div>
          )}
          {/* Subtle gradient overlay at bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/25 via-transparent to-transparent opacity-60" />
        </Link>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          {/* Category Pill Badge */}
          {article.category && (
            <div className="mb-3">
              <span className="text-[11px] font-display uppercase tracking-widest font-bold text-brand-navy/70 bg-brand-navy/5 px-2.5 py-1 rounded border border-brand-navy/10 inline-block">
                {article.category}
              </span>
            </div>
          )}

          {/* Blog Title */}
          <h3 className="text-lg sm:text-xl font-display font-bold uppercase text-brand-navy leading-snug tracking-wide break-words line-clamp-2">
            <Link href={`/blog/${article.slug}`} className="focus:outline-none">
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm font-sans font-normal text-brand-navy/70 leading-relaxed text-balance line-clamp-3 mt-2.5">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer: Date, Reading Time & Directional Arrow */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-brand-navy/8 flex items-center justify-between text-xs text-brand-navy/60 font-sans">
        <div className="flex items-center gap-2">
          <span>{publishedDate}</span>
          <span className="text-brand-navy/30" aria-hidden="true">
            •
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-brand-navy/40" />
            <span>{article.readingTimeMinutes} min read</span>
          </span>
        </div>

        <Link
          href={`/blog/${article.slug}`}
          className="inline-flex items-center gap-1 font-display font-bold text-xs uppercase tracking-wider text-brand-navy"
          aria-label={`Read article: ${article.title}`}
        >
          <ArrowRight className="w-4 h-4 text-brand-navy group-hover:translate-x-1 transition-transform duration-300 ease-out" />
        </Link>
      </div>
    </article>
  );
}
