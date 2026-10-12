export type BlogStatus = "draft" | "published";

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt?: string;
  content: string;
  category: string;
  tags?: string[];
  status: BlogStatus;
  author?: {
    name: string;
    role?: string;
  };
  readingTimeMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface CreateBlogInput {
  title: string;
  slug?: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt?: string;
  content: string;
  category: string;
  tags?: string[];
  status?: BlogStatus;
  author?: {
    name: string;
    role?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateBlogInput extends Partial<CreateBlogInput> {
  id: string;
}
