import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  BookOpen,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  MessageSquare,
  Phone,
  MapPin,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { getAllArticlesAdmin } from "@/lib/blog/db";
import { readAllServices } from "@/lib/services/db";
import { readAllLeads } from "@/lib/leads/db";

export const metadata = {
  title: "Dashboard Overview | WELTRIQ Admin",
};

export default async function AdminOverviewPage() {
  const [articles, services, leads] = await Promise.all([
    getAllArticlesAdmin(),
    readAllServices(),
    readAllLeads(),
  ]);

  // Metric calculations
  const publishedCount = articles.filter((a) => a.status === "published").length;

  // Calculate Today's Leads Count & List
  const todayDateStr = new Date().toDateString();
  const todayLeads = leads.filter((l) => {
    try {
      return new Date(l.createdAt).toDateString() === todayDateStr;
    } catch {
      return false;
    }
  });
  const todayLeadCount = todayLeads.length;
  const totalLeadCount = leads.length;

  // Analytics: Service Demand Breakdown
  const serviceDistribution = (() => {
    const map: Record<string, number> = {};
    leads.forEach((l) => {
      const s = l.service?.trim() || "Roofing Consultation";
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({
        name,
        count,
        percent: leads.length > 0 ? Math.round((count / leads.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  })();

  // Analytics: District Distribution Breakdown
  const districtDistribution = (() => {
    const map: Record<string, number> = {};
    leads.forEach((l) => {
      const d = l.district?.trim() || "Kerala";
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({
        name,
        count,
        percent: leads.length > 0 ? Math.round((count / leads.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  })();

  const recentArticles = articles.slice(0, 4);
  const recentServices = services.slice(0, 5);

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Top Header Banner Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-display uppercase tracking-widest font-bold text-brand-navy/70 bg-brand-navy/5 px-3 py-1 rounded-full border border-brand-navy/10">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shrink-0" />
            Operations Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-display uppercase font-bold text-brand-navy tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 font-sans max-w-2xl leading-relaxed">
            Manage your roofing services, technical blog articles, and customer leads with single-point administrative control.
          </p>
        </div>
      </div>

      {/* 2. Overview Cards: Today Lead Count, Total Lead Count, Active Services, Published Blogs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Today Lead Count - Light Amber/Gold Background */}
        <Link
          href="/admin/leads"
          className="group relative overflow-hidden p-5 bg-gradient-to-b from-amber-50 to-amber-100/40 rounded-2xl border border-amber-200/80 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-yellow group-hover:h-1.5 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-display uppercase tracking-wider text-gray-500 font-bold">
                Today&apos;s Leads
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200/80 shadow-2xs group-hover:bg-white group-hover:text-gray-700 group-hover:scale-105 transition-all">
                <Clock className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-bold text-brand-navy">
                {todayLeadCount}
              </span>
              <span
                className={`text-xs font-sans font-bold px-2.5 py-0.5 rounded-full border ${todayLeadCount > 0
                  ? "bg-brand-yellow/25 text-brand-navy border-brand-yellow/50"
                  : "bg-white/80 text-gray-600 border-gray-200"
                  }`}
              >
                {todayLeadCount > 0 ? "Fresh Today" : "None Today"}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-3 pt-3 border-t border-amber-200/50 flex items-center justify-between">
            <span>Direct customer inquiries</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-navy group-hover:translate-x-0.5 transition-all" />
          </p>
        </Link>

        {/* Card 2: Total Lead Count - Light Sky/Blue Background */}
        <Link
          href="/admin/leads"
          className="group relative overflow-hidden p-5 bg-gradient-to-b from-blue-50 to-blue-100/40 rounded-2xl border border-blue-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 group-hover:h-1.5 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-display uppercase tracking-wider text-gray-500 font-bold">
                Total Leads
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200/80 shadow-2xs group-hover:bg-white group-hover:text-gray-700 group-hover:scale-105 transition-all">
                <MessageSquare className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-bold text-brand-navy">
                {totalLeadCount}
              </span>
              <span className="text-xs text-brand-navy font-sans font-bold px-2.5 py-0.5 rounded-full bg-white/80 border border-gray-200">
                Recorded
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-3 pt-3 border-t border-blue-200/50 flex items-center justify-between">
            <span>Safety backup Leads</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-navy group-hover:translate-x-0.5 transition-all" />
          </p>
        </Link>

        {/* Card 3: Active Services - Light Indigo/Violet Background */}
        <Link
          href="/admin/services"
          className="group relative overflow-hidden p-5 bg-gradient-to-b from-indigo-50 to-indigo-100/40 rounded-2xl border border-indigo-200/80 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 group-hover:h-1.5 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-display uppercase tracking-wider text-gray-500 font-bold">
                Active Services
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200/80 shadow-2xs group-hover:bg-white group-hover:text-gray-700 group-hover:scale-105 transition-all">
                <Layers className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-bold text-brand-navy">
                {services.length}
              </span>
              <span className="text-xs text-brand-navy font-sans font-bold px-2.5 py-0.5 rounded-full bg-white/80 border border-gray-200">
                In Deck Stack
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-3 pt-3 border-t border-indigo-200/50 flex items-center justify-between">
            <span>Sticky deck &amp; services page</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-navy group-hover:translate-x-0.5 transition-all" />
          </p>
        </Link>

        {/* Card 4: Published Blogs - Light Mint/Emerald Background */}
        <Link
          href="/admin/blogs"
          className="group relative overflow-hidden p-5 bg-gradient-to-b from-emerald-50 to-emerald-100/40 rounded-2xl border border-emerald-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 group-hover:h-1.5 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-display uppercase tracking-wider text-gray-500 font-bold">
                Published Blogs
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200/80 shadow-2xs group-hover:bg-white group-hover:text-gray-700 group-hover:scale-105 transition-all">
                <BookOpen className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-bold text-brand-navy">
                {publishedCount}
              </span>
              <span className="text-xs text-brand-navy font-sans font-bold px-2.5 py-0.5 rounded-full bg-white/80 border border-gray-200">
                Live Online
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-sans mt-3 pt-3 border-t border-emerald-200/50 flex items-center justify-between">
            <span>Knowledge directory</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-navy group-hover:translate-x-0.5 transition-all" />
          </p>
        </Link>
      </div>

      {/* 3. Enquiries for Today (Requested: Below Overview Cards) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200/80 shadow-2xs">
              <Clock className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-display uppercase font-bold text-brand-navy">
                  Enquiries for Today
                </h2>
                <span
                  className={`text-[10px] font-display uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${todayLeadCount > 0
                    ? "bg-brand-yellow/25 text-brand-navy border-brand-yellow/40"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                >
                  {todayLeadCount > 0 ? `${todayLeadCount} New Today` : "0 Today"}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans">
                Customer inquiries received today from website submissions and WhatsApp launches
              </p>
            </div>
          </div>

          <Link
            href="/admin/leads"
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-brand-navy text-brand-navy hover:text-brand-yellow border border-gray-200/90 hover:border-brand-navy text-[11px] font-display uppercase tracking-wider font-bold transition-all duration-200 shadow-2xs hover:shadow-xs self-start sm:self-auto shrink-0"
          >
            <span>View All Leads ({totalLeadCount})</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all duration-200" />
          </Link>
        </div>

        {todayLeads.length === 0 ? (
          <div className="p-8 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-center space-y-2">
            <p className="text-sm font-bold text-brand-navy font-display uppercase">
              No Customer Inquiries Received Yet Today
            </p>

            <div className="pt-2">
              <Link
                href="/admin/leads"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-[#14204A] text-white text-xs font-display uppercase tracking-wider font-bold transition-all duration-200 shadow-2xs hover:shadow-xs border border-transparent hover:border-brand-yellow/30"
              >
                <span>Check Historical Leads ({totalLeadCount})</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-yellow group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayLeads.map((lead) => {
              const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
              const timeDisplay = new Date(lead.createdAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={lead.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-white transition-all space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-brand-navy font-sans truncate">
                          {lead.name}
                        </span>
                        <span className="text-[9px] font-display uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Today
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-sans mt-0.5 flex-wrap">
                        {lead.district && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {lead.district}
                          </span>
                        )}
                        <span>•</span>
                        <span className="text-gray-400 text-[11px]">{timeDisplay}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}?text=${encodeURIComponent(
                          `Hello ${lead.name}, thank you for contacting WELTRIQ Roofing Solutions.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-2xs"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-2 rounded-lg bg-brand-navy hover:bg-[#14204A] text-white transition-colors shadow-2xs"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="text-xs font-sans text-gray-600 bg-white p-2.5 rounded-lg border border-gray-200 line-clamp-2 leading-relaxed">
                    <span className="font-bold text-brand-navy mr-1">
                      {lead.service || "Inquiry"}:
                    </span>
                    {lead.message || "Customer requested contact regarding roofing services."}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Analytics 2 Graphs: Left and Right (Requested: Below Enquiries for Today) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Graph: Roofing Service Demand Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200/80 shadow-2xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-display uppercase font-bold text-brand-navy">
                  Roofing Service Demand
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-sans">Customer material inquiries distribution</p>
            </div>
            <Link
              href="/admin/analytics"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-brand-navy text-brand-navy hover:text-brand-yellow border border-gray-200/90 hover:border-brand-navy text-[11px] font-display uppercase tracking-wider font-bold transition-all duration-200 shadow-2xs hover:shadow-xs shrink-0"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all duration-200" />
            </Link>
          </div>

          {serviceDistribution.length === 0 ? (
            <p className="text-xs text-gray-400 font-sans py-6 text-center">
              Awaiting customer inquiries. Material demand trends will automatically populate as requests arrive.
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {serviceDistribution.slice(0, 5).map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="font-bold text-brand-navy truncate max-w-[240px]">
                      {item.name}
                    </span>
                    <span className="font-mono text-gray-500 font-medium">
                      {item.count} leads ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-navy rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(item.percent, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Graph: Regional District Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200/80 shadow-2xs">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-display uppercase font-bold text-brand-navy">
                  Regional District Breakdown
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-sans">Kerala customer inquiry locations</p>
            </div>
            <Link
              href="/admin/analytics"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-brand-navy text-brand-navy hover:text-brand-yellow border border-gray-200/90 hover:border-brand-navy text-[11px] font-display uppercase tracking-wider font-bold transition-all duration-200 shadow-2xs hover:shadow-xs shrink-0"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all duration-200" />
            </Link>
          </div>

          {districtDistribution.length === 0 ? (
            <p className="text-xs text-gray-400 font-sans py-6 text-center">
              Awaiting customer location data. Regional coverage spans all 14 Kerala districts.
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {districtDistribution.slice(0, 5).map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="font-bold text-brand-navy flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {item.name}
                    </span>
                    <span className="font-mono text-gray-500 font-medium">
                      {item.count} leads ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-yellow rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(item.percent, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Two Column Grid: Recent Articles & Services Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Articles & Guides (7 cols) - Height capped to never exceed Services Snapshot */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col max-h-[510px]">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 shrink-0">
            <div>
              <h2 className="text-base font-display uppercase font-bold text-brand-navy">
                Recent Articles &amp; Guides
              </h2>
              <p className="text-xs text-gray-400 font-sans">Published insights &amp; technical guides</p>
            </div>
            <Link
              href="/admin/blogs"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-brand-navy text-brand-navy hover:text-brand-yellow border border-gray-200/90 hover:border-brand-navy text-[11px] font-display uppercase tracking-wider font-bold transition-all duration-200 shadow-2xs hover:shadow-xs shrink-0"
            >
              <span>View All ({articles.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all duration-200" />
            </Link>
          </div>

          <div className="space-y-1.5 pt-4 overflow-y-auto max-h-[400px] pr-1">
            {recentArticles.length === 0 ? (
              <div className="p-8 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-center text-xs text-gray-400 font-sans">
                No articles published yet.
              </div>
            ) : (
              recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/blogs/${article.id}/edit`}
                  className="group p-3 sm:p-3.5 rounded-xl border border-transparent hover:border-gray-200 hover:bg-brand-navy/[0.03] active:bg-brand-navy/[0.05] transition-all duration-300 ease-out flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0 shadow-2xs group-hover:border-brand-navy/20 transition-colors">
                      {article.coverImage ? (
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-bold text-brand-navy truncate block group-hover:text-brand-navy transition-colors font-sans">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-sans">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-display uppercase tracking-wider text-[10px] font-bold border border-gray-200 group-hover:bg-white group-hover:border-gray-300 transition-colors">
                          {article.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3" />
                          {new Date(article.updatedAt || article.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-display uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border border-gray-200 ${article.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                        }`}
                    >
                      {article.status}
                    </span>

                    <div className="p-2 rounded-lg text-gray-400 group-hover:text-brand-navy group-hover:bg-white group-hover:shadow-2xs group-hover:translate-x-1 transition-all duration-300 border border-transparent group-hover:border-gray-200">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Manage Services / Services Snapshot (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md hover:border-gray-300 transition-all duration-300 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-display uppercase font-bold text-brand-navy">
                Services Snapshot
              </h2>
              <p className="text-xs text-gray-400 font-sans">Active roofing systems in deck</p>
            </div>
            <Link
              href="/admin/services"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-brand-navy text-brand-navy hover:text-brand-yellow border border-gray-200/90 hover:border-brand-navy text-[11px] font-display uppercase tracking-wider font-bold transition-all duration-200 shadow-2xs hover:shadow-xs shrink-0"
            >
              <span>Manage All ({services.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all duration-200" />
            </Link>
          </div>

          <div className="space-y-1.5">
            {recentServices.map((service, index) => (
              <Link
                key={service.id}
                href={`/admin/services/${service.id}/edit`}
                className="group p-3 sm:p-3.5 rounded-xl border border-transparent hover:border-gray-200 hover:bg-brand-navy/[0.03] active:bg-brand-navy/[0.05] transition-all duration-300 ease-out flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 group-hover:bg-brand-navy group-hover:text-brand-yellow px-2.5 py-1 rounded-lg border border-gray-200 group-hover:border-brand-navy shrink-0 transition-all duration-300 group-hover:scale-105">
                    {service.number || String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-brand-navy truncate group-hover:text-brand-navy transition-colors font-sans">
                      {service.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 truncate font-sans group-hover:text-gray-700 transition-colors">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-lg text-gray-400 group-hover:text-brand-navy group-hover:bg-white group-hover:shadow-2xs group-hover:translate-x-1 transition-all duration-300 border border-transparent group-hover:border-gray-200 shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/admin/services/new"
              className="group w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 hover:border-brand-navy text-xs font-display uppercase tracking-wider font-bold text-gray-700 hover:text-brand-navy hover:bg-gray-50 transition-all shadow-2xs hover:shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-brand-yellow group-hover:rotate-90 transition-transform duration-200" />
              <span>Add New Service Card</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
