import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

export function DashboardStats() {
    const [stats, setStats] = useState<any>({
        bookings: {
            total: 0,
            pending: 0,
            confirmed: 0,
            completed: 0,
            revenue: 0,
        },
        contacts: {
            total: 0,
            new: 0,
            read: 0,
            replied: 0,
        },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');

            const [bookingRes, contactRes] = await Promise.all([
                fetch(`${BACKEND_URL}/api/bookings/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                }).catch(() => null),
                fetch(`${BACKEND_URL}/api/contact/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                }).catch(() => null),
            ]);

            // Initialize default stats structure
            let bookingData = {
                total: 0,
                pending: 0,
                confirmed: 0,
                completed: 0,
                revenue: 0,
            };
            let contactData = {
                total: 0,
                new: 0,
                read: 0,
                replied: 0,
            };

            // Parse booking stats if response is ok
            if (bookingRes?.ok) {
                const data = await bookingRes.json();
                if (data && typeof data === 'object') {
                    bookingData = { ...bookingData, ...data };
                }
            }

            // Parse contact stats if response is ok
            if (contactRes?.ok) {
                const data = await contactRes.json();
                if (data && typeof data === 'object') {
                    contactData = { ...contactData, ...data };
                }
            }

            setStats({
                bookings: bookingData,
                contacts: contactData,
            });
        } catch (err: any) {
            console.error('Error fetching dashboard stats:', err);
            // Set default stats on error instead of showing error
            setStats({
                bookings: {
                    total: 0,
                    pending: 0,
                    confirmed: 0,
                    completed: 0,
                    revenue: 0,
                },
                contacts: {
                    total: 0,
                    new: 0,
                    read: 0,
                    replied: 0,
                },
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-cyan-500 animate-spin"></div>
                    <p className="text-slate-300">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bookings Section */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Booking Overview</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold text-blue-400">{stats?.bookings?.total || 0}</div>
                                <p className="text-sm text-slate-400 mt-2">Total Bookings</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold text-yellow-400">{stats?.bookings?.pending || 0}</div>
                                <p className="text-sm text-slate-400 mt-2">Pending</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold text-green-400">{stats?.bookings?.confirmed || 0}</div>
                                <p className="text-sm text-slate-400 mt-2">Confirmed</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold text-cyan-400">{stats?.bookings?.completed || 0}</div>
                                <p className="text-sm text-slate-400 mt-2">Completed</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-4 bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-emerald-400">₹{stats?.bookings?.revenue?.toLocaleString() || 0}</div>
                            <p className="text-sm text-slate-400 mt-2">Total Revenue (Paid)</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Queries Section */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Contact Queries Overview</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold text-blue-400">{stats?.contacts?.total || 0}</div>
                                <p className="text-sm text-slate-400 mt-2">Total Queries</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold text-red-400">{stats?.contacts?.new || 0}</div>
                                <p className="text-sm text-slate-400 mt-2">New Queries</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold text-yellow-400">{stats?.contacts?.read || 0}</div>
                                <p className="text-sm text-slate-400 mt-2">Read</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold text-green-400">{stats?.contacts?.replied || 0}</div>
                                <p className="text-sm text-slate-400 mt-2">Replied</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">Quick Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <p className="text-sm text-slate-400">Response Rate</p>
                            <p className="text-3xl font-bold mt-2 text-blue-300">
                                {stats?.contacts?.total > 0
                                    ? Math.round((stats.contacts.replied / stats.contacts.total) * 100)
                                    : 0}%
                            </p>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                            <p className="text-sm text-slate-400">Booking Conversion</p>
                            <p className="text-3xl font-bold mt-2 text-green-300">
                                {stats?.bookings?.total > 0
                                    ? Math.round((stats.bookings.confirmed / stats.bookings.total) * 100)
                                    : 0}%
                            </p>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                            <p className="text-sm text-slate-400">Completion Rate</p>
                            <p className="text-3xl font-bold mt-2 text-purple-300">
                                {stats?.bookings?.total > 0
                                    ? Math.round((stats.bookings.completed / stats.bookings.total) * 100)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
