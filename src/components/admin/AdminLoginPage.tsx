import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, AlertCircle, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@swagcarrental.com');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminEmail', data.admin.email);

            window.dispatchEvent(new Event('auth-change'));

            toast.success('Login successful!');
            navigate({ to: '/admin-panel' });
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary mb-5 shadow-[0_4px_20px_oklch(0.58_0.18_155/0.35)]">
                        <Lock className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h1 className="font-display text-3xl font-black tracking-tight">
                        <span className="text-gradient-brand">SWAG</span>{' '}
                        <span className="text-foreground">Admin</span>
                    </h1>
                    <p className="label-display text-muted-foreground mt-2">Management Dashboard</p>
                </div>

                {/* Card */}
                <div className="glass-strong rounded-2xl p-8 mb-6">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="label-display text-foreground/70 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    placeholder="admin@swagwheels.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="panel-input pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="label-display text-foreground/70 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="panel-input pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-neon w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <a href="/" className="label-display text-muted-foreground hover:text-primary transition-colors">
                        ← Back to website
                    </a>
                </div>
            </div>
        </div>
    );
}
