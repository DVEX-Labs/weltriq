import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { BlogCard } from "@/components/blog/BlogCard";
import { getLatestPublishedArticles } from "@/lib/blog/db";
import { HOME_BLOG_MAX_COUNT } from "@/lib/blog/config";

export async function HomeBlogSection() {
  const articles = await getLatestPublishedArticles(HOME_BLOG_MAX_COUNT);

  // CRITICAL RULE: If 0 published articles exist, return null completely.
  // Absolutely no section heading, no empty placeholders, no blank container, no vertical gap.
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <Section className="bg-brand-island-spice border-b border-brand-navy/5 py-16 md:py-24">
      <Container>
        {/* Section Header with "View All Articles" link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-yellow bg-brand-navy/5 px-4 py-1.5 rounded-full border border-brand-navy/10 inline-block mb-3">
              KNOWLEDGE &amp; INSIGHTS
            </span>
            <SectionHeading
              title="Latest Roofing Insights"
              subtitle="Guides and practical insights for your next roofing project."
            />
          </div>

          <Button variant="outline" asChild className="self-start md:self-auto">
            <Link href="/blog" className="inline-flex items-center gap-1.5 font-display uppercase tracking-wider text-xs font-bold">
              <span>View All Articles</span>
              <span>&rarr;</span>
            </Link>
          </Button>
        </div>

        {/* Responsive Editorial Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
