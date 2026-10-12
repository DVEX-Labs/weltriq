import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getPublishedArticleBySlug, getRelatedArticles } from "@/lib/blog/db";
import { BlogArticleBody } from "@/components/blog/BlogArticleBody";
import { BlogCard } from "@/components/blog/BlogCard";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | WELTRIQ Roofing Solutions",
      robots: { index: false, follow: false },
    };
  }

  const title = article.seoTitle || `${article.title} | WELTRIQ`;
  const description = article.seoDescription || article.excerpt;
  const canonicalUrl = `https://weltriq.com/blog/${article.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: article.coverImage ? [{ url: article.coverImage, alt: article.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  // Return 404 if article doesn't exist or is unpublished/draft
  if (!article) {
    notFound();
  }

  const related = await getRelatedArticles(article.slug, article.category, 3);

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date(article.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  // JSON-LD Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [article.coverImage] : [],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author?.name || "WELTRIQ Technical Team",
      jobTitle: article.author?.role || "Roofing Specialist",
    },
    publisher: {
      "@type": "Organization",
      name: "WELTRIQ Roofing Solutions",
      logo: {
        "@type": "ImageObject",
        url: "https://weltriq.com/favicon.ico",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://weltriq.com/blog/${article.slug}`,
    },
  };

  return (
    <main className="w-full bg-brand-island-spice/30">
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article Header & Breadcrumbs */}
      <section className="bg-brand-navy text-brand-white pt-12 pb-16 md:pt-16 md:pb-20 relative overflow-hidden">
        {/* Subtle Background Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

        <Container className="relative z-10 max-w-4xl mx-auto">
          {/* Back link & breadcrumbs */}
          <div className="flex items-center justify-between text-xs font-display uppercase tracking-wider text-brand-white/70 mb-8 pb-4 border-b border-brand-white/10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 hover:text-brand-yellow transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all articles</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-brand-white/50 text-[11px]">
              <Link href="/" className="hover:text-brand-white">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-brand-white">Blog</Link>
              <span>/</span>
              <span className="text-brand-yellow truncate max-w-[150px]">{article.category}</span>
            </div>
          </div>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-yellow bg-brand-yellow/10 px-3.5 py-1 rounded-full border border-brand-yellow/20 inline-block">
              {article.category}
            </span>
          </div>

          {/* H1 Article Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display uppercase leading-[1.05] tracking-tight text-brand-white text-balance mb-6">
            {article.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm text-brand-white/75 font-sans pt-2 border-t border-brand-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-yellow" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-yellow" />
              <span>{article.readingTimeMinutes} min read</span>
            </div>

            {article.author?.name && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-yellow" />
                <span>
                  {article.author.name}
                  {article.author.role && (
                    <span className="text-brand-white/50"> • {article.author.role}</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Main Article Content & Featured Image */}
      <section className="py-12 md:py-16">
        <Container className="max-w-4xl mx-auto">
          {/* Featured Cover Image */}
          {article.coverImage && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md border border-brand-navy/10 mb-10 md:mb-14 bg-brand-white">
              <Image
                src={article.coverImage}
                alt={article.coverImageAlt || article.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          {/* Lead Excerpt Block */}
          {article.excerpt && (
            <div className="p-6 md:p-8 rounded-xl bg-brand-white border border-brand-navy/10 mb-10 text-lg sm:text-xl font-sans text-brand-navy/90 leading-relaxed border-l-4 border-l-brand-yellow shadow-xs">
              {article.excerpt}
            </div>
          )}

          {/* Safe Markdown Article Body */}
          <div className="bg-brand-white p-6 sm:p-10 md:p-12 rounded-2xl border border-brand-navy/10 shadow-xs">
            <BlogArticleBody content={article.content} />
          </div>

          {/* Post-article Share & CTA */}
          <div className="mt-10 p-6 rounded-xl bg-brand-navy text-brand-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold uppercase text-lg text-brand-white">
                Planning a Roofing Project in Kerala?
              </h3>
              <p className="text-xs sm:text-sm text-brand-white/80 font-sans mt-0.5">
                Consult WELTRIQ for professional site inspection and structural assessment.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-lg bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-display uppercase tracking-wider text-xs font-bold shrink-0 transition-colors"
            >
              Get a Free Quote
            </Link>
          </div>
        </Container>
      </section>

      {/* Related Articles Section (Only rendered when suitable published articles exist) */}
      {related.length > 0 && (
        <Section className="bg-brand-white border-t border-brand-navy/10 py-16 md:py-24">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-yellow block mb-2">
                  MORE ARTICLES
                </span>
                <h2 className="text-2xl sm:text-3xl font-display uppercase text-brand-navy">
                  Related Insights
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-display uppercase tracking-wider font-bold text-brand-navy hover:text-brand-yellow transition-colors inline-flex items-center gap-1.5"
              >
                <span>View All Articles</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {related.map((rel) => (
                <BlogCard key={rel.id} article={rel} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </main>
  );
}
