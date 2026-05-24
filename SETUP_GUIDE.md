# SWAG Wheels Car Rental - Full Setup Guide

## Complete System Overview

This is a full-stack car rental application with:
- **Frontend**: React with TanStack Router, Vite, and Tailwind CSS
- **Backend**: Node.js Express with MongoDB
- **Admin Panel**: Complete dashboard for managing cars, blogs, bookings, and contact queries
- **WhatsApp Integration**: Automatic notifications for bookings and inquiries
- **Authentication**: JWT-based admin authentication

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5005
MONGODB_URI=mongodb://localhost:27017/swag-wheels
JWT_SECRET=your_super_secret_key_here
ADMIN_EMAIL=admin@swagwheels.com
ADMIN_PASSWORD=admin123456
WHATSAPP_PHONE_NUMBER=91YOUR_PHONE_NUMBER
FRONTEND_URL=http://localhost:5173
```

Start MongoDB:
```bash
mongod
```

Start backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5005`

### Frontend Setup

```bash
npm install
```

Create `.env.local`:
```env
VITE_BACKEND_URL=http://localhost:5005
```

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔐 Admin Access

### Default Credentials
- **Email**: `admin@swagwheels.com`
- **Password**: `admin123456`

### Access Admin Panel
1. Navigate to `http://localhost:5173/admin`
2. Login with default credentials
3. Change password in Settings tab

---

## 📊 Admin Panel Features

### Dashboard
- Overview of bookings, revenue, and inquiries
- Quick statistics and metrics
- Real-time data updates

### 🚗 Cars Management
- Add new cars to fleet
- Edit car details (price, features, availability)
- Delete cars
- Toggle availability status
- Car specifications: type, transmission, fuel type, seating

### 📝 Blogs Management
- Create and publish blog posts
- Add categories and tags
- Track views and likes
- Publish/unpublish posts
- SEO-friendly slug generation

### 📅 Bookings Management
- View all bookings with filters
- Update booking status (pending → confirmed → completed)
- Cancel bookings
- Revenue tracking
- Customer details and payment status
- WhatsApp notifications sent automatically

### 💬 Contact Queries Management
- View customer inquiries
- Filter by status (new, read, replied)
- Reply to queries (sent via WhatsApp automatically)
- Delete queries
- Response statistics

### ⚙️ Settings
- Update admin profile
- Change password
- View system information
- Last login tracking

---

## 🔗 API Endpoints

### Admin APIs
```
POST   /api/admin/register              - Register new admin
POST   /api/admin/login                 - Admin login
GET    /api/admin/profile               - Get admin profile (Protected)
PUT    /api/admin/profile               - Update profile (Protected)
PUT    /api/admin/change-password       - Change password (Protected)
```

### Car APIs
```
GET    /api/cars                        - Get all cars
GET    /api/cars/search?query=...       - Search cars
GET    /api/cars/:id                    - Get car details
POST   /api/cars                        - Create car (Admin)
PUT    /api/cars/:id                    - Update car (Admin)
DELETE /api/cars/:id                    - Delete car (Admin)
PATCH  /api/cars/:id/availability       - Toggle availability (Admin)
```

### Blog APIs
```
GET    /api/blogs                       - Get all blogs
GET    /api/blogs/slug/:slug            - Get blog by slug
POST   /api/blogs/:id/like              - Like blog
POST   /api/blogs                       - Create blog (Admin)
PUT    /api/blogs/:id                   - Update blog (Admin)
DELETE /api/blogs/:id                   - Delete blog (Admin)
PATCH  /api/blogs/:id/publish           - Publish/unpublish (Admin)
```

### Booking APIs
```
POST   /api/bookings                    - Create booking (WhatsApp notification sent)
GET    /api/bookings                    - Get all bookings (Admin)
GET    /api/bookings/stats              - Get booking stats (Admin)
GET    /api/bookings/:id                - Get booking (Admin)
PUT    /api/bookings/:id/status         - Update status (Admin)
PUT    /api/bookings/:id/cancel         - Cancel booking (Admin)
```

### Contact APIs
```
POST   /api/contact                     - Create contact query (WhatsApp notification)
GET    /api/contact                     - Get all queries (Admin)
GET    /api/contact/stats               - Get query stats (Admin)
GET    /api/contact/:id                 - Get query (Admin)
PUT    /api/contact/:id/reply           - Reply to query (Admin, sent via WhatsApp)
DELETE /api/contact/:id                 - Delete query (Admin)
```

---

## 📱 WhatsApp Integration

### How It Works

1. **Booking Confirmation**
   - Customer submits booking
   - Automatic WhatsApp message sent to customer with booking details
   - Admin notified via WhatsApp

2. **Contact Query Response**
   - Customer submits contact form
   - Automatic acknowledgment sent via WhatsApp
   - Admin can reply from dashboard
   - Reply sent to customer via WhatsApp

