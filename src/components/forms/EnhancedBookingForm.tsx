import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://swag-car-rental-backend.onrender.com';

const LOCATIONS = ['Delhi', 'Gurgaon', 'Noida'];

interface EnhancedBookingFormProps {
    carId?: string;
    carName?: string;
    pricePerDay?: number;
}

export function EnhancedBookingForm({ carId, carName, pricePerDay }: EnhancedBookingFormProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [bookingReference, setBookingReference] = useState('');
    const [selectedStartLocation, setSelectedStartLocation] = useState('Delhi');
    const [selectedEndLocation, setSelectedEndLocation] = useState('Delhi');

    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        pickupDate: '',
        dropDate: '',
        specialRequests: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotalPrice = (): number => {
        if (!formData.pickupDate || !formData.dropDate || !pricePerDay) return 0;
        const pickup = new Date(formData.pickupDate);
        const drop = new Date(formData.dropDate);

        if (drop <= pickup) return 0;

        const totalDays = Math.ceil((drop.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
        return totalDays * pricePerDay;
    };

    const sendWhatsAppMessage = async (bookingId: string) => {
        try {
            const totalPrice = calculateTotalPrice();
            const pickupDate = new Date(formData.pickupDate).toLocaleDateString('en-IN');
            const dropDate = new Date(formData.dropDate).toLocaleDateString('en-IN');

            const message = `
🚗 *SWAG Wheels - Booking Confirmation*

📋 *Booking Details:*
Booking ID: ${bookingId}
Name: ${formData.customerName}
Phone: ${formData.customerPhone}
Address: ${formData.customerAddress}

🚙 *Car Details:*
Car: ${carName || 'Selected Car'}
Price/Day: ₹${pricePerDay?.toLocaleString() || '0'}

📅 *Rental Dates:*
Pickup: ${pickupDate} from ${selectedStartLocation}
Drop-off: ${dropDate} at ${selectedEndLocation}

💰 *Total Amount: ₹${totalPrice.toLocaleString()}*

${formData.specialRequests ? `📝 Special Requests: ${formData.specialRequests}` : ''}

Thank you for booking with SWAG Wheels! 🎉
We will confirm your booking within 1 hour.

Contact: +91-XXXXXXXXXX
Website: www.swagwheels.com
            `.trim();

            // Send to backend to process WhatsApp
            const response = await fetch(`${BACKEND_URL}/api/bookings/send-whatsapp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.customerPhone,
                    message: message,
                    bookingId: bookingId
                })
            });

            if (!response.ok) {
                console.warn('WhatsApp message failed, but booking succeeded');
            }
        } catch (err) {
            console.error('Error sending WhatsApp message:', err);
            // Don't fail the booking if WhatsApp fails
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.customerName.trim()) {
            toast.error('Please enter your name');
            return;
        }

        if (!formData.customerPhone.trim() || formData.customerPhone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }

        if (!formData.customerAddress.trim()) {
            toast.error('Please enter your address');
            return;
        }

        if (!formData.pickupDate) {
            toast.error('Please select pickup date');
            return;
        }

        if (!formData.dropDate) {
            toast.error('Please select drop date');
            return;
        }

        const pickup = new Date(formData.pickupDate);
        const drop = new Date(formData.dropDate);

        if (drop <= pickup) {
            toast.error('Drop date must be after pickup date');
            return;
        }

        setLoading(true);

        try {
            const totalDays = Math.ceil((drop.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
            const totalPrice = totalDays * (pricePerDay || 0);

            const response = await fetch(`${BACKEND_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    carId: carId || null,
                    carName: carName || 'Rental Car',
                    customerName: formData.customerName,
                    customerPhone: formData.customerPhone,
                    customerAddress: formData.customerAddress,
                    pickupDate: formData.pickupDate,
                    dropDate: formData.dropDate,
                    pickupLocation: selectedStartLocation,
                    dropLocation: selectedEndLocation,
                    pricePerDay: pricePerDay || 0,
                    specialRequests: formData.specialRequests || null,
                    totalPrice,
                    totalDays,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Booking failed');
            }

            // Send WhatsApp message
            await sendWhatsAppMessage(data.booking._id);

            setSuccess(true);
            setBookingReference(data.booking._id);
            setFormData({
                customerName: '',
                customerPhone: '',
                customerAddress: '',
                pickupDate: '',
                dropDate: '',
                specialRequests: '',
            });

            toast.success('Booking received! Check WhatsApp for confirmation.');

            setTimeout(() => {
                setSuccess(false);
            }, 6000);
        } catch (err: any) {
            console.error('Error creating booking:', err);
            toast.error(err.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="border-green-500/50 bg-green-500/5">
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 border border-green-500/30">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-green-600">Booking Confirmed!</h3>
                            <p className="text-sm text-slate-600 mt-2">
                                Booking ID: <span className="font-mono font-bold">{bookingReference}</span>
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                                Check your WhatsApp for booking details and confirmation
                            </p>
                        </div>
                        <Button
                            onClick={() => setSuccess(false)}
                            variant="outline"
                            className="w-full"
                        >
                            Book Another Car
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Book Your Car</CardTitle>
                <CardDescription>
                    Fill in your details to complete your booking
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {carName && (
                        <Alert className="bg-blue-50 border-blue-200">
                            <MessageCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800">
                                Booking: <span className="font-bold">{carName}</span> - ₹{pricePerDay?.toLocaleString()}/day
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Personal Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900">Personal Details</h3>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Full Name *</label>
                            <Input
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Mobile Number *</label>
                            <Input
                                name="customerPhone"
                                type="tel"
                                value={formData.customerPhone}
                                onChange={handleInputChange}
                                placeholder="Enter 10 digit mobile number"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Address *</label>
                            <Textarea
                                name="customerAddress"
                                value={formData.customerAddress}
                                onChange={handleInputChange}
                                placeholder="Enter your full address"
                                className="resize-none"
                                rows={3}
                                required
                            />
                        </div>
                    </div>

                    {/* Location Selection */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900">Location Details</h3>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Pickup Location *</label>
                            <Select value={selectedStartLocation} onValueChange={setSelectedStartLocation}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOCATIONS.map(loc => (
                                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Drop Location *</label>
                            <Select value={selectedEndLocation} onValueChange={setSelectedEndLocation}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOCATIONS.map(loc => (
                                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900">Rental Period</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Start Date *</label>
                                <Input
                                    name="pickupDate"
                                    type="date"
                                    value={formData.pickupDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">End Date *</label>
                                <Input
                                    name="dropDate"
                                    type="date"
                                    value={formData.dropDate}
                                    onChange={handleInputChange}
                                    min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                        </div>

                        {calculateTotalPrice() > 0 && (
                            <Alert className="bg-amber-50 border-amber-200">
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                <AlertDescription className="text-amber-800">
                                    <strong>Total: ₹{calculateTotalPrice().toLocaleString()}</strong>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Special Requests */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Special Requests (Optional)</label>
                            <Textarea
                                name="specialRequests"
                                value={formData.specialRequests}
                                onChange={handleInputChange}
                                placeholder="Any special requests? Let us know..."
                                className="resize-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <MessageCircle className="h-4 w-4" />
                                Complete Booking
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-slate-500 text-center">
                        You'll receive WhatsApp confirmation with your booking details
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
