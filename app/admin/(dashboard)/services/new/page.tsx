import React from "react";
import { readAllServices } from "@/lib/services/db";
import { AdminServiceForm } from "@/components/admin/AdminServiceForm";

export const metadata = {
  title: "Add New Roofing Service | WELTRIQ Admin",
};

export default async function AdminNewServicePage() {
  const allServices = await readAllServices();
  return <AdminServiceForm isEditing={false} allServices={allServices} />;
}

