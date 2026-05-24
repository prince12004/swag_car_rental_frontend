import { useQuery } from "@tanstack/react-query";
import { Car, FileText, Calendar, Mail, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

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

                const carsData = carsRes.ok ? await carsRes.json() : null;
                const blogsData = blogsRes.ok ? await blogsRes.json() : null;
                const bookingsData = bookingsRes.ok ? await bookingsRes.json() : null;
                const queriesData = queriesRes.ok ? await queriesRes.json() : null;

                // Safely extract array data
                const getCarsCount = () => {
                    if (!carsData) return 0;
                    if (Array.isArray(carsData)) return carsData.length;
                    if (carsData.cars && Array.isArray(carsData.cars)) return carsData.cars.length;
                    if (carsData.data && Array.isArray(carsData.data)) return carsData.data.length;
                    return 0;
                };

                const getBlogsCount = () => {
                    if (!blogsData) return 0;
                    if (Array.isArray(blogsData)) return blogsData.length;
                    if (blogsData.blogs && Array.isArray(blogsData.blogs)) return blogsData.blogs.length;
                    if (blogsData.data && Array.isArray(blogsData.data)) return blogsData.data.length;
                    return 0;
                };

                const getBookingsCount = () => {
                    if (!bookingsData) return 0;
                    if (Array.isArray(bookingsData)) return bookingsData.length;
                    if (bookingsData.bookings && Array.isArray(bookingsData.bookings)) return bookingsData.bookings.length;
                    if (bookingsData.data && Array.isArray(bookingsData.data)) return bookingsData.data.length;
                    return 0;
                };

                const getQueriesCount = () => {
                    if (!queriesData) return 0;
                    if (Array.isArray(queriesData)) return queriesData.length;
                    if (queriesData.queries && Array.isArray(queriesData.queries)) return queriesData.queries.length;
                    if (queriesData.data && Array.isArray(queriesData.data)) return queriesData.data.length;
                    return 0;
                };

                return {
                    cars: getCarsCount(),
                    blogs: getBlogsCount(),
                    bookings: getBookingsCount(),
                    queries: getQueriesCount(),
                };
            } catch (err) {
                console.error(err);
                return { cars: 0, blogs: 0, bookings: 0, queries: 0 };
            }
        },
    });

    const statCards = [
        { label: "Total Cars", value: stats?.cars ?? 0, Icon: Car, color: "from-blue-900/40 to-blue-800/20 border-blue-600/30 text-blue-400" },
        { label: "Published Blogs", value: stats?.blogs ?? 0, Icon: FileText, color: "from-green-900/40 to-green-800/20 border-green-600/30 text-green-400" },
        { label: "Bookings", value: stats?.bookings ?? 0, Icon: Calendar, color: "from-purple-900/40 to-purple-800/20 border-purple-600/30 text-purple-400" },
        { label: "Queries", value: stats?.queries ?? 0, Icon: Mail, color: "from-orange-900/40 to-orange-800/20 border-orange-600/30 text-orange-400" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-blue-400" />
                    Dashboard
                </h2>
                <p className="text-slate-400">Overview of your SWAG Wheels management</p>
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="inline-block mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                    <p className="text-slate-400 font-medium">Loading dashboard...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map(({ label, value, Icon, color }, idx) => (
                        <div key={idx} className={`bg-gradient-to-br ${color} border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-slate-300 text-sm mb-3 font-medium">{label}</p>
                                    <p className="text-4xl font-bold text-white">{value}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-800/50">
                                    <Icon className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-600/30 rounded-xl p-6 hover:border-blue-500/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 group">
                        <div className="p-3 rounded-lg bg-blue-500/20 w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
                            <Car className="h-6 w-6 text-blue-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">Manage Cars</h4>
                        <p className="text-sm text-slate-400">Add, edit, or remove vehicles from your fleet</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-600/30 rounded-xl p-6 hover:border-green-500/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 group">
                        <div className="p-3 rounded-lg bg-green-500/20 w-fit mb-4 group-hover:bg-green-500/30 transition-colors">
                            <FileText className="h-6 w-6 text-green-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">Manage Blogs</h4>
                        <p className="text-sm text-slate-400">Create and publish engaging blog posts</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-600/30 rounded-xl p-6 hover:border-purple-500/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 group">
                        <div className="p-3 rounded-lg bg-purple-500/20 w-fit mb-4 group-hover:bg-purple-500/30 transition-colors">
                            <Calendar className="h-6 w-6 text-purple-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">View Bookings</h4>
                        <p className="text-sm text-slate-400">Check and manage all reservations</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
