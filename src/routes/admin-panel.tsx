import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
    LogOut, Car, FileText, Calendar, Mail, Settings,
    LayoutDashboard, Menu, X, ChevronRight, HelpCircle, Star
} from "lucide-react";
import { useAuth } from "@/lib/auth";

import DashboardContent from "@/components/admin/DashboardContent";
import CarsAdminContent from "@/components/admin/CarsAdminContent";
import { BlogsManagement as BlogsAdminContent } from "@/components/admin/BlogsManagement";
import { BookingsManagement as BookingsAdminContent } from "@/components/admin/BookingsManagement";
import { ContactsManagement as QueriesAdminContent } from "@/components/admin/ContactsManagement";
import { FAQManagement } from "@/components/admin/FAQManagement";
import { TestimonialManagement } from "@/components/admin/TestimonialManagement";

const SIDEBAR_ITEMS = [
    { id: "dashboard",    label: "Dashboard",       Icon: LayoutDashboard },
    { id: "cars",         label: "Cars",             Icon: Car },
    { id: "blogs",        label: "Blogs",            Icon: FileText },
    { id: "bookings",     label: "Bookings",         Icon: Calendar },
    { id: "queries",      label: "Contact Queries",  Icon: Mail },
    { id: "faq",          label: "FAQ",              Icon: HelpCircle },
    { id: "testimonials", label: "Reviews",          Icon: Star },
    { id: "settings",     label: "Settings",         Icon: Settings },
] as const;

export const Route = createFileRoute("/admin-panel")({
    head: () => ({ meta: [{ title: "Admin Panel — SWAG Wheels" }] }),
    component: AdminPanelPage,
});

function AdminPanelPage() {
    const { isAdmin, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<typeof SIDEBAR_ITEMS[number]["id"]>("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) navigate({ to: "/admin-login" });
    }, [navigate]);

    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem("adminToken");
    if (!isAdmin && !hasToken) return null;

    const activeLabel = SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label ?? "";

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">

            {/* ── Sidebar ── */}
            <aside className={`
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                fixed lg:static inset-y-0 left-0 z-40
                w-64 flex flex-col
                bg-sidebar border-r border-border
                transition-transform duration-300
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary grid place-items-center shadow-[0_2px_8px_oklch(0.58_0.18_155/0.40)]">
                            <Car className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <p className="font-display font-black text-base leading-none text-gradient-brand">SWAG</p>
                            <p className="label-display text-muted-foreground text-[10px] mt-0.5">Admin Hub</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                    {SIDEBAR_ITEMS.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
                            className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                transition-colors duration-150 group text-left
                                ${activeTab === id
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                                }
                            `}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="text-sm font-medium flex-1">{label}</span>
                            {activeTab === id && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
                        </button>
                    ))}
                </nav>

                {/* Sign Out */}
                <div className="p-3 border-t border-border shrink-0">
                    <button
                        onClick={() => { signOut(); navigate({ to: "/admin-login" }); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all duration-150"
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Header */}
                <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent text-muted-foreground transition-colors"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground hidden sm:inline">Admin</span>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
                            <span className="label-display text-primary">{activeLabel}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="glass flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            Online
                        </div>
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="glass px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            View Site
                        </a>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto bg-background">
                    <div className="max-w-7xl mx-auto p-5 lg:p-7">
                        {activeTab === "dashboard"    && <DashboardContent />}
                        {activeTab === "cars"         && <CarsAdminContent />}
                        {activeTab === "blogs"        && <BlogsAdminContent />}
                        {activeTab === "bookings"     && <BookingsAdminContent />}
                        {activeTab === "queries"      && <QueriesAdminContent />}
                        {activeTab === "faq"          && <FAQManagement />}
                        {activeTab === "testimonials" && <TestimonialManagement />}
                        {activeTab === "settings"     && <SettingsPlaceholder />}
                    </div>
                </main>
            </div>
        </div>
    );
}

function SettingsPlaceholder() {
    return (
        <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary" />
                Settings
            </h2>
            <div className="glass-strong rounded-xl p-10 text-center">
                <p className="text-muted-foreground">Settings panel coming soon...</p>
            </div>
        </div>
    );
}