### WhatsApp Message Templates

#### Booking Confirmation
```
Hello [Name]! 🚗

Your booking for [Car Name] has been received!

📅 Pickup: [Date]
📅 Drop: [Date]
💰 Total: ₹[Amount]
📍 Location: [Address]

Status: [Status]

Thank you for choosing SWAG Wheels!
```

#### Contact Query Response
```
Hi [Name]! 👋

We received your message about [Subject].
Our team will respond within 24 hours.

For immediate help: +91 88278 14985

SWAG Wheels
```

### Setup WhatsApp Integration

Option 1: **Manual WhatsApp Links** (Development)
- Uses WhatsApp Web URLs
- Works without API credentials
- Good for testing

Option 2: **Twilio WhatsApp API** (Production)
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

Option 3: **WhatsApp Business API** (Official)
- Requires WhatsApp Business Account
- Professional support
- Higher rate limits

---

## 📁 Project Structure

```
swag-wheels-drive/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   │   ├── Car.ts
│   │   │   ├── Blog.ts
│   │   │   ├── Booking.ts
│   │   │   ├── ContactQuery.ts
│   │   │   └── Admin.ts
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & validation
│   │   ├── config/          # Database config
│   │   ├── utils/           # Utilities (WhatsApp service)
│   │   └── index.ts         # Main server
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── src/
    ├── components/
    │   ├── admin/           # Admin dashboard components
    │   │   ├── AdminLogin.tsx
    │   │   ├── AdminDashboard.tsx
    │   │   ├── CarsManagement.tsx
    │   │   ├── BlogsManagement.tsx
    │   │   ├── BookingsManagement.tsx
    │   │   ├── ContactsManagement.tsx
    │   │   ├── AdminSettings.tsx
    │   │   └── DashboardStats.tsx
    │   └── forms/
    │       ├── BookingFormNew.tsx     # New booking with WhatsApp
    │       └── ContactForm.tsx        # Contact form with WhatsApp
    └── routes/
        └── admin.tsx        # Admin routes
```

---

## 🛠️ Customization

### Change Admin Credentials

1. In backend `.env`:
```env
ADMIN_EMAIL=your_email@yourdomain.com
ADMIN_PASSWORD=secure_password_here
```

2. Or via admin settings dashboard after login

### Add More Car Categories

Edit [backend/src/models/Car.ts](backend/src/models/Car.ts):
```typescript
type: {
  type: String,
  enum: ['sedan', 'suv', 'hatchback', 'truck', 'luxury', 'van', 'sports'],
}
```

### Customize WhatsApp Messages

Edit [backend/src/utils/whatsappService.ts](backend/src/utils/whatsappService.ts) to modify message templates

---

## 🔄 Database Models

### Car
```javascript
{
  name, brand, model, year, price, pricePerDay,
  description, image, images[],
  type, seats, transmission, fuelType,
  features[], availability, rating, reviews,
  location, createdAt, updatedAt
}
```

### Blog
```javascript
{
  title, slug, content, excerpt, author, image,
  category, tags[], published,
  views, likes, createdAt, updatedAt
}
```

### Booking
```javascript
{
  carId, carName, customerName, customerEmail, customerPhone,
  pickupDate, dropDate, pickupLocation, dropLocation,
  totalDays, pricePerDay, totalPrice,
  status, paymentStatus, specialRequests,
  whatsappSent, createdAt, updatedAt
}
```

### ContactQuery
```javascript
{
  name, email, phone, subject, message,
  status, whatsappSent, adminReply,
  createdAt, updatedAt
}
```

### Admin
```javascript
{
  email, password (hashed), name, role,
  isActive, lastLogin, createdAt, updatedAt
}
```

---

## 📊 Statistics & Metrics

### Dashboard Shows:
- **Total Bookings**: Number of all bookings
- **Pending Bookings**: Awaiting confirmation
- **Confirmed Bookings**: Ready for pickup
- **Completed Bookings**: Finished rentals
- **Total Revenue**: From confirmed/paid bookings
- **Response Rate**: % of queries replied to
- **Booking Conversion**: % of bookings confirmed
- **Completion Rate**: % of bookings completed

---

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongod

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API errors
- Check MONGODB_URI in .env
- Ensure backend is running on port 5005
- Check JWT_SECRET is set
- Verify CORS is enabled

### WhatsApp not working
- Verify WHATSAPP_PHONE_NUMBER format (91XXXXXXXXXX)
- Check internet connection
- If using Twilio, verify credentials
- Check backend console logs

### Admin login fails
- Verify admin credentials in .env
- Clear browser localStorage
- Check token expiration
- Restart backend

---

## 📞 Support

- **Phone**: +91 88278 14985
- **Email**: support@swagwheels.com
- **WhatsApp**: Message us directly

---

## 📝 License

SWAG Wheels © 2024. All rights reserved.
