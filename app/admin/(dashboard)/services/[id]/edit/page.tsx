import React from "react";
import { notFound } from "next/navigation";
import { getServiceById, readAllServices } from "@/lib/services/db";
import { AdminServiceForm } from "@/components/admin/AdminServiceForm";

export const metadata = {
  title: "Edit Roofing Service | WELTRIQ Admin",
};

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const service = await getServiceById(id);
  const allServices = await readAllServices();

  if (!service) {
    notFound();
  }

  return <AdminServiceForm initialService={service} isEditing={true} allServices={allServices} />;
}

