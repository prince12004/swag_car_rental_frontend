import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — SWAG Wheels" }] }),
  component: AdminPage,
});

function AdminPage() {
  return <AdminDashboard />;
}
