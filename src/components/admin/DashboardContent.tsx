import { useQuery } from "@tanstack/react-query";
import { Car, FileText, Calendar, Mail, TrendingUp, BarChart3 } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

export default function DashboardContent() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            try {
                const [carsRes, blogsRes, bookingsRes, queriesRes] = await Promise.all([
                    fetch(`${BACKEND_URL}/api/cars`),
                    fetch(`${BACKEND_URL}/api/blogs`),
                    fetch(`${BACKEND_URL}/api/bookings`),
                    fetch(`${BACKEND_URL}/api/contact`),
                ]);
                const carsData    = carsRes.ok    ? await carsRes.json()    : null;
                const blogsData   = blogsRes.ok   ? await blogsRes.json()   : null;
                const bookingsData= bookingsRes.ok ? await bookingsRes.json(): null;
                const queriesData = queriesRes.ok  ? await queriesRes.json() : null;

                const count = (d: any, keys: string[]) => {
                    if (!d) return 0;
                    if (Array.isArray(d)) return d.length;
                    for (const k of keys) if (d[k] && Array.isArray(d[k])) return d[k].length;
                    return 0;
                };
                return {
                    cars:     count(carsData,    ['cars', 'data']),
                    blogs:    count(blogsData,   ['blogs', 'data']),
                    bookings: count(bookingsData, ['bookings', 'data']),
                    queries:  count(queriesData,  ['queries', 'data']),
                };
            } catch {
                return { cars: 0, blogs: 0, bookings: 0, queries: 0 };
            }
        },
    });

    const statCards = [
        { label: "Total Cars",       value: stats?.cars     ?? 0, Icon: Car,      iconCls: "text-primary",           ringCls: "bg-primary/10" },
        { label: "Published Blogs",  value: stats?.blogs    ?? 0, Icon: FileText, iconCls: "text-secondary",         ringCls: "bg-secondary/10" },
        { label: "Bookings",         value: stats?.bookings ?? 0, Icon: Calendar, iconCls: "text-accent-foreground", ringCls: "bg-accent/20" },
        { label: "Contact Queries",  value: stats?.queries  ?? 0, Icon: Mail,     iconCls: "text-orange-glow",       ringCls: "bg-orange-glow/10" },
    ];

    const quickActions = [
        { Icon: Car,      title: "Manage Cars",     desc: "Add, edit, or remove vehicles from your fleet",   iconCls: "text-primary",   ringCls: "bg-primary/10" },
        { Icon: FileText, title: "Manage Blogs",    desc: "Create and publish engaging blog posts",           iconCls: "text-secondary", ringCls: "bg-secondary/10" },
        { Icon: Calendar, title: "View Bookings",   desc: "Check and manage all reservations",                iconCls: "text-primary",   ringCls: "bg-primary/10" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="font-display text-3xl font-bold text-foreground mb-1 flex items-center gap-3">
                    <BarChart3 className="h-7 w-7 text-primary" />
                    Dashboard
                </h2>
                <p className="text-muted-foreground text-sm">Overview of your SWAG Wheels management</p>
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">Loading dashboard...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {statCards.map(({ label, value, Icon, iconCls, ringCls }, i) => (
                        <div key={i} className="glass rounded-xl p-5 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                                <div className={`p-2 rounded-lg ${ringCls}`}>
                                    <Icon className={`h-4 w-4 ${iconCls}`} />
                                </div>
                            </div>
                            <p className="text-4xl font-display font-bold text-foreground">{value}</p>
                        </div>
                    ))}
                </div>
            )}

            <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map(({ Icon, title, desc, iconCls, ringCls }, i) => (
                        <div key={i} className="glass rounded-xl p-5 hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                            <div className={`p-2.5 rounded-lg ${ringCls} w-fit mb-3`}>
                                <Icon className={`h-5 w-5 ${iconCls}`} />
                            </div>
                            <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors text-sm">{title}</h4>
                            <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
