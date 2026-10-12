import React from "react";
import { Metadata } from "next";
import { AdminBlogForm } from "@/components/admin/AdminBlogForm";

export const metadata: Metadata = {
  title: "New Article | WELTRIQ Admin",
};

export default function NewBlogPage() {
  return <AdminBlogForm isEditing={false} />;
}
