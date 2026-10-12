import fs from "fs";
import path from "path";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import {
  BlogArticle,
  BlogListQuery,
  CreateBlogInput,
  PaginatedResult,
  UpdateBlogInput,
} from "./types";
import {
  calculateReadingTime,
  generateSlug,
  BLOG_PAGE_SIZE,
} from "./config";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "blogs.json");

// In-process lock to prevent concurrent write collisions
let writeLock = Promise.resolve();

async function readAllArticles(): Promise<BlogArticle[]> {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      await fs.promises.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
      await fs.promises.writeFile(DATA_FILE_PATH, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    const data = await fs.promises.readFile(DATA_FILE_PATH, "utf8");
    return JSON.parse(data || "[]") as BlogArticle[];
  } catch (error) {
    console.error("Error reading blogs data:", error);
    return [];
  }
}

async function writeAllArticles(articles: BlogArticle[]): Promise<void> {
  const op = async () => {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    const tempFile = `${DATA_FILE_PATH}.${Date.now()}.${crypto.randomBytes(4).toString("hex")}.tmp`;
    await fs.promises.writeFile(tempFile, JSON.stringify(articles, null, 2), "utf8");
    await fs.promises.rename(tempFile, DATA_FILE_PATH);
  };

  writeLock = writeLock.then(op, op);
  return writeLock;
}

/**
 * Ensure the generated or provided slug is globally unique.
 */
function makeUniqueSlug(candidate: string, existingArticles: BlogArticle[], currentId?: string): string {
  const base = candidate || "article";
  let slug = base;
  let counter = 1;

  while (
    existingArticles.some(
      (a) => a.slug === slug && (!currentId || a.id !== currentId)
    )
  ) {
    counter += 1;
    slug = `${base}-${counter}`;
  }

  return slug;
}

/* =========================================================================
   PUBLIC QUERIES (PUBLISHED ONLY)
   ========================================================================= */

/**
 * Get paginated published articles for the public blog listing.
 */
export async function getPublishedArticles(
  query: BlogListQuery = {}
): Promise<PaginatedResult<BlogArticle>> {
  const articles = await readAllArticles();
  const page = Math.max(1, query.page || 1);
  const limit = Math.max(1, query.limit || BLOG_PAGE_SIZE);

  let filtered = articles.filter((a) => a.status === "published");

  if (query.category) {
    filtered = filtered.filter(
      (a) => a.category.toLowerCase() === query.category?.toLowerCase()
    );
  }

  if (query.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }

  // Sort by publishedAt descending (or updatedAt if publishedAt is missing)
  filtered.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.updatedAt).getTime();
    const dateB = new Date(b.publishedAt || b.updatedAt).getTime();
    return dateB - dateA;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const items = filtered.slice(startIndex, startIndex + limit);

  return {
    items,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

/**
 * Fast query for Home Page section or related articles.
 */
export async function getLatestPublishedArticles(
  limit: number = 3
): Promise<BlogArticle[]> {
  const result = await getPublishedArticles({ page: 1, limit });
  return result.items;
}

/**
 * Get a single published article by its unique slug. Returns null for drafts.
 */
export async function getPublishedArticleBySlug(
  slug: string
): Promise<BlogArticle | null> {
  const articles = await readAllArticles();
  const article = articles.find(
    (a) => a.slug === slug && a.status === "published"
  );
  return article || null;
}

/**
 * Get up to N related articles from the same category (excluding current).
 */
export async function getRelatedArticles(
  currentSlug: string,
  category: string,
  limit: number = 3
): Promise<BlogArticle[]> {
  const articles = await readAllArticles();
  const published = articles.filter(
    (a) => a.status === "published" && a.slug !== currentSlug
  );

  const sameCategory = published.filter(
    (a) => a.category.toLowerCase() === category.toLowerCase()
  );

  const pool = sameCategory.length >= limit ? sameCategory : published;
  return pool.slice(0, limit);
}

/* =========================================================================
   ADMIN QUERIES & MUTATIONS (INCLUDES DRAFTS)
   ========================================================================= */

/**
 * Admin: List all articles with optional search and status filter.
 */
export async function getAllArticlesAdmin(params: {
  status?: string;
  search?: string;
} = {}): Promise<BlogArticle[]> {
  const articles = await readAllArticles();

  let filtered = [...articles];

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((a) => a.status === params.status);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

  return filtered;
}

/**
 * Admin: Retrieve any article by ID.
 */
export async function getArticleByIdAdmin(
  id: string
): Promise<BlogArticle | null> {
  const articles = await readAllArticles();
  return articles.find((a) => a.id === id) || null;
}

/**
 * Admin: Create a new blog article.
 */
export async function createArticle(
  input: CreateBlogInput
): Promise<BlogArticle> {
  const articles = await readAllArticles();
  const now = new Date().toISOString();

  const rawSlug = input.slug ? generateSlug(input.slug) : generateSlug(input.title);
  const slug = makeUniqueSlug(rawSlug, articles);

  const status = input.status || "draft";
  const readingTimeMinutes = calculateReadingTime(input.content);

  const newArticle: BlogArticle = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt.trim(),
    coverImage: input.coverImage.trim(),
    coverImageAlt: input.coverImageAlt?.trim(),
    content: input.content.trim(),
    category: input.category.trim(),
    tags: input.tags || [],
    status,
    author: input.author,
    readingTimeMinutes,
    seoTitle: input.seoTitle?.trim() || input.title.trim(),
    seoDescription: input.seoDescription?.trim() || input.excerpt.trim(),
    publishedAt: status === "published" ? now : undefined,
    createdAt: now,
    updatedAt: now,
  };

  articles.push(newArticle);
  await writeAllArticles(articles);

  // Invalidate public and admin routes
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blogs");

  return newArticle;
}

