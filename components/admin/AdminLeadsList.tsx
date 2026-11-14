"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Phone,
  MessageSquare,
  Calendar,
  MapPin,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Download,
  Filter,
  ArrowRight,
} from "lucide-react";
import { LeadEnquiry } from "@/lib/leads/types";
import {
  TimeframeFilter,
  filterLeadsByTimeframe,
  getLeadTimeframeCounts,
  exportLeadsToCSV,
} from "@/lib/leads/utils";

interface AdminLeadsListProps {
  initialLeads: LeadEnquiry[];
}

export function AdminLeadsList({ initialLeads }: AdminLeadsListProps) {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadEnquiry[]>(initialLeads);
  const [timeframe, setTimeframe] = useState<TimeframeFilter>("today");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Live counts for each timeframe filter button
  const counts = useMemo(() => getLeadTimeframeCounts(leads), [leads]);

  // Filter leads based on active timeframe
  const periodLeads = useMemo(
    () => filterLeadsByTimeframe(leads, timeframe),
    [leads, timeframe]
  );

  // Search within timeframe filtered leads
  const filtered = useMemo(() => {
    if (!search.trim()) return periodLeads;
    const q = search.toLowerCase();
    return periodLeads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.district && lead.district.toLowerCase().includes(q)) ||
        (lead.service && lead.service.toLowerCase().includes(q)) ||
        (lead.message && lead.message.toLowerCase().includes(q))
    );
  }, [periodLeads, search]);

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

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/leads?id=${deletingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== deletingId));
        setDeletingId(null);
        router.refresh();
      } else {
        alert("Failed to delete lead from backup.");
      }
    } catch {
      alert("Error deleting lead.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: LeadEnquiry["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        router.refresh();
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const leadToDelete = leads.find((l) => l.id === deletingId);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-display uppercase font-bold text-brand-navy tracking-tight">
              Customer Leads &amp; Enquiries
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-gray-200">
              {leads.length} total recorded
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-sans leading-relaxed">
            Silent safety backup leads. Customer submissions automatically launch WhatsApp with your sales team, while a copy is preserved here so no lead is ever lost.
          </p>
        </div>

        {/* 1-Click Export to Excel (CSV) */}
        <div className="shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-[#14204A] text-white text-xs font-display uppercase tracking-wider font-bold transition-all duration-200 shadow-2xs hover:shadow-xs border border-transparent hover:border-brand-yellow/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Export currently filtered leads to Microsoft Excel / CSV"
          >
            <Download className="w-4 h-4 text-brand-yellow group-hover:translate-y-0.5 group-hover:scale-110 transition-transform duration-200 stroke-[2.2]" />
            <span>Export to Excel ({filtered.length})</span>
          </button>
        </div>
      </div>

      {/* Timeframe Filter Buttons Strip (Today default, Yesterday, Weekly, Monthly, 3 Months, All Time) */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-display uppercase tracking-wider font-bold text-gray-400 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
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

      {/* Search Bar Card */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${timeframeLabels.find((t) => t.key === timeframe)?.label.toLowerCase()} leads by customer name, phone, district, or roofing service...`}
          className="w-full text-xs sm:text-sm text-brand-navy placeholder:text-gray-400 focus:outline-none bg-transparent font-sans"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-gray-400 hover:text-gray-600 font-semibold p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Leads List: Standalone Cards with Grey Border */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 mx-auto flex items-center justify-center border border-gray-200/80 shadow-2xs">
            <MessageSquare className="w-6 h-6 stroke-[1.8]" />
          </div>
          <p className="text-base font-display uppercase font-bold text-brand-navy">
            {search
              ? "No inquiries match your search"
              : `No customer inquiries recorded for ${timeframeLabels.find((t) => t.key === timeframe)?.label.toLowerCase()}`}
          </p>
          <p className="text-xs text-gray-500 font-sans max-w-sm mx-auto">
            {search
              ? "Try searching with a different name or phone number."
              : "Switch to 'All Time' or another timeframe above to review previous inquiries in the leads "}
          </p>
          {timeframe !== "all" && !search && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setTimeframe("all")}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-[#14204A] text-white text-xs font-display uppercase tracking-wider font-bold transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer border border-transparent hover:border-brand-yellow/30"
              >
                <span>View All Time Records ({counts.all})</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-yellow group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lead) => {
            const dateStr = new Date(lead.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            // Clean clean phone format for tel and whatsapp
            const cleanPhone = lead.phone.replace(/[^\d+]/g, "");
            const waPhone = cleanPhone.startsWith("+")
              ? cleanPhone.replace("+", "")
              : cleanPhone.startsWith("91")
                ? cleanPhone
                : `91${cleanPhone}`;

            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
              >
                {/* Left: Customer Info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-brand-navy font-sans">
                      {lead.name}
                    </span>

                    <span className="text-[11px] font-mono font-bold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md border border-gray-200">
                      {lead.phone}
                    </span>

                    {lead.district && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-display uppercase tracking-wider font-bold text-brand-navy bg-brand-yellow/20 px-2.5 py-0.5 rounded-md border border-gray-200">
                        <MapPin className="w-3 h-3 text-brand-navy" />
                        <span>{lead.district}</span>
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                      {lead.source}
                    </span>
                  </div>

                  {lead.service && (
                    <p className="text-xs font-semibold text-gray-700 font-sans flex items-center gap-1.5">
                      <span className="text-gray-400">Requirement:</span>
                      <span className="text-brand-navy">{lead.service}</span>
                    </p>
                  )}

                  {lead.message && (
                    <p className="text-xs text-gray-600 font-sans leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
                      &ldquo;{lead.message}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-400 font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">ID: {lead.id}</span>
                  </div>
                </div>

                {/* Right Actions: Call, WhatsApp, Status, Delete */}
                <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 w-full lg:w-auto justify-end flex-wrap">
                  {/* Status Dropdown */}
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      handleStatusChange(lead.id, e.target.value as LeadEnquiry["status"])
                    }
                    className="h-9 px-3 rounded-xl text-xs font-display uppercase tracking-wider font-bold border border-gray-200 bg-gray-50 text-brand-navy focus:outline-none focus:border-brand-navy cursor-pointer"
                  >
                    <option value="new">🟡 New Lead</option>
                    <option value="contacted">🔵 Contacted</option>
                    <option value="inspection_scheduled">📅 Inspection Scheduled</option>
                    <option value="completed">✅ Completed</option>
                  </select>

                  {/* 1-Click WhatsApp */}
                  <a
                    href={`https://wa.me/${waPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-display uppercase tracking-wider font-bold transition-all shadow-xs"
                    title="Chat with customer on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {/* 1-Click Call */}
                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-display uppercase tracking-wider font-bold text-gray-700 hover:text-brand-navy hover:bg-gray-50 transition-colors shadow-2xs"
                    title="Call customer directly"
                  >
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    <span className="hidden sm:inline">Call</span>
                  </a>

                  {/* Delete Lead */}
                  <button
                    onClick={() => setDeletingId(lead.id)}
                    className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                    title="Delete lead from backup"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-display uppercase font-bold text-brand-navy">
                  Delete Lead Record?
                </h3>
                <p className="text-xs text-gray-500 font-sans">
                  This will remove the backup record from your admin dashboard.
                </p>
              </div>
            </div>

            {leadToDelete && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-sans space-y-1">
                <p>
                  <strong>Customer:</strong> {leadToDelete.name}
                </p>
                <p>
                  <strong>Phone:</strong> {leadToDelete.phone}
                </p>
                {leadToDelete.service && (
                  <p>
                    <strong>Service:</strong> {leadToDelete.service}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-display uppercase tracking-wider font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-display uppercase tracking-wider font-bold cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

