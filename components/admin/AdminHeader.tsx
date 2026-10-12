"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, ExternalLink, LogOut, Plus } from "lucide-react";

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setLoggingOut(false);
    }
  };

  const isBlogsActive = pathname.startsWith("/admin/blogs");

  return (
    <header className="sticky top-0 z-50 bg-brand-navy text-brand-white border-b border-brand-navy/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Admin Tag */}
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs" className="flex items-center gap-2.5">
            <span className="font-display text-xl sm:text-2xl uppercase tracking-tight font-bold text-brand-white">
              WELTRIQ
            </span>
            <span className="text-[10px] font-display uppercase tracking-widest font-bold bg-brand-yellow/20 text-brand-yellow px-2 py-0.5 rounded border border-brand-yellow/30">
              Admin
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1 ml-6 border-l border-brand-white/10 pl-6">
            <Link
              href="/admin/blogs"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-display uppercase tracking-wider font-bold transition-colors ${
                isBlogsActive
                  ? "bg-brand-white/10 text-brand-yellow"
                  : "text-brand-white/75 hover:text-brand-white hover:bg-brand-white/5"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Articles</span>
            </Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-1.5 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy px-3.5 py-1.5 rounded text-xs font-display uppercase tracking-wider font-bold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">New Article</span>
            <span className="sm:hidden">New</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-brand-white/70 hover:text-brand-white px-2.5 py-1.5 rounded transition-colors"
          >
            <span>View Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-wider text-brand-white/70 hover:text-red-300 px-2.5 py-1.5 rounded transition-colors border border-brand-white/10 hover:border-red-400/30"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{loggingOut ? "..." : "Sign Out"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
