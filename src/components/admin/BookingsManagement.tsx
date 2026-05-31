import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

interface Booking {
    _id: string;
    carName: string;
    customerName: string;
    customerPhone: string;
    pickupDate: string;
    dropDate: string;
    totalPrice: number;
    status: string;
    totalDays: number;
    pricePerDay: number;
}

export function BookingsManagement() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
        fetchStats();
    }, [filter]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('adminToken');
            const url = filter === 'all'
                ? `${BACKEND_URL}/api/bookings`
                : `${BACKEND_URL}/api/bookings?status=${filter}`;

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch bookings: ${response.statusText}`);
            }

            const data = await response.json();
            let bookingsArray = [];
            if (Array.isArray(data)) {
                bookingsArray = data;
            } else if (data && typeof data === 'object') {
                bookingsArray = data.bookings || data.data || data.items || [];
            }

            if (!Array.isArray(bookingsArray)) {
                console.warn('Bookings data is not an array:', bookingsArray, typeof bookingsArray);
                bookingsArray = [];
            }
            setBookings(bookingsArray);
        } catch (err: any) {
            console.error('Error fetching bookings:', err);
            setError(err.message || 'Failed to load bookings');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BACKEND_URL}/api/bookings/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch stats: ${response.statusText}`);
            }

            const data = await response.json();
            setStats(data);
        } catch (err: any) {
            console.error('Error fetching stats:', err);
            // Don't set error for stats, just silently fail
        }
    };

    const updateBookingStatus = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${BACKEND_URL}/api/bookings/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchBookings();
            fetchStats();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleFilterChange = (value: string) => {
        setFilter(value);
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className="bg-white/5 backdrop-blur-md border-border shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total Bookings</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-md border-border shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground mt-1">Pending</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-md border-border shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-primary">{stats.confirmed}</div>
                            <p className="text-xs text-muted-foreground mt-1">Confirmed</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-md border-border shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
                            <p className="text-xs text-muted-foreground mt-1">Completed</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-md border-border shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-emerald-400">₹{stats.revenue?.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">Revenue</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card className="bg-white/5 backdrop-blur-md border-border shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl text-foreground">Bookings</CardTitle>
                            <CardDescription className="text-foreground/70 mt-1">Manage car rental bookings</CardDescription>
                        </div>
                        <Select value={filter} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-[180px] bg-surface-2 border-border text-foreground">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent className="bg-surface-2 border-border">
                                <SelectItem value="all" className="text-foreground">All Bookings</SelectItem>
                                <SelectItem value="pending" className="text-foreground">Pending</SelectItem>
                                <SelectItem value="confirmed" className="text-foreground">Confirmed</SelectItem>
                                <SelectItem value="completed" className="text-foreground">Completed</SelectItem>
                                <SelectItem value="cancelled" className="text-foreground">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
            </Card>

            {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card className="bg-white/5 backdrop-blur-md border-border shadow-lg">
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full border-2 border-primary border-t-cyan-500 animate-spin"></div>
                                <p className="text-foreground/70">Loading bookings...</p>
                            </div>
                        </div>
                    ) : bookings && Array.isArray(bookings) && bookings.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-border">
                            <Table>
                                <TableHeader className="bg-white/5 border-b border-border">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-foreground/70 font-semibold">Customer</TableHead>
                                        <TableHead className="text-foreground/70 font-semibold">Car</TableHead>
                                        <TableHead className="text-foreground/70 font-semibold">Pickup</TableHead>
                                        <TableHead className="text-foreground/70 font-semibold">Drop</TableHead>
                                        <TableHead className="text-foreground/70 font-semibold">Amount</TableHead>
                                        <TableHead className="text-foreground/70 font-semibold">Status</TableHead>
                                        <TableHead className="text-foreground/70 font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.map((booking) => (
                                        <TableRow key={booking._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-foreground">{booking.customerName}</p>
                                                    <p className="text-xs text-muted-foreground">{booking.customerPhone}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-foreground/70">{booking.carName}</TableCell>
                                            <TableCell className="text-foreground/70">{new Date(booking.pickupDate).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-foreground/70">{new Date(booking.dropDate).toLocaleDateString()}</TableCell>
                                            <TableCell className="font-medium text-foreground">₹{booking.totalPrice?.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                                    booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                                        booking.status === 'completed' ? 'bg-primary/20 text-primary border border-primary/30' :
                                                            'bg-red-500/20 text-red-300 border border-red-500/30'
                                                    }`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50"
                                                        >
                                                            Update
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-surface-2 border-border">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-foreground text-lg">Update Booking Status</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-3">
                                                            {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                                                                <Button
                                                                    key={status}
                                                                    variant={booking.status === status ? 'default' : 'outline'}
                                                                    className={`w-full ${booking.status === status ? 'bg-primary' : 'bg-surface-2 border-border text-foreground hover:bg-surface'}`}
                                                                    onClick={() => {
                                                                        updateBookingStatus(booking._id, status);
                                                                    }}
                                                                >
                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-foreground/70 mb-4 text-lg">No bookings found</p>
                            <Button
                                onClick={() => fetchBookings()}
                                className="btn-neon text-foreground border-0"
                            >
                                Refresh
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
