import { LeadEnquiry } from "./types";

export type TimeframeFilter = "today" | "yesterday" | "weekly" | "monthly" | "3months" | "all";

export interface TimeframeCounts {
  today: number;
  yesterday: number;
  weekly: number;
  monthly: number;
  "3months": number;
  all: number;
}

export function getTimeframeBounds() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = startOfToday - 6 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = startOfToday - 29 * 24 * 60 * 60 * 1000;
  const ninetyDaysAgo = startOfToday - 89 * 24 * 60 * 60 * 1000;

  return {
    startOfToday,
    startOfYesterday,
    sevenDaysAgo,
    thirtyDaysAgo,
    ninetyDaysAgo,
  };
}

export function filterLeadsByTimeframe(leads: LeadEnquiry[], timeframe: TimeframeFilter): LeadEnquiry[] {
  const { startOfToday, startOfYesterday, sevenDaysAgo, thirtyDaysAgo, ninetyDaysAgo } =
    getTimeframeBounds();

  return leads.filter((lead) => {
    try {
      const leadTime = new Date(lead.createdAt).getTime();
      switch (timeframe) {
        case "today":
          return leadTime >= startOfToday;
        case "yesterday":
          return leadTime >= startOfYesterday && leadTime < startOfToday;
        case "weekly":
          return leadTime >= sevenDaysAgo;
        case "monthly":
          return leadTime >= thirtyDaysAgo;
        case "3months":
          return leadTime >= ninetyDaysAgo;
        case "all":
        default:
          return true;
      }
    } catch {
      return true;
    }
  });
}

export function getLeadTimeframeCounts(leads: LeadEnquiry[]): TimeframeCounts {
  const { startOfToday, startOfYesterday, sevenDaysAgo, thirtyDaysAgo, ninetyDaysAgo } =
    getTimeframeBounds();

  const counts: TimeframeCounts = {
    today: 0,
    yesterday: 0,
    weekly: 0,
    monthly: 0,
    "3months": 0,
    all: leads.length,
  };

  for (const lead of leads) {
    try {
      const time = new Date(lead.createdAt).getTime();
      if (time >= startOfToday) {
        counts.today++;
      } else if (time >= startOfYesterday && time < startOfToday) {
        counts.yesterday++;
      }
      if (time >= sevenDaysAgo) {
        counts.weekly++;
      }
      if (time >= thirtyDaysAgo) {
        counts.monthly++;
      }
      if (time >= ninetyDaysAgo) {
        counts["3months"]++;
      }
    } catch {
      // ignore invalid dates
    }
  }

  return counts;
}

export function exportLeadsToCSV(leads: LeadEnquiry[], timeframe: string) {
  if (leads.length === 0) {
    alert("No leads found for this filter to export.");
    return;
  }

  const headers = [
    "Date & Time",
    "Customer Name",
    "Phone Number",
    "District",
    "Requested Service",
    "Status",
    "Source",
    "Customer Message / Notes",
  ];

  const rows = leads.map((l) => [
    `"${new Date(l.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }).replace(/"/g, '""')}"`,
    `"${(l.name || "").replace(/"/g, '""')}"`,
    `"${(l.phone || "").replace(/"/g, '""')}"`,
    `"${(l.district || "Kerala").replace(/"/g, '""')}"`,
    `"${(l.service || "Roofing Consultation").replace(/"/g, '""')}"`,
    `"${(l.status || "new").replace(/"/g, '""')}"`,
    `"${(l.source || "Contact Form").replace(/"/g, '""')}"`,
    `"${(l.message || "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`,
  ]);

  // Prepend UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  link.setAttribute("href", url);
  link.setAttribute("download", `weltriq-leads-${timeframe}-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

