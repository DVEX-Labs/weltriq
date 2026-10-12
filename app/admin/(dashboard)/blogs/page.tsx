import React from "react";
import { getAllArticlesAdmin } from "@/lib/blog/db";
import { AdminBlogList } from "@/components/admin/AdminBlogList";

export const metadata = {
  title: "Articles Management | WELTRIQ Admin",
};

export default async function AdminBlogsPage() {
  const articles = await getAllArticlesAdmin();

  return <AdminBlogList initialArticles={articles} />;
}
