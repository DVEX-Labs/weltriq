import { Metadata } from "next";
import { AdminCompanyInfo } from "@/components/admin/AdminCompanyInfo";

export const metadata: Metadata = {
  title: "Company Info & Contact | WELTRIQ Admin Portal",
  description: "Manage live business address, telephone numbers, WhatsApp connected line, and Google Maps location.",
};

export default function AdminCompanyInfoPage() {
  return <AdminCompanyInfo />;
}

