import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticatedAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
    <div className="min-h-screen bg-[#FAF8F5] text-brand-navy flex flex-col md:flex-row font-sans selection:bg-brand-yellow selection:text-brand-navy">
      {/* Sleek Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 lg:ml-72 min-w-0 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
