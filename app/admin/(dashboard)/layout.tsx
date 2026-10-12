import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticatedAdmin } from "@/lib/auth/session";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Admin Portal | WELTRIQ Roofing Solutions",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAuthenticatedAdmin();

  if (!isAuth) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-brand-island-spice/60 flex flex-col font-sans">
      <AdminHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
