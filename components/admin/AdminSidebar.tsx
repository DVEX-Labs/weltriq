"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  MessageSquare,
  BarChart3,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
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

  interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
    badge?: string;
  }

  // Exact requested order:
  // 1) Overview
  // 2) Leads & Enquiries
  // 3) Analytics
  // 4) Services
  // 5) Articles & Guides
  // 6) Company Info
  // 7) Security
  const navItems: NavItem[] = [
    {
      name: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      name: "Leads & Enquiries",
      href: "/admin/leads",
      icon: MessageSquare,
      isActive: pathname.startsWith("/admin/leads"),
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      isActive: pathname.startsWith("/admin/analytics"),
    },
    {
      name: "Services",
      href: "/admin/services",
      icon: Layers,
      isActive: pathname.startsWith("/admin/services"),
    },
    {
      name: "Articles & Guides",
      href: "/admin/blogs",
      icon: BookOpen,
      isActive: pathname.startsWith("/admin/blogs"),
    },
    {
      name: "Company Info",
      href: "/admin/company-info",
      icon: Building2,
      isActive: pathname.startsWith("/admin/company-info"),
    },
    {
      name: "Security",
      href: "/admin/security",
      icon: ShieldCheck,
      isActive: pathname.startsWith("/admin/security"),
    },
  ];

  return (
    <>
      {/* Mobile Top App Bar (< md) */}
      <div className="md:hidden sticky top-0 z-40 bg-brand-navy text-brand-white px-4 py-3 flex items-center justify-between border-b border-brand-navy/20 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-brand-white transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="bg-brand-white px-2 py-1 rounded">
            <Image
              src="/logo/weltriq-logo.svg"
              alt="WELTRIQ Admin"
              width={100}
              height={26}
              className="h-6 w-auto object-contain"
            />
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-yellow/20 text-brand-yellow px-2 py-0.5 rounded border border-brand-yellow/30">
          Admin
        </span>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar (Desktop fixed left, Mobile drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 lg:w-72 bg-brand-navy text-brand-white flex flex-col justify-between border-r border-white/10 transition-transform duration-300 ease-out shadow-2xl md:shadow-none select-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top: Logo & Navigation */}
        <div>
          {/* 1) WELTRIQ logo row: Full width white background with centered logo */}
          <div className="bg-white py-4 px-5 flex items-center justify-center border-b border-gray-200">
            <Link
              href="/admin"
              className="flex items-center justify-center group"
              onClick={() => setMobileOpen(false)}
            >
              <Image
                src="/logo/weltriq-logo.svg"
                alt="WELTRIQ Logo"
                width={150}
                height={38}
                priority
                className="h-7 lg:h-8 w-auto object-contain group-hover:scale-[1.02] transition-transform"
              />
            </Link>
          </div>

          {/* 2) ADMIN PORTAL text: Centered with grey color matching menu labels */}
          <div className="py-2.5 px-4 text-center border-b border-white/10">
            <span className="text-[10px] font-display uppercase tracking-widest font-bold text-white/40">
              Admin Portal
            </span>
          </div>

          {/* 3) Nav Items in exact specified order */}
          <nav className="p-3 lg:p-4 space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-display uppercase tracking-widest text-white/40 font-bold">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-display uppercase tracking-wider font-bold transition-all duration-200 ${
                    item.isActive
                      ? "bg-brand-yellow text-brand-navy shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        item.isActive ? "text-brand-navy stroke-[2.5]" : "text-white/60"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-normal ${
                        item.isActive
                          ? "bg-brand-navy/20 text-brand-navy font-bold"
                          : "bg-white/10 text-brand-yellow"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Live Site Link (Quick Actions removed, Live Site retained) */}
            <div className="pt-4">
              <Link
                href="/"
                target="_blank"
                className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-sans text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/15"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-brand-yellow group-hover:scale-110 transition-all" />
                  <span>View Live Site</span>
                </span>
                <span className="text-[10px] text-white/30 group-hover:text-brand-yellow group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  ↗
                </span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Bottom: Sign Out Button (Replaced Administrator and Super Admin text with red button) */}
        <div className="p-4 border-t border-white/10 bg-brand-navy/60">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="group w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white font-display uppercase tracking-wider text-xs font-bold transition-all shadow-2xs hover:shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 text-red-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
            <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
