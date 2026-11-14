"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Clock,
  Calendar,
  Download,
  Phone,
  MapPin,
  TrendingUp,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  Users,
  Search,
} from "lucide-react";
import { LeadEnquiry } from "@/lib/leads/types";
import {
  TimeframeFilter,
  filterLeadsByTimeframe,
  getLeadTimeframeCounts,
  exportLeadsToCSV,
} from "@/lib/leads/utils";

interface AdminLeadsAnalyticsProps {
  initialLeads: LeadEnquiry[];
}

export function AdminLeadsAnalytics({ initialLeads }: AdminLeadsAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>("today");
  const [search, setSearch] = useState("");

  // Calculate live counts for each button
  const counts = useMemo(() => getLeadTimeframeCounts(initialLeads), [initialLeads]);

  // Filter leads based on selected timeframe
  const periodLeads = useMemo(
    () => filterLeadsByTimeframe(initialLeads, timeframe),
    [initialLeads, timeframe]
  );

  // Search filtered leads
  const filtered = useMemo(() => {
    if (!search.trim()) return periodLeads;
    const q = search.toLowerCase();
    return periodLeads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.district && l.district.toLowerCase().includes(q)) ||
        (l.service && l.service.toLowerCase().includes(q)) ||
        (l.message && l.message.toLowerCase().includes(q))
    );
  }, [periodLeads, search]);

  // Compute Analytics Metrics
  const totalCount = periodLeads.length;

  // Pipeline Status Breakdown
  const statusCounts = useMemo(() => {
    const s = { new: 0, contacted: 0, inspection_scheduled: 0, completed: 0 };
    periodLeads.forEach((l) => {
      if (l.status in s) {
        s[l.status as keyof typeof s]++;
      } else {
        s.new++;
      }
    });
    return s;
  }, [periodLeads]);

  // Service Demand Breakdown
  const serviceDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    periodLeads.forEach((l) => {
      const s = l.service?.trim() || "General Inquiry";
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({
        name,
        count,
        percent: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [periodLeads, totalCount]);

  // District Distribution Breakdown
  const districtDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    periodLeads.forEach((l) => {
      const d = l.district?.trim() || "Kerala";
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({
        name,
        count,
        percent: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [periodLeads, totalCount]);

  // Source Distribution Breakdown
  const sourceDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    periodLeads.forEach((l) => {
      const src = l.source || "Contact Form";
      map[src] = (map[src] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
      percent: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
    }));
  }, [periodLeads, totalCount]);

  const topService = serviceDistribution[0]?.name || "";
  const topDistrict = districtDistribution[0]?.name || "";

  const handleExport = () => {
    exportLeadsToCSV(filtered, timeframe);
  };

  const timeframeLabels: { key: TimeframeFilter; label: string; count: number }[] = [
    { key: "today", label: "Today", count: counts.today },
    { key: "yesterday", label: "Yesterday", count: counts.yesterday },
    { key: "weekly", label: "This Week", count: counts.weekly },
    { key: "monthly", label: "This Month", count: counts.monthly },
    { key: "3months", label: "3 Months", count: counts["3months"] },
    { key: "all", label: "All Time", count: counts.all },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Analytics Card Header & Interactive Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-display uppercase tracking-widest font-bold bg-brand-yellow/20 text-brand-navy px-2.5 py-0.5 rounded-full border border-gray-200">
                <TrendingUp className="w-3.5 h-3.5 text-brand-navy" />
                Intelligence &amp; Conversion
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-gray-200">
                Live Analytics
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display uppercase font-bold text-brand-navy tracking-tight">
              Customer Leads Analytics
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-sans">
              Filter incoming customer inquiries by timeframe, analyze roofing demand trends, and export records.
            </p>
          </div>

          {/* Export to Excel / CSV Button & Back to Leads Link */}
          <div className="flex items-center gap-2 shrink-0 self-start lg:self-auto">
            <button
              type="button"
              onClick={handleExport}
              disabled={filtered.length === 0}
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-[#14204A] text-white text-xs font-display uppercase tracking-wider font-bold transition-all duration-200 shadow-2xs hover:shadow-xs border border-transparent hover:border-brand-yellow/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Export filtered leads to Microsoft Excel / CSV"
            >
              <Download className="w-4 h-4 text-brand-yellow group-hover:translate-y-0.5 group-hover:scale-110 transition-transform duration-200 stroke-[2.2]" />
              <span>Export to Excel</span>
            </button>
            <Link
              href="/admin/leads"
              className="group inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-brand-navy text-brand-navy hover:text-brand-yellow border border-gray-200/90 hover:border-brand-navy text-xs font-display uppercase tracking-wider font-bold transition-all duration-200 shadow-2xs hover:shadow-xs"
            >
              <span>Leads</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all duration-200" />
            </Link>
          </div>
        </div>

        {/* Timeframe Filter Buttons Strip (Requested Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-display uppercase tracking-wider font-bold text-gray-400 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Timeframe:</span>
          </div>
          {timeframeLabels.map((item) => {
            const isActive = timeframe === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTimeframe(item.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-display uppercase tracking-wider font-bold transition-all shadow-2xs cursor-pointer shrink-0 ${isActive
                    ? "bg-brand-navy text-white border border-brand-navy shadow-xs"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-white hover:border-gray-300"
                  }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${isActive
                      ? "bg-brand-yellow text-brand-navy font-bold"
                      : "bg-white text-gray-600 border border-gray-200"
                    }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Analytics KPI Cards for Selected Timeframe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Inquiries in Period - Warm Amber / Gold */}
        <div className="group relative overflow-hidden p-5 bg-gradient-to-b from-amber-50 to-amber-100/40 rounded-2xl border border-amber-200/80 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-yellow group-hover:h-1.5 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-display uppercase tracking-wider text-gray-500 font-bold">
                Period Inquiries
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200/80 shadow-2xs group-hover:bg-white group-hover:text-gray-700 group-hover:scale-105 transition-all">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-brand-navy">{totalCount}</span>
              <span className="text-xs text-gray-500 font-sans">
                in {timeframeLabels.find((t) => t.key === timeframe)?.label.toLowerCase()}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-sans mt-2 pt-2 border-t border-amber-200/50">
            {totalCount > 0 ? "Active customer demand" : "Awaiting customer inquiries"}
          </p>
        </div>

        {/* KPI 2: Top Requested Service - Sky / Slate Blue */}
        <div className="group relative overflow-hidden p-5 bg-gradient-to-b from-blue-50 to-blue-100/40 rounded-2xl border border-blue-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 group-hover:h-1.5 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-display uppercase tracking-wider text-gray-500 font-bold">
                Top Service Demand
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200/80 shadow-2xs group-hover:bg-white group-hover:text-gray-700 group-hover:scale-105 transition-all">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="truncate">
              {totalCount > 0 && topService ? (
                <>
                  <span className="text-base sm:text-lg font-display font-bold text-brand-navy truncate block">
                    {topService}
                  </span>
                  <span className="text-xs text-brand-navy font-sans font-bold">
                    {serviceDistribution[0]?.percent}% of total demand
                  </span>
                </>
              ) : (
                <>
                  <span className="text-base font-display font-bold text-brand-navy block">
                    Awaiting Inquiries
                  </span>
                  <span className="text-xs text-gray-400 font-sans font-medium">
                    {counts.all > 0 ? "Select 'All Time' for trends" : "Ready for first inquiry"}
                  </span>
                </>
              )}
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-sans mt-2 pt-2 border-t border-blue-200/50">
            {totalCount > 0 ? "Leading roofing inquiry" : "Roofing material demand"}
          </p>
        </div>

        {/* KPI 3: Top Kerala District - Royal Indigo / Violet */}
        <div className="group relative overflow-hidden p-5 bg-gradient-to-b from-indigo-50 to-indigo-100/40 rounded-2xl border border-indigo-200/80 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 group-hover:h-1.5 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-display uppercase tracking-wider text-gray-500 font-bold">
                Top District Location
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200/80 shadow-2xs group-hover:bg-white group-hover:text-gray-700 group-hover:scale-105 transition-all">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="truncate">
              {totalCount > 0 && topDistrict ? (
                <>
                  <span className="text-base sm:text-lg font-display font-bold text-brand-navy truncate block">
                    {topDistrict}
                  </span>
                  <span className="text-xs text-brand-navy font-sans font-bold">
                    {districtDistribution[0]?.percent}% of regional demand
                  </span>
                </>
              ) : (
                <>
                  <span className="text-base font-display font-bold text-brand-navy block">
                    Across Kerala
                  </span>
                  <span className="text-xs text-gray-400 font-sans font-medium">
                    State-wide service coverage
                  </span>
                </>
              )}
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-sans mt-2 pt-2 border-t border-indigo-200/50">
            {totalCount > 0 ? "Highest regional concentration" : "All 14 districts supported"}
          </p>
        </div>

        {/* KPI 4: Sales Pipeline Breakdown - Fresh Mint / Emerald */}
        <div className="group relative overflow-hidden p-5 bg-gradient-to-b from-emerald-50 to-emerald-100/40 rounded-2xl border border-emerald-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 group-hover:h-1.5 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-display uppercase tracking-wider text-gray-500 font-bold">
                Inquiry Pipeline
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200/80 shadow-2xs group-hover:bg-white group-hover:text-gray-700 group-hover:scale-105 transition-all">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <div className="bg-white/80 p-1.5 rounded-lg border border-gray-200/70 shadow-2xs">
                <span className="text-amber-800 font-bold block">{statusCounts.new}</span>
                <span className="text-[10px] text-gray-500">New</span>
              </div>
              <div className="bg-white/80 p-1.5 rounded-lg border border-gray-200/70 shadow-2xs">
                <span className="text-blue-800 font-bold block">{statusCounts.contacted}</span>
                <span className="text-[10px] text-gray-500">Contacted</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-sans mt-2 pt-2 border-t border-emerald-200/50 flex items-center justify-between">
            <span>{statusCounts.inspection_scheduled} Inspections</span>
            <span>{statusCounts.completed} Done</span>
          </p>
        </div>
      </div>

      {/* Filtered Period Leads List (Moved directly below the 4 KPI Cards) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-display uppercase font-bold text-brand-navy">
              Inquiries for {timeframeLabels.find((t) => t.key === timeframe)?.label}
            </h3>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              {filtered.length} leads
            </span>
          </div>

          {/* Quick Search within filtered leads */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, phone, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 h-9 text-xs bg-gray-50 border border-gray-200 rounded-xl text-brand-navy placeholder:text-gray-400 focus:outline-none focus:border-brand-navy focus:bg-white transition-all font-sans"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-8 text-center space-y-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <p className="text-xs sm:text-sm font-bold text-brand-navy font-display uppercase">
              No Leads Recorded for {timeframeLabels.find((t) => t.key === timeframe)?.label}
            </p>
            <p className="text-xs text-gray-500 font-sans max-w-sm mx-auto">
              Select &ldquo;All Time&rdquo; or another timeframe above to review previous inquiries.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.slice(0, 6).map((lead) => {
              const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
              const dateDisplay = new Date(lead.createdAt).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={lead.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50/40 hover:bg-white transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-brand-navy font-sans truncate">
                          {lead.name}
                        </span>
                        <span className="text-[10px] font-display uppercase tracking-wider font-bold px-2 py-0.2 rounded-full border border-gray-200 bg-white text-gray-600">
                          {lead.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-sans mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {lead.district || "Kerala"}
                        </span>
                        <span>•</span>
                        <span className="text-[11px] text-gray-400">{dateDisplay}</span>
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
                      {lead.service || "Roofing Consultation"}:
                    </span>
                    {lead.message || "Customer requested contact regarding roofing services."}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Analytics Grid: Service Demand & District Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 cols): Roofing Service Demand Distribution */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-display uppercase font-bold text-brand-navy">
                Roofing Service Demand Breakdown
              </h3>
              <p className="text-xs text-gray-400 font-sans">Customer requirements for {timeframeLabels.find((t) => t.key === timeframe)?.label.toLowerCase()}</p>
            </div>
            <span className="text-[11px] font-mono text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-md border border-gray-200">
              {serviceDistribution.length} categories
            </span>
          </div>

          {serviceDistribution.length === 0 ? (
            <p className="text-xs text-gray-400 font-sans py-4 text-center">
              Awaiting customer inquiries for this period. Material trends will automatically appear as requests arrive.
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {serviceDistribution.slice(0, 5).map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="font-bold text-brand-navy truncate max-w-xs">{item.name}</span>
                    <span className="font-mono text-gray-500 font-medium">
                      {item.count} leads ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-navy rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(item.percent, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right (5 cols): Geographic District Distribution */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-display uppercase font-bold text-brand-navy">
                Regional District Breakdown
              </h3>
              <p className="text-xs text-gray-400 font-sans">Kerala customer locations</p>
            </div>
            <span className="text-[11px] font-mono text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-md border border-gray-200">
              {districtDistribution.length} districts
            </span>
          </div>

          {districtDistribution.length === 0 ? (
            <p className="text-xs text-gray-400 font-sans py-4 text-center">
              Awaiting regional location inquiries for this period. Coverage spans all 14 Kerala districts.
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
                      {item.count} ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-yellow rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(item.percent, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

