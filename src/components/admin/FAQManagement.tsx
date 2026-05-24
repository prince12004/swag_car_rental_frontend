import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Edit2, Trash2, Plus, Check, X } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

interface FAQ {
    _id?: string;
    question: string;
    answer: string;
    display_order: number;
    is_published: boolean;
}

export function FAQManagement() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState<FAQ>({
        question: '',
        answer: '',
        display_order: 0,
        is_published: true,
    });

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BACKEND_URL}/api/faqs/admin/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch FAQs');
            const data = await response.json();
            setFaqs(data);
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

        if (!formData.question.trim() || !formData.answer.trim()) {
            setError('Question and answer are required');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const method = editingId ? 'PATCH' : 'POST';
            const endpoint = editingId ? `/api/faqs/${editingId}` : '/api/faqs';

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
                throw new Error(errData.error || errData.message || `Failed to save FAQ (${response.status})`);
            }

            setSuccess(editingId ? 'FAQ updated successfully' : 'FAQ created successfully');
            setFormData({
                question: '',
                answer: '',
                display_order: 0,
                is_published: true,
            });
            setEditingId(null);
            setShowForm(false);
            await fetchFAQs();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (faq: FAQ) => {
        setFormData(faq);
        setEditingId(faq._id || null);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BACKEND_URL}/api/faqs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || 'Failed to delete FAQ');
            }

            setSuccess('FAQ deleted successfully');
            await fetchFAQs();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            question: '',
            answer: '',
            display_order: 0,
            is_published: true,
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">FAQ Management</h2>
                    <p className="text-sm text-muted-foreground">Manage frequently asked questions</p>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="gap-2 bg-neon hover:bg-neon/90 text-neon-foreground"
                    >
                        <Plus className="h-4 w-4" />
                        Add FAQ
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
                <Alert className="border-neon/50 bg-neon/10">
                    <Check className="h-4 w-4 text-neon" />
                    <AlertDescription className="text-neon">{success}</AlertDescription>
                </Alert>
            )}

            {/* Form */}
            {showForm && (
                <Card className="border-neon/30 bg-surface">
                    <CardHeader>
                        <CardTitle>{editingId ? 'Edit FAQ' : 'Add New FAQ'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-foreground">
                                    Question <span className="text-orange-glow">*</span>
                                </label>
                                <Input
                                    value={formData.question}
                                    onChange={(e) =>
                                        setFormData({ ...formData, question: e.target.value })
                                    }
                                    placeholder="Enter the question"
                                    className="bg-surface-2 border-border text-foreground"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-foreground">
                                    Answer <span className="text-orange-glow">*</span>
                                </label>
                                <Textarea
                                    value={formData.answer}
                                    onChange={(e) =>
                                        setFormData({ ...formData, answer: e.target.value })
                                    }
                                    placeholder="Enter the answer"
                                    rows={5}
                                    className="bg-surface-2 border-border text-foreground"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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

                                <div className="flex items-end">
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
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-neon hover:bg-neon/90 text-neon-foreground"
                                >
                                    {loading ? 'Saving...' : editingId ? 'Update FAQ' : 'Create FAQ'}
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

            {/* FAQs List */}
            <div className="space-y-3">
                {loading && !showForm && <div>Loading FAQs...</div>}
                {faqs.length === 0 && !showForm && (
                    <Card className="border-border/50 bg-surface">
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            No FAQs yet. Create one to get started!
                        </CardContent>
                    </Card>
                )}

                {faqs.map((faq) => (
                    <Card key={faq._id} className="border-border/50 bg-surface">
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground text-lg mb-2">
                                            {faq.question}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            {faq.answer}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                Order: {faq.display_order}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${faq.is_published
                                                    ? 'bg-neon/20 text-neon'
                                                    : 'bg-muted text-muted-foreground'
                                                    }`}
                                            >
                                                {faq.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(faq)}
                                        className="gap-1 border-neon/30 text-neon hover:bg-neon/10"
                                    >
                                        <Edit2 className="h-3 w-3" />
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDelete(faq._id!)}
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
