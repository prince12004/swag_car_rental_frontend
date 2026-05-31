import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

export function DashboardStats() {
    const [stats, setStats] = useState<any>({
        bookings: { total: 0, pending: 0, confirmed: 0, completed: 0, revenue: 0 },
        contacts: { total: 0, new: 0, read: 0, replied: 0 },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const [bookingRes, contactRes] = await Promise.all([
                fetch(`${BACKEND_URL}/api/bookings/stats`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
                fetch(`${BACKEND_URL}/api/contact/stats`,  { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
            ]);
            let b = { total: 0, pending: 0, confirmed: 0, completed: 0, revenue: 0 };
            let c = { total: 0, new: 0, read: 0, replied: 0 };
            if (bookingRes?.ok) { const d = await bookingRes.json(); if (d) b = { ...b, ...d }; }
            if (contactRes?.ok)  { const d = await contactRes.json();  if (d) c = { ...c, ...d }; }
            setStats({ bookings: b, contacts: c });
        } catch { /* silently use defaults */ } finally { setLoading(false); }
    };

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Loading stats...</p>
            </div>
        );
    }

    const StatCard = ({ value, label, cls }: { value: any; label: string; cls: string }) => (
        <div className="glass rounded-xl p-5">
            <p className={`text-3xl font-display font-bold ${cls}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bookings */}
                <div>
                    <h2 className="font-display text-lg font-bold text-foreground mb-3">Booking Overview</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard value={stats.bookings.total}     label="Total Bookings" cls="text-primary" />
                        <StatCard value={stats.bookings.pending}   label="Pending"        cls="text-secondary" />
                        <StatCard value={stats.bookings.confirmed} label="Confirmed"      cls="text-primary" />
                        <StatCard value={stats.bookings.completed} label="Completed"      cls="text-muted-foreground" />
                    </div>
                    <div className="glass rounded-xl p-5 mt-3">
                        <p className="text-2xl font-display font-bold text-primary">
                            ₹{stats.bookings.revenue?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Total Revenue (Paid)</p>
                    </div>
                </div>

                {/* Contacts */}
                <div>
                    <h2 className="font-display text-lg font-bold text-foreground mb-3">Contact Queries</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard value={stats.contacts.total}   label="Total Queries" cls="text-primary" />
                        <StatCard value={stats.contacts.new}     label="New"           cls="text-destructive" />
                        <StatCard value={stats.contacts.read}    label="Read"          cls="text-secondary" />
                        <StatCard value={stats.contacts.replied} label="Replied"       cls="text-primary" />
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="glass rounded-xl p-5">
                <h3 className="font-display text-base font-bold text-foreground mb-4">Quick Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border-l-2 border-primary pl-4">
                        <p className="text-xs text-muted-foreground">Response Rate</p>
                        <p className="text-3xl font-display font-bold text-primary mt-1">
                            {stats.contacts.total > 0 ? Math.round((stats.contacts.replied / stats.contacts.total) * 100) : 0}%
                        </p>
                    </div>
                    <div className="border-l-2 border-secondary pl-4">
                        <p className="text-xs text-muted-foreground">Booking Conversion</p>
                        <p className="text-3xl font-display font-bold text-secondary mt-1">
                            {stats.bookings.total > 0 ? Math.round((stats.bookings.confirmed / stats.bookings.total) * 100) : 0}%
                        </p>
                    </div>
                    <div className="border-l-2 border-accent pl-4">
                        <p className="text-xs text-muted-foreground">Completion Rate</p>
                        <p className="text-3xl font-display font-bold text-accent-foreground mt-1">
                            {stats.bookings.total > 0 ? Math.round((stats.bookings.completed / stats.bookings.total) * 100) : 0}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
