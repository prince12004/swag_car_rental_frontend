import { useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, AlertCircle, Eye, EyeOff, Loader2, X, Car as CarIcon, Check, Upload } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

interface Car {
    _id: string;
    name: string;
    brand: string;
    model: string;
    pricePerDay: number;
    type: string;
    availability: boolean;
    seats: number;
    year: number;
    image?: string;
}

const emptyForm = {
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    pricePerDay: 0,
    description: '',
    image: '',
    type: 'sedan',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'petrol',
    features: '',
    horsepower: '',
    color: '',
};

export function CarsManagement() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => { fetchCars(); }, []);

    const fetchCars = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await fetch(`${BACKEND_URL}/api/cars`);
            if (!res.ok) throw new Error(`Failed to fetch cars: ${res.statusText}`);
            const data = await res.json();
            setCars(Array.isArray(data) ? data : (data.cars || []));
        } catch (err: any) {
            setError(err.message || 'Failed to load cars');
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    const openAddForm = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setError('');
        setShowForm(true);
    };

    const openEditForm = (car: Car) => {
        setEditingId(car._id);
        setFormData({
            name: car.name || '',
            brand: car.brand || '',
            model: car.model || '',
            year: car.year || new Date().getFullYear(),
            pricePerDay: car.pricePerDay || 0,
            description: '',
            image: car.image || '',
            type: car.type || 'sedan',
            seats: car.seats || 5,
            transmission: 'automatic',
            fuelType: 'petrol',
            features: '',
            horsepower: '',
            color: '',
        });
        setError('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setError('');
    };

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData(f => ({ ...f, [k]: e.target.value }));

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        setError('');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId
                ? `${BACKEND_URL}/api/cars/${editingId}`
                : `${BACKEND_URL}/api/cars`;

            const features = formData.features
                ? formData.features.split(',').map(f => f.trim()).filter(Boolean)
                : [];

            const payload = {
                name: formData.name,
                brand: formData.brand,
                model: formData.model,
                year: Number(formData.year),
                pricePerDay: Number(formData.pricePerDay),
                price: Number(formData.pricePerDay),
                description: formData.description || `${formData.brand} ${formData.model} — premium rental`,
                image: formData.image || '',
                type: formData.type,
                seats: Number(formData.seats),
                transmission: formData.transmission,
                fuelType: formData.fuelType,
                features,
                ...(formData.horsepower ? { horsepower: Number(formData.horsepower) } : {}),
                ...(formData.color ? { color: formData.color } : {}),
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || errData.error || `Error ${res.status}`);
            }

            setSuccess(editingId ? 'Car updated successfully!' : 'Car added successfully!');
            setTimeout(() => setSuccess(''), 3000);
            closeForm();
            fetchCars();
        } catch (err: any) {
            setError(err.message || 'Failed to save car');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (id: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${BACKEND_URL}/api/cars/${id}/availability`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to toggle visibility');
            setSuccess('Car visibility updated!');
            setTimeout(() => setSuccess(''), 3000);
            fetchCars();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this car? This cannot be undone.')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${BACKEND_URL}/api/cars/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to delete car');
            setSuccess('Car deleted!');
            setTimeout(() => setSuccess(''), 3000);
            fetchCars();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const inputCls = 'w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Car Fleet</h2>
                    <p className="text-muted-foreground text-sm mt-1">Add, edit, hide/show cars</p>
                </div>
                <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Car
                </button>
            </div>

            {/* Alerts */}
            {error && !showForm && (
                <Alert className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert className="border-primary/50 bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-primary">{success}</AlertDescription>
                </Alert>
            )}

            {/* Inline Add/Edit Form */}
            {showForm && (
                <div className="bg-surface border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <CarIcon className="h-5 w-5 text-primary" />
                            {editingId ? 'Edit Car' : 'Add New Car'}
                        </h3>
                        <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-surface-2 text-muted-foreground">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {error && (
                        <Alert className="border-destructive/50 bg-destructive/10 mb-4">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <AlertDescription className="text-destructive">{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Row 1 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Car Name *</label>
                                <input className={inputCls} placeholder="e.g. Fortuner" value={formData.name} onChange={set('name')} required />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Brand *</label>
                                <input className={inputCls} placeholder="e.g. Toyota" value={formData.brand} onChange={set('brand')} required />
                            </div>
                        </div>
                        {/* Row 2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Model *</label>
                                <input className={inputCls} placeholder="e.g. 2024 4x4" value={formData.model} onChange={set('model')} required />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Year</label>
                                <input type="number" className={inputCls} placeholder="2024" value={formData.year} onChange={set('year')} min={1990} max={2030} />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Price Per Day (₹) *</label>
                                <input type="number" className={inputCls} placeholder="2500" value={formData.pricePerDay || ''} onChange={set('pricePerDay')} required min={0} />
                            </div>
                        </div>
                        {/* Row 3 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Car Type *</label>
                                <Select value={formData.type} onValueChange={v => setFormData(f => ({ ...f, type: v }))}>
                                    <SelectTrigger className={inputCls + ' h-9'}>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-surface border-border">
                                        {['sedan', 'suv', 'hatchback', 'sports', 'luxury', 'budget'].map(t => (
                                            <SelectItem key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Transmission</label>
                                <Select value={formData.transmission} onValueChange={v => setFormData(f => ({ ...f, transmission: v }))}>
                                    <SelectTrigger className={inputCls + ' h-9'}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-surface border-border">
                                        <SelectItem value="automatic">Automatic</SelectItem>
                                        <SelectItem value="manual">Manual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Fuel Type</label>
                                <Select value={formData.fuelType} onValueChange={v => setFormData(f => ({ ...f, fuelType: v }))}>
                                    <SelectTrigger className={inputCls + ' h-9'}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-surface border-border">
                                        <SelectItem value="petrol">Petrol</SelectItem>
                                        <SelectItem value="diesel">Diesel</SelectItem>
                                        <SelectItem value="electric">Electric</SelectItem>
                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {/* Row 4 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Seats</label>
                                <input type="number" className={inputCls} placeholder="5" value={formData.seats} onChange={set('seats')} min={1} max={20} />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Horsepower (optional)</label>
                                <input type="number" className={inputCls} placeholder="150" value={formData.horsepower} onChange={set('horsepower')} />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Color (optional)</label>
                                <input className={inputCls} placeholder="e.g. Pearl White" value={formData.color} onChange={set('color')} />
                            </div>
                        </div>
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Car Image</p>
                            {/* Direct label→input — most reliable file picker */}
                            <label className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all select-none ${uploadingImage ? 'opacity-60 cursor-not-allowed border-border' : 'border-border hover:border-primary/60 hover:bg-primary/5'} bg-surface-2`}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingImage}
                                    onChange={handleImageUpload}
                                />
                                {uploadingImage
                                    ? <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
                                    : <Upload className="h-5 w-5 text-primary shrink-0" />
                                }
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {uploadingImage ? 'Uploading image…' : 'Choose car image'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP — max 5 MB</p>
                                </div>
                            </label>
                            {formData.image && (
                                <div className="relative rounded-xl overflow-hidden border border-border">
                                    <img src={formData.image} alt="Car preview" className="w-full h-44 object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                    <button type="button" onClick={() => setFormData(f => ({ ...f, image: '' }))} className="absolute top-2 right-2 h-7 w-7 rounded-full bg-destructive flex items-center justify-center hover:bg-destructive/80 transition-colors">
                                        <X className="h-3.5 w-3.5 text-white" />
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* Description */}
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Description (optional)</label>
                            <Textarea
                                placeholder="Short description of the car..."
                                value={formData.description}
                                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                className="bg-surface-2 border-border text-foreground placeholder:text-muted-foreground text-sm"
                                rows={2}
                            />
                        </div>
                        {/* Features */}
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Features (comma separated, optional)</label>
                            <input className={inputCls} placeholder="AC, Bluetooth, Sunroof, GPS" value={formData.features} onChange={set('features')} />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                {saving ? 'Saving...' : editingId ? 'Update Car' : 'Save Car'}
                            </button>
                            <button type="button" onClick={closeForm} className="px-4 py-2.5 rounded-lg border border-border text-muted-foreground hover:bg-surface-2 text-sm transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Cars List */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-muted-foreground">Loading cars...</span>
                    </div>
                ) : cars.length === 0 ? (
                    <div className="text-center py-16">
                        <CarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No cars added yet</p>
                        <button onClick={openAddForm} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                            Add Your First Car
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-surface-2 border-b border-border">
                                <tr>
                                    {['Car', 'Brand', 'Type', 'Price/Day', 'Seats', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cars.filter(c => c && c._id).map(car => (
                                    <tr key={car._id} className="border-b border-border/40 hover:bg-surface-2 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {car.image ? (
                                                    <img src={car.image} alt={car.name} className="h-10 w-14 object-cover rounded-md border border-border" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                                ) : (
                                                    <div className="h-10 w-14 rounded-md bg-surface-2 border border-border flex items-center justify-center">
                                                        <CarIcon className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <span className="font-medium text-foreground">{car.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{car.brand}</td>
                                        <td className="px-4 py-3 text-muted-foreground capitalize">{car.type}</td>
                                        <td className="px-4 py-3 text-foreground font-medium">₹{car.pricePerDay?.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{car.seats}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${car.availability ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive'}`}>
                                                {car.availability ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                                {car.availability ? 'Visible' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    title={car.availability ? 'Hide car' : 'Show car'}
                                                    onClick={() => handleToggle(car._id)}
                                                    className={`p-1.5 rounded-lg border text-xs transition-colors ${car.availability ? 'border-primary/30 text-primary hover:bg-primary/10' : 'border-destructive/30 text-destructive hover:bg-destructive/10'}`}
                                                >
                                                    {car.availability ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    title="Edit"
                                                    onClick={() => openEditForm(car)}
                                                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-surface-2 transition-colors"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDelete(car._id)}
                                                    className="p-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
