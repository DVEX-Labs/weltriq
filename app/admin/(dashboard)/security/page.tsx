import { Metadata } from "next";
import { AdminSecurity } from "@/components/admin/AdminSecurity";

export const metadata: Metadata = {
  title: "Admin Security & Password | WELTRIQ Admin Portal",
  description: "Change administrator password and manage portal credentials.",
};

export default function AdminSecurityPage() {
  return <AdminSecurity />;
}

