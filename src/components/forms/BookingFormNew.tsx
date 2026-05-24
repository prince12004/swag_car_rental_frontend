import { useRef, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, MessageCircle } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

interface BookingFormProps {
    carId?: string;
    carName?: string;
    pricePerDay?: number;
}

export function BookingForm({ carId, carName, pricePerDay }: BookingFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [bookingReference, setBookingReference] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        pickupDate: '',
        dropDate: '',
        pickupLocation: '',
        dropLocation: 'Mumbai',
        specialRequests: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            if (!carId || !carName || !pricePerDay) {
                throw new Error('Car information is missing');
            }

            const pickup = new Date(formData.pickupDate);
            const drop = new Date(formData.dropDate);

            if (drop <= pickup) {
                throw new Error('Drop date must be after pickup date');
            }

            const totalDays = Math.ceil(
                (drop.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)
            );
            const totalPrice = totalDays * pricePerDay;

            const response = await fetch(`${BACKEND_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    carId,
                    carName,
                    customerName: formData.customerName,
                    customerEmail: formData.customerEmail,
                    customerPhone: formData.customerPhone,
                    pickupDate: formData.pickupDate,
                    dropDate: formData.dropDate,
                    pickupLocation: formData.pickupLocation,
                    dropLocation: formData.dropLocation,
                    pricePerDay,
                    specialRequests: formData.specialRequests,
                    totalPrice,
                    totalDays,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Booking failed');
            }

            setSuccess(true);
            setBookingReference(data.booking._id);
            setFormData({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                pickupDate: '',
                dropDate: '',
                pickupLocation: '',
                dropLocation: 'Mumbai',
                specialRequests: '',
            });

            // Auto-scroll to success message
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="w-full max-w-md mx-auto border-green-200 bg-green-50">
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                        <div>
                            <h3 className="font-semibold text-lg text-green-900">Booking Confirmed! ✅</h3>
                            <p className="text-sm text-green-700 mt-1">
                                Your booking request has been submitted successfully.
                            </p>
                        </div>

                        <div className="bg-white rounded p-3 space-y-2 text-left">
                            <p className="text-xs text-slate-600">
                                <strong>Booking ID:</strong> {bookingReference}
                            </p>
                            <p className="text-xs text-slate-600">
                                <strong>Car:</strong> {carName}
                            </p>
                            <p className="text-xs text-slate-600">
                                <strong>Customer:</strong> {formData.customerName}
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded p-3 space-y-2">
                            <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                Booking Submitted Successfully!
                            </p>
                            <p className="text-xs text-blue-800">
                                Our team will contact you shortly at {formData.customerPhone} to confirm your booking.
                            </p>
                        </div>

                        <Button
                            onClick={() => {
                                setSuccess(false);
                                window.location.href = '/cars';
                            }}
                            className="w-full"
                        >
                            Back to Fleet
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Book {carName || 'a Car'}</CardTitle>
                <CardDescription>Fill in your details to proceed with booking</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    {/* Customer Details */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name *</label>
                        <Input
                            type="text"
                            placeholder="Your full name"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email *</label>
                            <Input
                                type="email"
                                placeholder="your@email.com"
                                value={formData.customerEmail}
                                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone *</label>
                            <Input
                                type="tel"
                                placeholder="+91 XXXXXX XXXX"
                                value={formData.customerPhone}
                                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pickup Date *</label>
                            <Input
                                type="date"
                                value={formData.pickupDate}
                                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Drop Date *</label>
                            <Input
                                type="date"
                                value={formData.dropDate}
                                onChange={(e) => setFormData({ ...formData, dropDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pickup Location *</label>
                            <Input
                                placeholder="e.g., Mumbai Airport"
                                value={formData.pickupLocation}
                                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Drop Location</label>
                            <Input
                                placeholder="e.g., Mumbai City"
                                value={formData.dropLocation}
                                onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Special Requests */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Special Requests</label>
                        <Textarea
                            placeholder="Any special requirements? (e.g., GPS, Child seat, etc.)"
                            value={formData.specialRequests}
                            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                            className="min-h-[80px]"
                        />
                    </div>

                    {/* Price Summary */}
                    {formData.pickupDate && formData.dropDate && pricePerDay && (
                        <div className="bg-slate-50 rounded p-3 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Days:</span>
                                <span className="font-medium">
                                    {Math.ceil(
                                        (new Date(formData.dropDate).getTime() - new Date(formData.pickupDate).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Rate/Day:</span>
                                <span className="font-medium">₹{pricePerDay}</span>
                            </div>
                            <div className="border-t pt-1 mt-1 flex justify-between">
                                <span className="font-semibold">Total:</span>
                                <span className="font-bold text-lg text-primary">
                                    ₹{
                                        Math.ceil(
                                            (new Date(formData.dropDate).getTime() - new Date(formData.pickupDate).getTime()) /
                                            (1000 * 60 * 60 * 24)
                                        ) * pricePerDay
                                    }
                                </span>
                            </div>
                        </div>
                    )}

                    <Button type="submit" disabled={loading} className="w-full gap-2">
                        {loading ? 'Processing...' : 'Book Now'}
                    </Button>

                    <p className="text-xs text-slate-500 text-center">
                        By booking, you agree to our terms and conditions. Our team will contact you shortly.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
