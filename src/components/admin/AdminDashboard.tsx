import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart3, BookOpen, MessageSquare, Car, Settings, HelpCircle, Award } from 'lucide-react';
import { CarsManagement } from './CarsManagement';
import { BlogsManagement } from './BlogsManagement';
import { BookingsManagement } from './BookingsManagement';
import { ContactsManagement } from './ContactsManagement';
import { AdminSettings } from './AdminSettings';
import { DashboardStats } from './DashboardStats';
import { FAQManagement } from './FAQManagement';
import { TestimonialManagement } from './TestimonialManagement';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'cars', label: 'Cars', icon: <Car className="h-5 w-5" /> },
    { id: 'blogs', label: 'Blogs', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <span className="text-lg">📅</span> },
    { id: 'contacts', label: 'Contacts', icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="h-5 w-5" /> },
    { id: 'testimonials', label: 'Reviews', icon: <Award className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        fetchAdminProfile();
    }, []);

    const fetchAdminProfile = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate({ to: '/admin' });
                return;
            }

            const response = await fetch(`${BACKEND_URL}/api/admin/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setAdmin(data.admin);
            } else {
                navigate({ to: '/admin' });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            navigate({ to: '/admin' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        navigate({ to: '/admin' });
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
                <div className="animate-spin w-8 h-8 border-4 border-neon border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground">Loading Admin Panel...</p>
            </div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Header */}
            <header className="bg-surface border-b border-border sticky top-0 z-40">
                <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-neon via-white to-orange-glow bg-clip-text text-transparent">
                                SWAG Wheels Admin
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-foreground">{admin?.name}</p>
                            <p className="text-xs text-muted-foreground">{admin?.email}</p>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="bg-sidebar border-r border-border w-60 shrink-0">
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                                    }`}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6 space-y-6 max-w-7xl">
                        {activeTab === 'dashboard' && <DashboardStats />}
                        {activeTab === 'cars' && <CarsManagement />}
                        {activeTab === 'blogs' && <BlogsManagement />}
                        {activeTab === 'bookings' && <BookingsManagement />}
                        {activeTab === 'contacts' && <ContactsManagement />}
                        {activeTab === 'faq' && <FAQManagement />}
                        {activeTab === 'testimonials' && <TestimonialManagement />}
                        {activeTab === 'settings' && <AdminSettings admin={admin} onUpdate={fetchAdminProfile} />}
                    </div>
                </main>
            </div>
        </div>
    );
}
