import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

interface ContactQuery {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
    adminReply?: string;
}

export function ContactsManagement() {
    const [queries, setQueries] = useState<ContactQuery[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('new');
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        fetchQueries();
        fetchStats();
    }, [filter]);

    const fetchQueries = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('adminToken');
            const url = filter === 'all'
                ? `${BACKEND_URL}/api/contact`
                : `${BACKEND_URL}/api/contact?status=${filter}`;

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch queries: ${response.statusText}`);
            }

            const data = await response.json();
            let queriesArray = [];
            if (Array.isArray(data)) {
                queriesArray = data;
            } else if (data && typeof data === 'object') {
                queriesArray = data.queries || data.data || data.items || [];
            }

            if (!Array.isArray(queriesArray)) {
                console.warn('Queries data is not an array:', queriesArray, typeof queriesArray);
                queriesArray = [];
            }
            setQueries(queriesArray);
        } catch (err: any) {
            console.error('Error fetching queries:', err);
            setError(err.message || 'Failed to load queries');
            setQueries([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BACKEND_URL}/api/contact/stats`, {
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

    const handleReply = async (id: string) => {
        if (!replyText.trim()) return;

        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${BACKEND_URL}/api/contact/${id}/reply`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ adminReply: replyText }),
            });
            fetchQueries();
            fetchStats();
            setReplyText('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this query?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await fetch(`${BACKEND_URL}/api/contact/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchQueries();
                fetchStats();
            } catch (err: any) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-white">{stats.total}</div>
                            <p className="text-xs text-slate-400 mt-1">Total Queries</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-red-400">{stats.new}</div>
                            <p className="text-xs text-slate-400 mt-1">New</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-yellow-400">{stats.read}</div>
                            <p className="text-xs text-slate-400 mt-1">Read</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-green-400">{stats.replied}</div>
                            <p className="text-xs text-slate-400 mt-1">Replied</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl text-white">Contact Queries</CardTitle>
                            <CardDescription className="text-slate-300 mt-1">Manage customer inquiries and respond via WhatsApp</CardDescription>
                        </div>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[180px] bg-slate-700 border-white/10 text-white">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-white/10">
                                <SelectItem value="all" className="text-slate-900">All Queries</SelectItem>
                                <SelectItem value="new" className="text-slate-900">New</SelectItem>
                                <SelectItem value="read" className="text-slate-900">Read</SelectItem>
                                <SelectItem value="replied" className="text-slate-900">Replied</SelectItem>
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

            <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-cyan-500 animate-spin"></div>
                                <p className="text-slate-300">Loading queries...</p>
                            </div>
                        </div>
                    ) : queries && Array.isArray(queries) && queries.length > 0 ? (
                        <div className="space-y-4">
                            {queries.map((query) => (
                                <div key={query._id} className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3 hover:bg-white/10 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-white">{query.name}</p>
                                            <p className="text-sm text-slate-400">{query.email} | {query.phone}</p>
                                        </div>
                                        <Badge className={`${query.status === 'replied' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                            query.status === 'read' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                                'bg-red-500/20 text-red-300 border border-red-500/30'
                                            }`}>
                                            {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                                        </Badge>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-slate-200">{query.subject}</p>
                                        <p className="text-sm text-slate-400 mt-2">{query.message}</p>
                                    </div>

                                    {query.adminReply && (
                                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded p-3">
                                            <p className="text-xs font-medium text-cyan-300 mb-1">Your Reply:</p>
                                            <p className="text-sm text-cyan-200">{query.adminReply}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-2 flex-wrap pt-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50"
                                                >
                                                    {query.adminReply ? 'Edit Reply' : 'Reply'}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-slate-800 border-white/10">
                                                <DialogHeader>
                                                    <DialogTitle className="text-white">Reply to {query.name}</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-3">
                                                    <Textarea
                                                        placeholder="Type your reply... (Will be sent via WhatsApp)"
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        className="min-h-[150px] bg-slate-700 border-white/10 text-white placeholder:text-slate-400"
                                                        defaultValue={query.adminReply || ''}
                                                    />
                                                    <Button
                                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                                                        onClick={() => handleReply(query._id)}
                                                    >
                                                        Send via WhatsApp
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Button
                                            size="sm"
                                            onClick={() => handleDelete(query._id)}
                                            className="bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-500/50"
                                        >
                                            Delete
                                        </Button>
                                    </div>

                                    <p className="text-xs text-slate-500 pt-2 border-t border-white/5">
                                        Received: {new Date(query.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <AlertCircle className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-300 mb-4 text-lg">No queries found</p>
                            <Button
                                onClick={() => fetchQueries()}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
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
