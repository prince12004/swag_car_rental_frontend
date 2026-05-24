import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, AlertCircle, Check, Upload, X, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    published: boolean;
    views: number;
    createdAt: string;
}

export function BlogsManagement() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        author: 'SWAG Wheels Team',
        image: '',
        category: 'travel',
        tags: '',
        published: false,
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            setError('');
            setBlogs([]); // Initialize as empty array immediately
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BACKEND_URL}/api/blogs`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch blogs: ${response.statusText}`);
            }

            const data = await response.json();
            let blogsArray: any[] = [];

            // Safely extract blogs array from various response formats
            if (Array.isArray(data)) {
                blogsArray = data;
            } else if (data && typeof data === 'object' && !Array.isArray(data)) {
                blogsArray = data.blogs || data.data || data.items || [];
            } else if (data === null || data === undefined) {
                blogsArray = [];
            }

            // Final validation: ensure it's always an array
            if (!Array.isArray(blogsArray)) {
                console.warn('Blogs data is not an array, resetting to empty:', { data, blogsArray, dataType: typeof blogsArray });
                blogsArray = [];
            }

            setBlogs(blogsArray);
        } catch (err: any) {
            console.error('Error fetching blogs:', err);
            setError(err.message || 'Failed to load blogs');
            setBlogs([]); // Always reset to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const token = localStorage.getItem('adminToken');
            const fd = new FormData();
            fd.append('image', file);
            const res = await fetch(`${BACKEND_URL}/api/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            if (!res.ok) throw new Error('Upload failed');
            const { url } = await res.json();
            setFormData(f => ({ ...f, image: url }));
        } catch (err: any) {
            setError(err.message || 'Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAddBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `${BACKEND_URL}/api/blogs/${editingId}` : `${BACKEND_URL}/api/blogs`;

            const tags = formData.tags
                ? formData.tags.split(',').map(t => t.trim()).filter(t => t)
                : [];

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    tags,
                }),
            });

            if (response.ok) {
                setSuccess(editingId ? 'Blog updated successfully!' : 'Blog created successfully!');
                setTimeout(() => setSuccess(''), 3000);
                fetchBlogs();
                setFormData({
                    title: '', content: '', excerpt: '', author: 'SWAG Wheels Team',
                    image: '', category: 'travel', tags: '', published: false,
                });
                setEditingId(null);
                setShowDialog(false);
                setError('');
            } else {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || errData.message || `Failed to save blog (${response.status})`);
            }
        } catch (err: any) {
            console.error('Error saving blog:', err);
            setError(err.message || 'Failed to save blog');
        }
    };

    const handleEditBlog = (blog: Blog) => {
        setEditingId(blog._id);
        setFormData({
            title: blog.title || '',
            content: '',
            excerpt: blog.excerpt || '',
            author: 'SWAG Wheels Team',
            image: '',
            category: blog.category || 'travel',
            tags: '',
            published: blog.published || false,
        });
        setShowDialog(true);
        setError('');
    };

    const handleDeleteBlog = async (id: string) => {
        if (window.confirm('Delete this blog?')) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${BACKEND_URL}/api/blogs/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    setSuccess('Blog deleted successfully!');
                    setTimeout(() => setSuccess(''), 3000);
                    fetchBlogs();
                } else {
                    throw new Error('Failed to delete blog');
                }
            } catch (err: any) {
                setError(err.message);
            }
        }
    };

    const handlePublishBlog = async (id: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${BACKEND_URL}/api/blogs/${id}/publish`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                setSuccess('Blog status updated!');
                setTimeout(() => setSuccess(''), 3000);
                fetchBlogs();
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const renderBlogsList = () => {
        // Extra defensive check
        if (!blogs || !Array.isArray(blogs) || blogs.length === 0) {
            return (
                <div className="text-center py-16">
                    <AlertCircle className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-300 mb-4 text-lg">No blogs found</p>
                    <Button
                        onClick={() => fetchBlogs()}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                    >
                        Refresh
                    </Button>
                </div>
            );
        }

        try {
            const blogsList = (blogs as Blog[]).filter(blog => blog && blog._id).map((blog: Blog) => (
                <TableRow key={blog._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white max-w-xs truncate">{blog.title || 'N/A'}</TableCell>
                    <TableCell className="text-slate-300 capitalize">{blog.category || 'N/A'}</TableCell>
                    <TableCell className="text-slate-300">{blog.views?.toLocaleString() || 0}</TableCell>
                    <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${blog.published ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'}`}>
                            {blog.published ? <Check className="h-3 w-3" /> : '○'}
                            {blog.published ? 'Published' : 'Draft'}
                        </span>
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditBlog(blog)}
                            className="bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/50"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => handlePublishBlog(blog._id)}
                            className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50"
                        >
                            {blog.published ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-500/50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TableCell>
                </TableRow>
            ));

            return (
                <div className="overflow-x-auto rounded-lg border border-white/10">
                    <Table>
                        <TableHeader className="bg-white/5 border-b border-white/10">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-slate-300 font-semibold">Title</TableHead>
                                <TableHead className="text-slate-300 font-semibold">Category</TableHead>
                                <TableHead className="text-slate-300 font-semibold">Views</TableHead>
                                <TableHead className="text-slate-300 font-semibold">Status</TableHead>
                                <TableHead className="text-slate-300 font-semibold">Created</TableHead>
                                <TableHead className="text-slate-300 font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogsList}
                        </TableBody>
                    </Table>
                </div>
            );
        } catch (err: any) {
            console.error('Error rendering blogs list:', err);
            return (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Error rendering blogs: {err.message}</AlertDescription>
                </Alert>
            );
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl text-white">Blog Management</CardTitle>
                            <CardDescription className="text-slate-300 mt-1">Create, edit, and manage blog posts</CardDescription>
                        </div>
                        <Dialog open={showDialog} onOpenChange={setShowDialog}>
                            <DialogTrigger asChild>
                                <Button
                                    className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({
                                            title: '', content: '', excerpt: '', author: 'SWAG Wheels Team',
                                            image: '', category: 'travel', tags: '', published: false,
                                        });
                                        setError('');
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                    New Blog
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-white/10">
                                <DialogHeader>
                                    <DialogTitle className="text-white text-xl">{editingId ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddBlog} className="space-y-4">
                                    <Input
                                        placeholder="Blog Title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="bg-slate-700 border-white/10 text-white placeholder:text-slate-400"
                                        required
                                    />

                                    <Input
                                        placeholder="Excerpt (Summary)"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="bg-slate-700 border-white/10 text-white placeholder:text-slate-400"
                                        required
                                    />

                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-300 font-medium">Cover Image</p>
                                        {/* Direct label→input upload — most reliable */}
                                        <label className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all select-none ${uploadingImage ? 'border-blue-400/40 opacity-60 cursor-not-allowed' : 'border-white/20 hover:border-blue-400/70 hover:bg-slate-700'} bg-slate-700/50`}>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                disabled={uploadingImage}
                                                onChange={handleImageUpload}
                                            />
                                            {uploadingImage
                                                ? <Loader2 className="h-5 w-5 text-blue-400 animate-spin shrink-0" />
                                                : <Upload className="h-5 w-5 text-blue-400 shrink-0" />
                                            }
                                            <div>
                                                <p className="text-sm font-semibold text-slate-200">
                                                    {uploadingImage ? 'Uploading…' : 'Choose image file'}
                                                </p>
                                                <p className="text-xs text-slate-500">PNG, JPG, WEBP — max 5 MB</p>
                                            </div>
                                        </label>
                                        {formData.image && (
                                            <div className="relative rounded-xl overflow-hidden border border-white/10">
                                                <img src={formData.image} alt="preview" className="w-full h-44 object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                                <button type="button" onClick={() => setFormData(f => ({ ...f, image: '' }))} className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors">
                                                    <X className="h-3.5 w-3.5 text-white" />
                                                </button>
                                            </div>
                                        )}
                                        <Input
                                            placeholder="Or paste image URL directly"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="bg-slate-700 border-white/10 text-white placeholder:text-slate-500 text-xs"
                                        />
                                    </div>

                                    <Textarea
                                        placeholder="Blog Content"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="min-h-[200px] bg-slate-700 border-white/10 text-white placeholder:text-slate-400"
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                            <SelectTrigger className="bg-slate-700 border-white/10 text-white">
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-700 border-white/10">
                                                <SelectItem value="travel" className="text-slate-900">Travel</SelectItem>
                                                <SelectItem value="tips" className="text-slate-900">Tips</SelectItem>
                                                <SelectItem value="news" className="text-slate-900">News</SelectItem>
                                                <SelectItem value="lifestyle" className="text-slate-900">Lifestyle</SelectItem>
                                                <SelectItem value="other" className="text-slate-900">Other</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            placeholder="Tags (comma separated)"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="bg-slate-700 border-white/10 text-white placeholder:text-slate-400"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0">
                                        {editingId ? 'Update Blog' : 'Create Blog'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
            </Card>

            {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="bg-green-500/10 border-green-500/20 text-green-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-cyan-500 animate-spin"></div>
                                <p className="text-slate-300">Loading blogs...</p>
                            </div>
                        </div>
                    ) : (
                        renderBlogsList()
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
