import path from "path";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import {
  getSupabaseAdmin,
  assertWritableStorageAvailable,
  isSeedCompleted,
  markSeedCompleted,
  readLocalJsonFile,
  writeLocalJsonFile,
  extractSupabaseStoragePath,
  MEDIA_BUCKET,
} from "@/lib/storage/supabase";
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
const SEED_KEY = "blogs_seeded";

interface BlogRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  cover_image_alt: string | null;
  content: string;
  category: string;
  tags: string[] | null;
  status: "draft" | "published";
  author: { name: string; role?: string } | null;
  reading_time_minutes: number;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function rowToArticle(row: BlogRow): BlogArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImage: row.cover_image,
    coverImageAlt: row.cover_image_alt ?? undefined,
    content: row.content,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status,
    author: row.author ?? undefined,
    readingTimeMinutes: row.reading_time_minutes || 1,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    publishedAt: row.published_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function articleToRow(article: BlogArticle): BlogRow {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    cover_image: article.coverImage,
    cover_image_alt: article.coverImageAlt ?? null,
    content: article.content,
    category: article.category,
    tags: article.tags ?? [],
    status: article.status,
    author: article.author ?? null,
    reading_time_minutes: article.readingTimeMinutes,
    seo_title: article.seoTitle ?? null,
    seo_description: article.seoDescription ?? null,
    published_at: article.publishedAt ?? null,
    created_at: article.createdAt,
    updated_at: article.updatedAt,
  };
}

function revalidateBlogRoutes(slugs: string[]): void {
  try {
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin");
    revalidatePath("/admin/blogs");
    for (const slug of slugs) {
      if (slug) revalidatePath(`/blog/${slug}`);
    }
  } catch {
    // revalidatePath may throw outside request context
  }
}

async function readAllArticles(): Promise<BlogArticle[]> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase read blogs error:", error.message);
      throw new Error(`Database error reading blogs: ${error.message}`);
    }

    if (data && data.length > 0) {
      return (data as BlogRow[]).map(rowToArticle);
    }

    // One-time seed from bundled data/blogs.json if never seeded before
    const alreadySeeded = await isSeedCompleted(supabase, SEED_KEY);
    if (!alreadySeeded) {
      const seed = await readLocalJsonFile<BlogArticle[]>(DATA_FILE_PATH, []);
      if (seed.length > 0) {
        const { error: seedError } = await supabase
          .from("blogs")
          .upsert(seed.map(articleToRow), { onConflict: "id" });
        if (seedError) {
          console.error("Supabase seed blogs error:", seedError.message);
        }
      }
      await markSeedCompleted(supabase, SEED_KEY);
      return seed;
    }

    return [];
  }

  return readLocalJsonFile<BlogArticle[]>(DATA_FILE_PATH, []);
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

export async function getLatestPublishedArticles(
  limit: number = 3
): Promise<BlogArticle[]> {
  const result = await getPublishedArticles({ page: 1, limit });
  return result.items;
}

export async function getPublishedArticleBySlug(
  slug: string
): Promise<BlogArticle | null> {
  const articles = await readAllArticles();
  const article = articles.find(
    (a) => a.slug === slug && a.status === "published"
  );
  return article || null;
}

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

export async function getArticleByIdAdmin(
  id: string
): Promise<BlogArticle | null> {
  const articles = await readAllArticles();
  return articles.find((a) => a.id === id) || null;
}

export async function createArticle(
  input: CreateBlogInput
): Promise<BlogArticle> {
  const supabase = getSupabaseAdmin();
  assertWritableStorageAvailable(supabase);

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

  if (supabase) {
    const { error } = await supabase.from("blogs").insert(articleToRow(newArticle));
    if (error) {
      throw new Error(`Failed to save article: ${error.message}`);
    }
    await markSeedCompleted(supabase, SEED_KEY);
  } else {
    articles.push(newArticle);
    await writeLocalJsonFile<BlogArticle[]>(DATA_FILE_PATH, articles);
  }

  revalidateBlogRoutes([slug]);
  return newArticle;
}

export async function updateArticle(
  input: UpdateBlogInput
): Promise<BlogArticle> {
  const supabase = getSupabaseAdmin();
  assertWritableStorageAvailable(supabase);

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

  if (supabase) {
    const { error } = await supabase
      .from("blogs")
      .update(articleToRow(updated))
      .eq("id", existing.id);
    if (error) {
      throw new Error(`Failed to update article: ${error.message}`);
    }
  } else {
    articles[index] = updated;
    await writeLocalJsonFile<BlogArticle[]>(DATA_FILE_PATH, articles);
  }

  revalidateBlogRoutes(slug !== existing.slug ? [existing.slug, slug] : [existing.slug]);
  return updated;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  assertWritableStorageAvailable(supabase);

  const articles = await readAllArticles();
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) {
    return false;
  }

  const removed = articles.splice(index, 1)[0];

  if (supabase) {
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) {
      throw new Error(`Failed to delete article: ${error.message}`);
    }

    const storagePath = extractSupabaseStoragePath(removed.coverImage);
    if (storagePath) {
      const { error: removeImgError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .remove([storagePath]);
      if (removeImgError) {
        console.warn("Failed to remove blog cover from Supabase Storage:", removeImgError.message);
      }
    }
  } else {
    await writeLocalJsonFile<BlogArticle[]>(DATA_FILE_PATH, articles);
  }

  revalidateBlogRoutes([removed.slug]);
  return true;
}
