import React from "react";
import { readAllLeads } from "@/lib/leads/db";
import { AdminLeadsAnalytics } from "@/components/admin/AdminLeadsAnalytics";

export const metadata = {
  title: "Leads Analytics & Intelligence | WELTRIQ Admin",
};

export default async function AdminAnalyticsPage() {
  const leads = await readAllLeads();

  return (
    <div className="space-y-6 font-sans">
      <AdminLeadsAnalytics initialLeads={leads} />
    </div>
  );
}

