import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getPublishedArticles } from "@/lib/blog/db";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogEmptyState } from "@/components/blog/BlogEmptyState";

export const metadata: Metadata = {
  title: "Roofing Insights & Expert Guides | WELTRIQ",
  description:
    "Explore roofing guides, material insights, and practical advice to help you make informed decisions for your project.",
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1", 10) || 1;
  const category = resolvedParams.category || undefined;
  const search = resolvedParams.search || undefined;

  const { items, total, totalPages, page } = await getPublishedArticles({
    page: currentPage,
    category,
    search,
  });

  return (
    <main className="w-full">
      {/* 1. Editorial Full-Width Hero */}
      <section className="relative min-h-[clamp(480px,58vh,580px)] flex items-center bg-brand-navy text-brand-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/refined/blog_hero.webp"
            alt="Professional roofing installation and structural detailing"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:object-[center_48%]"
          />
          <div className="absolute inset-0 bg-brand-navy/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-brand-navy/35" />
        </div>

        <Container className="relative z-10 w-full py-20 md:py-24">
          <div className="max-w-4xl space-y-4 md:space-y-6">
            <span className="text-xs sm:text-sm font-display uppercase tracking-[0.18em] text-brand-yellow">
              ARTICLES &amp; INSIGHTS
            </span>
            <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display uppercase leading-[0.98] tracking-tight text-brand-white break-normal hyphens-none">
              ROOFING INSIGHTS &amp; EXPERT GUIDES
            </h1>
            <p className="max-w-2xl text-base sm:text-lg md:text-xl text-brand-white/85 leading-relaxed text-balance font-sans">
              Explore roofing guides, material insights, and practical advice to help you make informed decisions for your project.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Published Blog Grid OR Empty State */}
      <Section className="bg-brand-island-spice py-16 md:py-24 border-b border-brand-navy/5 min-h-[400px]">
        <Container>
          {total === 0 ? (
            <BlogEmptyState />
          ) : (
            <div className="space-y-12">
              {/* Results summary if searching or filtering */}
              {(category || search) && (
                <div className="flex items-center justify-between pb-4 border-b border-brand-navy/10 text-xs sm:text-sm">
                  <div className="text-brand-navy/80">
                    Showing {items.length} {items.length === 1 ? "article" : "articles"}
                    {category && <> in <strong className="text-brand-navy">{category}</strong></>}
                    {search && <> matching &ldquo;<strong>{search}</strong>&rdquo;</>}
                  </div>
                  <Link
                    href="/blog"
                    className="text-brand-yellow font-display uppercase font-bold hover:underline"
                  >
                    Clear Filter
                  </Link>
                </div>
              )}

              {/* Responsive Editorial Grid */}
              <BlogGrid articles={items} />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-8 border-t border-brand-navy/10">
                  {page > 1 && (
                    <Link
                      href={`/blog?page=${page - 1}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                      className="px-4 py-2 rounded-lg bg-brand-white border border-brand-navy/15 text-brand-navy text-xs font-display uppercase tracking-wider font-bold hover:border-brand-navy transition-colors"
                    >
                      &larr; Previous Page
                    </Link>
                  )}
                  <span className="text-xs text-brand-navy/60 font-sans px-2">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/blog?page=${page + 1}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                      className="px-4 py-2 rounded-lg bg-brand-white border border-brand-navy/15 text-brand-navy text-xs font-display uppercase tracking-wider font-bold hover:border-brand-navy transition-colors"
                    >
                      Next Page &rarr;
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
