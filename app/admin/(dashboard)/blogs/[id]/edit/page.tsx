import React from "react";
import { notFound } from "next/navigation";
import { getArticleByIdAdmin } from "@/lib/blog/db";
import { AdminBlogForm } from "@/components/admin/AdminBlogForm";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Article | WELTRIQ Admin",
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const article = await getArticleByIdAdmin(id);

  if (!article) {
    notFound();
  }

  return <AdminBlogForm initialData={article} isEditing={true} />;
}
