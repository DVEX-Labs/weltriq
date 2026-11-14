import React from "react";
import { readAllLeads } from "@/lib/leads/db";
import { AdminLeadsList } from "@/components/admin/AdminLeadsList";

export const metadata = {
  title: "Customer Leads Backup | WELTRIQ Admin",
};

export default async function AdminLeadsPage() {
  const leads = await readAllLeads();

  return <AdminLeadsList initialLeads={leads} />;
}

