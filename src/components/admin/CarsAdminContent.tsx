import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Edit2, Eye, EyeOff, Car, X, Check, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

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

export default function CarsAdminContent() {
    const qc = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const { data: cars = [], isLoading } = useQuery({
        queryKey: ["admin-cars"],
        queryFn: async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/cars`);
                if (!res.ok) return [];
                const data = await res.json();
                const carsArray = Array.isArray(data) ? data : (data.cars || data.data || []);
                return Array.isArray(carsArray) ? carsArray : [];
            } catch (err) {
                console.error("Error fetching cars:", err);
                return [];
            }
        },
    });

    const openAddForm = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setFormError('');
        setShowForm(true);
    };

    const openEditForm = (car: any) => {
        setEditingId(car._id || car.id);
        setFormData({
            name: car.name || '',
            brand: car.brand || '',
            model: car.model || '',
            year: car.year || new Date().getFullYear(),
            pricePerDay: car.pricePerDay || car.price_per_day || 0,
            description: car.description || '',
            image: car.image || '',
            type: car.type || 'sedan',
            seats: car.seats || 5,
            transmission: car.transmission || 'automatic',
            fuelType: car.fuelType || 'petrol',
            features: Array.isArray(car.features) ? car.features.join(', ') : (car.features || ''),
            horsepower: car.horsepower ? String(car.horsepower) : '',
            color: car.color || '',
        });
        setFormError('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormError('');
    };

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');
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

            toast.success(editingId ? 'Car updated successfully!' : 'Car added successfully!');
            closeForm();
            qc.invalidateQueries({ queryKey: ["admin-cars"] });
        } catch (err: any) {
            setFormError(err.message || 'Failed to save car');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this car? This cannot be undone.")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${BACKEND_URL}/api/cars/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success("Car deleted");
            qc.invalidateQueries({ queryKey: ["admin-cars"] });
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${BACKEND_URL}/api/cars/${id}/availability`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to update');
            toast.success("Visibility updated");
            qc.invalidateQueries({ queryKey: ["admin-cars"] });
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const inputCls = "w-full bg-slate-800/60 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500";

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Cars Management</h2>
                    <p className="text-slate-400">Manage your vehicle fleet</p>
                </div>
                <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/20 font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Add Car
                </button>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="mb-8 bg-gradient-to-br from-slate-900/80 to-slate-800/40 border border-slate-600/50 rounded-xl p-6 backdrop-blur-sm shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Car className="h-5 w-5 text-blue-400" />
                            {editingId ? 'Edit Car' : 'Add New Car'}
                        </h3>
                        <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {formError && (
                        <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-lg bg-red-900/30 border border-red-700/50 text-red-400 text-sm">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Row 1 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Car Name *</label>
                                <input className={inputCls} placeholder="e.g. Fortuner" value={formData.name} onChange={set('name')} required />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Brand *</label>
                                <input className={inputCls} placeholder="e.g. Toyota" value={formData.brand} onChange={set('brand')} required />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Model *</label>
                                <input className={inputCls} placeholder="e.g. 2024 4x4" value={formData.model} onChange={set('model')} required />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Year</label>
                                <input type="number" className={inputCls} placeholder="2024" value={formData.year} onChange={set('year')} min={1990} max={2030} />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Price Per Day (₹) *</label>
                                <input type="number" className={inputCls} placeholder="2500" value={formData.pricePerDay || ''} onChange={set('pricePerDay')} required min={0} />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Car Type *</label>
                                <Select value={formData.type} onValueChange={v => setFormData(f => ({ ...f, type: v }))}>
                                    <SelectTrigger className={inputCls + ' h-9'}>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600">
                                        {['sedan', 'suv', 'hatchback', 'sports', 'luxury', 'budget'].map(t => (
                                            <SelectItem key={t} value={t} className="text-white capitalize focus:bg-slate-700">{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Transmission</label>
                                <Select value={formData.transmission} onValueChange={v => setFormData(f => ({ ...f, transmission: v }))}>
                                    <SelectTrigger className={inputCls + ' h-9'}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600">
                                        <SelectItem value="automatic" className="text-white focus:bg-slate-700">Automatic</SelectItem>
                                        <SelectItem value="manual" className="text-white focus:bg-slate-700">Manual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Fuel Type</label>
                                <Select value={formData.fuelType} onValueChange={v => setFormData(f => ({ ...f, fuelType: v }))}>
                                    <SelectTrigger className={inputCls + ' h-9'}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600">
                                        <SelectItem value="petrol" className="text-white focus:bg-slate-700">Petrol</SelectItem>
                                        <SelectItem value="diesel" className="text-white focus:bg-slate-700">Diesel</SelectItem>
                                        <SelectItem value="electric" className="text-white focus:bg-slate-700">Electric</SelectItem>
                                        <SelectItem value="hybrid" className="text-white focus:bg-slate-700">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Row 4 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Seats</label>
                                <input type="number" className={inputCls} placeholder="5" value={formData.seats} onChange={set('seats')} min={1} max={20} />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Horsepower (optional)</label>
                                <input type="number" className={inputCls} placeholder="150" value={formData.horsepower} onChange={set('horsepower')} />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Color (optional)</label>
                                <input className={inputCls} placeholder="e.g. Pearl White" value={formData.color} onChange={set('color')} />
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Image URL (optional)</label>
                            <input className={inputCls} placeholder="https://... or leave blank for default" value={formData.image} onChange={set('image')} />
                            {formData.image && (
                                <img src={formData.image} alt="preview" className="mt-2 h-24 w-40 object-cover rounded-lg border border-slate-600" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Description (optional)</label>
                            <textarea
                                rows={2}
                                placeholder="Short description of the car..."
                                value={formData.description}
                                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                className={inputCls + ' resize-none'}
                            />
                        </div>

                        {/* Features */}
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Features (comma separated, optional)</label>
                            <input className={inputCls} placeholder="AC, Bluetooth, Sunroof, GPS" value={formData.features} onChange={set('features')} />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-sm disabled:opacity-60 transition-all shadow-lg shadow-blue-600/20"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                {saving ? 'Saving...' : editingId ? 'Update Car' : 'Save Car'}
                            </button>
                            <button
                                type="button"
                                onClick={closeForm}
                                className="px-4 py-2.5 rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-white text-sm transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Cars List */}
            {isLoading ? (
                <div className="text-center py-20">
                    <div className="inline-block mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                    <p className="text-slate-400 font-medium">Loading cars...</p>
                </div>
            ) : cars.length === 0 && !showForm ? (
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-12 text-center backdrop-blur-sm">
                    <div className="inline-block mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Car className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-slate-400 mb-6 font-medium">No cars added yet</p>
                    <button
                        onClick={openAddForm}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/20 font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        Add Your First Car
                    </button>
                </div>
            ) : cars.length > 0 ? (
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden backdrop-blur-sm shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-slate-800 to-slate-700/50 border-b border-slate-700/50">
                                <tr>
                                    <th className="text-left px-6 py-4 font-semibold text-slate-200">Car</th>
                                    <th className="text-left px-6 py-4 font-semibold text-slate-200">Brand</th>
                                    <th className="text-left px-6 py-4 font-semibold text-slate-200">Type</th>
                                    <th className="text-left px-6 py-4 font-semibold text-slate-200">Price/Day</th>
                                    <th className="text-left px-6 py-4 font-semibold text-slate-200">Status</th>
                                    <th className="text-right px-6 py-4 font-semibold text-slate-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {cars.map((car: any) => (
                                    <tr key={car._id || car.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {car.image ? (
                                                    <img src={car.image} alt={car.name} className="h-10 w-14 object-cover rounded-md border border-slate-600" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                                ) : (
                                                    <div className="h-10 w-14 rounded-md bg-slate-700 border border-slate-600 flex items-center justify-center">
                                                        <Car className="h-4 w-4 text-slate-400" />
                                                    </div>
                                                )}
                                                <span className="text-white font-medium">{car.name || car.title || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{car.brand || 'N/A'}</td>
                                        <td className="px-6 py-4 text-slate-300 capitalize">{car.type || 'N/A'}</td>
                                        <td className="px-6 py-4 text-white font-medium">₹{(car.pricePerDay || car.price_per_day || 0).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${car.availability || car.available
                                                ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                                                : 'bg-red-900/30 text-red-400 border border-red-700/50'
                                                }`}>
                                                {car.availability || car.available ? '● Visible' : '● Hidden'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(car._id || car.id, car.availability || car.available)}
                                                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-300 hover:text-white"
                                                    title={car.availability ? 'Hide car' : 'Show car'}
                                                >
                                                    {car.availability || car.available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    onClick={() => openEditForm(car)}
                                                    className="p-2 hover:bg-blue-900/20 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(car._id || car.id)}
                                                    className="p-2 hover:bg-red-900/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
                                                    title="Delete"
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
                </div>
            ) : null}
        </div>
    );
}
