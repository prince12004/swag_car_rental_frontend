import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import AdminLoginPage from "@/components/admin/AdminLoginPage";
import { useEffect } from "react";

export const Route = createFileRoute("/admin-login")({
    head: () => ({ meta: [{ title: "Admin Login — SWAG Wheels" }] }),
    component: AdminLoginComponent,
});

function AdminLoginComponent() {
    const { isAdmin, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAdmin) {
            navigate({ to: "/admin-panel" });
        }
    }, [loading, isAdmin, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-slate-950">
                <div className="text-center">
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    return <AdminLoginPage />;
}