/**
 * Admin: Update an existing article.
 */
export async function updateArticle(
  input: UpdateBlogInput
): Promise<BlogArticle> {
  const articles = await readAllArticles();
  const index = articles.findIndex((a) => a.id === input.id);

  if (index === -1) {
    throw new Error(`Article with ID "${input.id}" not found.`);
  }

  const existing = articles[index];
  const now = new Date().toISOString();

  let slug = existing.slug;
  if (input.slug && input.slug !== existing.slug) {
    slug = makeUniqueSlug(generateSlug(input.slug), articles, existing.id);
  } else if (input.title && !input.slug && input.title !== existing.title) {
    // If title changed and slug wasn't explicitly specified, keep current slug unless requested
  }

  const newStatus = input.status || existing.status;
  const isNowPublished = newStatus === "published" && !existing.publishedAt;
  const publishedAt = isNowPublished ? now : existing.publishedAt;

  const content = input.content !== undefined ? input.content.trim() : existing.content;
  const readingTimeMinutes = calculateReadingTime(content);

  const updated: BlogArticle = {
    ...existing,
    title: input.title !== undefined ? input.title.trim() : existing.title,
    slug,
    excerpt: input.excerpt !== undefined ? input.excerpt.trim() : existing.excerpt,
    coverImage: input.coverImage !== undefined ? input.coverImage.trim() : existing.coverImage,
    coverImageAlt: input.coverImageAlt !== undefined ? input.coverImageAlt.trim() : existing.coverImageAlt,
    content,
    category: input.category !== undefined ? input.category.trim() : existing.category,
    tags: input.tags !== undefined ? input.tags : existing.tags,
    status: newStatus,
    author: input.author !== undefined ? input.author : existing.author,
    readingTimeMinutes,
    seoTitle: input.seoTitle !== undefined ? input.seoTitle.trim() : existing.seoTitle,
    seoDescription: input.seoDescription !== undefined ? input.seoDescription.trim() : existing.seoDescription,
    publishedAt,
    updatedAt: now,
  };

  articles[index] = updated;
  await writeAllArticles(articles);

  // Invalidate public and admin routes
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  if (slug !== existing.slug) {
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath("/admin/blogs");

  return updated;
}

/**
 * Admin: Delete an article by ID.
 */
export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await readAllArticles();
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) {
    return false;
  }

  const removed = articles.splice(index, 1)[0];
  await writeAllArticles(articles);

  // Invalidate public and admin routes
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${removed.slug}`);
  revalidatePath("/admin/blogs");

  return true;
}
