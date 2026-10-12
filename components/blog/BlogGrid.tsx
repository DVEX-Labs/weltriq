import React from "react";
import { BlogArticle } from "@/lib/blog/types";
import { BlogCard } from "./BlogCard";

interface BlogGridProps {
  articles: BlogArticle[];
  columns?: 3 | 4;
  className?: string;
}

export function BlogGrid({ articles, columns = 3, className = "" }: BlogGridProps) {
  const gridColsClass =
    columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${gridColsClass} gap-6 md:gap-8 ${className}`}>
      {articles.map((article) => (
        <BlogCard key={article.id} article={article} />
      ))}
    </div>
  );
}
