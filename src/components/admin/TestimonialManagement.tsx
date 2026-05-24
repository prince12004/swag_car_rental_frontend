import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Edit2, Trash2, Plus, Check, Star } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

interface Testimonial {
    _id?: string;
    customer_name: string;
    role?: string;
    content: string;
    rating: number;
    display_order: number;
    is_published: boolean;
}

export function TestimonialManagement() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState<Testimonial>({
        customer_name: '',
        role: '',
        content: '',
        rating: 5,
        display_order: 0,
        is_published: true,
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BACKEND_URL}/api/testimonials/admin/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch testimonials');
            const data = await response.json();
            setTestimonials(data);
            setError('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.customer_name.trim() || !formData.content.trim()) {
            setError('Customer name and review content are required');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const method = editingId ? 'PATCH' : 'POST';
            const endpoint = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';

            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to save review (${response.status})`);
            }

            setSuccess(editingId ? 'Review updated successfully' : 'Review created successfully');
            setFormData({
                customer_name: '',
                role: '',
                content: '',
                rating: 5,
                display_order: 0,
                is_published: true,
            });
            setEditingId(null);
            setShowForm(false);
            await fetchTestimonials();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setFormData(testimonial);
        setEditingId(testimonial._id || null);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BACKEND_URL}/api/testimonials/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || 'Failed to delete review');
            }

            setSuccess('Review deleted successfully');
            await fetchTestimonials();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            customer_name: '',
            role: '',
            content: '',
            rating: 5,
            display_order: 0,
            is_published: true,
        });
        setEditingId(null);
        setShowForm(false);
    };

    const StarRating = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`transition-colors ${star <= value ? 'text-orange-glow' : 'text-muted'
                            }`}
                    >
                        <Star className="h-5 w-5 fill-current" />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Reviews & Testimonials</h2>
                    <p className="text-sm text-muted-foreground">Manage customer reviews and testimonials</p>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="gap-2 bg-orange-glow hover:bg-orange-glow/90 text-foreground"
                    >
                        <Plus className="h-4 w-4" />
                        Add Review
                    </Button>
                )}
            </div>

            {/* Alerts */}
            {error && (
                <Alert className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert className="border-orange-glow/50 bg-orange-glow/10">
                    <Check className="h-4 w-4 text-orange-glow" />
                    <AlertDescription className="text-orange-glow">{success}</AlertDescription>
                </Alert>
            )}

            {/* Form */}
            {showForm && (
                <Card className="border-orange-glow/30 bg-surface">
                    <CardHeader>
                        <CardTitle>{editingId ? 'Edit Review' : 'Add New Review'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground">
                                        Customer Name <span className="text-orange-glow">*</span>
                                    </label>
                                    <Input
                                        value={formData.customer_name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, customer_name: e.target.value })
                                        }
                                        placeholder="Customer name"
                                        className="bg-surface-2 border-border text-foreground"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground">
                                        Role / Title
                                    </label>
                                    <Input
                                        value={formData.role || ''}
                                        onChange={(e) =>
                                            setFormData({ ...formData, role: e.target.value })
                                        }
                                        placeholder="E.g., Business Owner, Tourist"
                                        className="bg-surface-2 border-border text-foreground"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-foreground">
                                    Review Content <span className="text-orange-glow">*</span>
                                </label>
                                <Textarea
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({ ...formData, content: e.target.value })
                                    }
                                    placeholder="Customer review or testimonial"
                                    rows={4}
                                    className="bg-surface-2 border-border text-foreground"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-3 text-foreground">
                                        Rating (out of 5)
                                    </label>
                                    <StarRating
                                        value={formData.rating}
                                        onChange={(val) =>
                                            setFormData({ ...formData, rating: val })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground">
                                        Display Order
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.display_order}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                display_order: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        className="bg-surface-2 border-border text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_published}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                is_published: e.target.checked,
                                            })
                                        }
                                        className="rounded border-border"
                                    />
                                    <span className="text-sm font-medium text-foreground">
                                        Published
                                    </span>
                                </label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-orange-glow hover:bg-orange-glow/90 text-foreground"
                                >
                                    {loading ? 'Saving...' : editingId ? 'Update Review' : 'Create Review'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="border-border"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Testimonials List */}
            <div className="space-y-3">
                {loading && !showForm && <div>Loading reviews...</div>}
                {testimonials.length === 0 && !showForm && (
                    <Card className="border-border/50 bg-surface">
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            No reviews yet. Add one to get started!
                        </CardContent>
                    </Card>
                )}

                {testimonials.map((testimonial) => (
                    <Card key={testimonial._id} className="border-border/50 bg-surface">
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground mb-1">
                                            {testimonial.customer_name}
                                        </h3>
                                        {testimonial.role && (
                                            <p className="text-xs text-muted-foreground mb-2">
                                                {testimonial.role}
                                            </p>
                                        )}

                                        <div className="flex gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-3 w-3 ${star <= testimonial.rating
                                                        ? 'fill-orange-glow text-orange-glow'
                                                        : 'text-muted'
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-muted-foreground text-sm mb-3">
                                            {testimonial.content}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                Order: {testimonial.display_order}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${testimonial.is_published
                                                    ? 'bg-orange-glow/20 text-orange-glow'
                                                    : 'bg-muted text-muted-foreground'
                                                    }`}
                                            >
                                                {testimonial.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(testimonial)}
                                        className="gap-1 border-orange-glow/30 text-orange-glow hover:bg-orange-glow/10"
                                    >
                                        <Edit2 className="h-3 w-3" />
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDelete(testimonial._id!)}
                                        className="gap-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
