import React from "react";
import { readAllServices } from "@/lib/services/db";
import { AdminServiceList } from "@/components/admin/AdminServiceList";

export const metadata = {
  title: "Roofing Services Management | WELTRIQ Admin",
};

export default async function AdminServicesPage() {
  const services = await readAllServices();
  return <AdminServiceList initialServices={services} />;
}

