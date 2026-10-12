/**
 * WELTRIQ Blog Configuration Constants & Helpers
 */

export const HOME_BLOG_MAX_COUNT = 3;
export const BLOG_PAGE_SIZE = 9;

export const BLOG_CATEGORIES = [
  "Material Guides",
  "Project Planning",
  "Technical Insights",
  "Maintenance & Care",
  "Commercial Roofing",
  "Residential Roofing",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

/**
 * Generate a clean, SEO-friendly slug from an article title.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calculate estimated reading time in minutes based on ~200 wpm.
 */
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
}
