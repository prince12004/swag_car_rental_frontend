import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, AlertCircle, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@swagwheels.com');
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

            // Dispatch custom event to notify auth context
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center h-14 w-14 bg-blue-600 rounded-lg mb-4">
                        <Lock className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Swag Car Rental Admin</h1>
                    <p className="text-slate-400">Management Dashboard</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-8 mb-6">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="admin@swagwheels.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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

                {/* Demo Credentials Info */}
                {/* <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-300 mb-2">Demo Credentials</p>
                    <div className="text-xs text-slate-400 space-y-1">
                        <p><span className="text-slate-300">Email:</span> admin@swagwheels.com</p>
                        <p><span className="text-slate-300">Password:</span> admin123456</p>
                    </div>
                </div> */}

                {/* Back Link */}
                <div className="text-center mt-6">
                    <a href="/" className="text-sm text-slate-400 hover:text-blue-400 transition">
                        ← Back to website
                    </a>
                </div>
            </div>
        </div>
    );
}
