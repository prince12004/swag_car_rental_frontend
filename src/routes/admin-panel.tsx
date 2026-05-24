import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogOut, Car, FileText, Calendar, Mail, Settings, Home, Menu, X, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

// Import admin components
import AdminLoginPage from "@/components/admin/AdminLoginPage";
import DashboardContent from "@/components/admin/DashboardContent";
import CarsAdminContent from "@/components/admin/CarsAdminContent";
import { BlogsManagement as BlogsAdminContent } from "@/components/admin/BlogsManagement";
import { BookingsManagement as BookingsAdminContent } from "@/components/admin/BookingsManagement";
import { ContactsManagement as QueriesAdminContent } from "@/components/admin/ContactsManagement";

const SIDEBAR_ITEMS = [
    { id: "dashboard", label: "Dashboard", Icon: Home },
    { id: "cars", label: "Cars Management", Icon: Car },
    { id: "blogs", label: "Blogs", Icon: FileText },
    { id: "bookings", label: "Bookings", Icon: Calendar },
    { id: "queries", label: "Contact Queries", Icon: Mail },
    { id: "settings", label: "Settings", Icon: Settings },
] as const;

export const Route = createFileRoute("/admin-panel")({
    head: () => ({ meta: [{ title: "Admin Panel — SWAG Wheels" }] }),
    component: AdminPanelPage,
});

function AdminPanelPage() {
    const { isAdmin, loading, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<typeof SIDEBAR_ITEMS[number]["id"]>("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate({ to: "/admin-login" });
        }
    }, [loading, isAdmin, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="text-center">
                    <div className="mb-6">
                        <div className="inline-block p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                        </div>
                    </div>
                    <p className="text-slate-300 font-medium text-lg">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "w-64" : "w-0 lg:w-64"
                    } bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700/50 transition-all duration-300 overflow-hidden backdrop-blur-lg fixed lg:static h-screen z-30`}
            >
                {/* Sidebar Header */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-700/30 bg-gradient-to-r from-blue-600/5 via-transparent to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg shadow-lg shadow-blue-600/30">
                            <Car className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-white">SWAG</h1>
                            <p className="text-xs text-slate-400 font-medium">Admin Hub</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg lg:hidden transition-colors text-slate-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {SIDEBAR_ITEMS.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => {
                                setActiveTab(id);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${activeTab === id
                                ? "bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-400 border border-blue-600/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                                }`}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="text-sm font-medium flex-1 text-left">{label}</span>
                            {activeTab === id && (
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/30 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent">
                    <button
                        onClick={() => {
                            signOut();
                            navigate({ to: "/admin-login" });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-red-900/20 border border-transparent hover:border-red-700/30 rounded-lg transition-all duration-200 group"
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0 group-hover:text-red-400 transition-colors" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-gradient-to-r from-slate-900/60 via-slate-900/40 to-transparent border-b border-slate-700/30 backdrop-blur-md flex items-center justify-between px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-slate-800/50 rounded-lg lg:hidden transition-colors text-slate-300"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>Dashboard</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-blue-400 font-medium">
                                {SIDEBAR_ITEMS.find(item => item.id === activeTab)?.label}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center gap-2 text-sm text-slate-300">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>Online</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
                    <div className="max-w-7xl mx-auto p-6 lg:p-8">
                        {activeTab === "dashboard" && <DashboardContent />}
                        {activeTab === "cars" && <CarsAdminContent />}
                        {activeTab === "blogs" && <BlogsAdminContent />}
                        {activeTab === "bookings" && <BookingsAdminContent />}
                        {activeTab === "queries" && <QueriesAdminContent />}
                        {activeTab === "settings" && <SettingsContent />}
                    </div>
                </div>
            </main>
        </div>
    );
}

function SettingsContent() {
    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Settings className="h-8 w-8 text-blue-400" />
                Settings
            </h2>
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-900/20 rounded-xl border border-slate-700/30 p-8 backdrop-blur-sm">
                <p className="text-slate-400 text-center py-12">Settings panel coming soon...</p>
            </div>
        </div>
    );
}
