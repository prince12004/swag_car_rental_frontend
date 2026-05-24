# 🚀 Complete Admin Panel Setup Guide

## 📋 Quick Start

### Admin Panel Access
```
URL: http://localhost:5173/admin
Email: admin@swag.com
Password: Admin@123456
```

### Contact Info (for all inquiries)
```
Phone: +91 88278 14985
WhatsApp: https://wa.me/918827814985
```

---

## ✨ All Features Available

### 1. **Dashboard**
Shows real-time stats:
- Total Cars
- Active Bookings
- Pending Queries
- Revenue Overview

### 2. **Cars Management** 🚗
- ✅ Add new cars
- ✅ Edit car details
- ✅ Delete cars
- ✅ Hide/Show cars (toggle `is_published`)
- ✅ Mark as Featured
- ✅ Upload multiple images

**Car Fields:**
- Title, Brand, Category
- Price per day
- Seats, Fuel type, Transmission
- Images, Description
- Rating, Available status

### 3. **Blogs Management** 📝
- ✅ Create blog posts
- ✅ Edit blog content
- ✅ Delete blogs
- ✅ Publish/Unpublish blogs
- ✅ Markdown editor support
- ✅ Featured images

**Blog Fields:**
- Title, Slug, Category
- Cover image, Content
- Author, Excerpt
- Publish status

### 4. **Bookings Management** 📅
- ✅ View all bookings
- ✅ Update booking status (pending → confirmed → completed → cancelled)
- ✅ View customer details
- ✅ Delete bookings
- ✅ Filter by status

**Booking Fields:**
- Customer name, email, phone
- Car details
- Pickup/Drop locations & dates
- Total price, Status, Messages

### 5. **Contact Queries** 💬
- ✅ View all contact form submissions
- ✅ Mark queries as read/unread
- ✅ **Direct WhatsApp integration** (no API)
- ✅ View customer details
- ✅ Delete queries

**WhatsApp Feature:**
- Click "Message on WhatsApp" button
- Opens WhatsApp chat with pre-filled message
- No API required - direct messaging only
- Phone: +91 88278 14985

### 6. **FAQs Management** ❓
- ✅ Add new FAQs
- ✅ Edit FAQ answers
- ✅ Delete FAQs
- ✅ Publish/Unpublish FAQs
- ✅ Reorder FAQs
- ✅ Category management

**FAQ Fields:**
- Question, Answer
- Category, Order
- Publish status

---

## 🗄️ MongoDB Collections

### Database Details
```
Connection: mongodb+srv://princekushwahfzd_db_user:8CXhbT5HEvpuPoWc@princecluster.0dtjwgi.mongodb.net/
Database: swag_wheels_db
```

### Collection Schemas

#### **cars**
```javascript
{
  id: ObjectId,
  title: String,
  slug: String,
  brand: String,
  category: "luxury" | "sports" | "suv" | "sedan" | "budget",
  cover_image: String (URL),
  images: [String] (URLs),
  description: String,
  price_per_day: Number,
  seats: Number,
  fuel: "petrol" | "diesel" | "electric" | "hybrid",
  transmission: "manual" | "automatic",
  rating: Number (1-5),
  available: Boolean,
  is_published: Boolean,
  is_featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### **blogs**
```javascript
{
  id: ObjectId,
  title: String,
  slug: String,
  category: String,
  cover_image: String (URL),
  content: String (Markdown),
  excerpt: String,
  author: String,
  is_published: Boolean,
  published_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### **bookings**
```javascript
{
  id: ObjectId,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  carId: ObjectId,
  carTitle: String,
  pickupLocation: String,
  dropLocation: String,
  pickupDate: Date,
  dropDate: Date,
  status: "pending" | "confirmed" | "completed" | "cancelled",
  totalPrice: Number,
  message: String,
  whatsappMessage: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **contact_queries**
```javascript
{
  id: ObjectId,
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  is_read: Boolean,
  whatsappLink: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **faqs**
```javascript
{
  id: ObjectId,
  question: String,
  answer: String,
  category: String,
  is_published: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 API Endpoints

All endpoints available at `http://localhost:5005`

### Cars
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/cars` | Get all cars |
| POST | `/api/cars` | Create car |
| GET | `/api/cars/:id` | Get single car |
| PATCH | `/api/cars/:id` | Update car |
| DELETE | `/api/cars/:id` | Delete car |

### Blogs
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/blogs` | Get all blogs |
| POST | `/api/blogs` | Create blog |
| GET | `/api/blogs/:id` | Get blog |
| PATCH | `/api/blogs/:id` | Update blog |
| DELETE | `/api/blogs/:id` | Delete blog |

### Bookings
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/bookings` | Get all bookings |
| POST | `/api/bookings` | Create booking |
| PATCH | `/api/bookings/:id` | Update booking |
| DELETE | `/api/bookings/:id` | Delete booking |

### Contact Queries
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/contact_queries` | Get all queries |
| POST | `/api/contact_queries` | Create query |
| PATCH | `/api/contact_queries/:id` | Mark as read |
| DELETE | `/api/contact_queries/:id` | Delete query |

### FAQs
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/faqs` | Get all FAQs |
| POST | `/api/faqs` | Create FAQ |
| PATCH | `/api/faqs/:id` | Update FAQ |
| DELETE | `/api/faqs/:id` | Delete FAQ |

---

## 📱 WhatsApp Integration Details

### No API Calls Required ✅
Instead of using WhatsApp Business API:
- All messages are sent as direct WhatsApp links
- User clicks button → WhatsApp opens automatically
- Message is pre-filled with customer info

### How It Works
1. **Contact Query Received** → Stored in MongoDB
2. **Admin Dashboard Shows Query** with WhatsApp button
3. **Click "Message on WhatsApp"** → Opens WhatsApp chat
4. **Pre-filled Message** includes customer details
5. **Direct conversation** starts with customer

### WhatsApp Link Format
```
https://wa.me/918827814985?text=Customer%20inquiry%20about%20[subject]
```

### Contact Number
- **Phone:** +91 88278 14985
- **WhatsApp:** Same number
- **Pre-filled messages** include customer name, email, inquiry details

---

## 🔧 Setup Instructions

### 1. MongoDB Setup
```bash
# Collections already created in MongoDB
# Use provided connection string
mongodb+srv://princekushwahfzd_db_user:8CXhbT5HEvpuPoWc@princecluster.0dtjwgi.mongodb.net/swag_wheels_db
```

### 2. Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb+srv://princekushwahfzd_db_user:8CXhbT5HEvpuPoWc@princecluster.0dtjwgi.mongodb.net/swag_wheels_db
DATABASE_NAME=swag_wheels_db
PORT=5005
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@swag.com
ADMIN_PASSWORD=Admin@123456
```

**Frontend (.env)**
```
VITE_BACKEND_URL=http://localhost:5005
```

### 3. Start Application
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd .
npm install
npm run dev
```

---

## 🎨 Admin Panel UI Features

### Tab Navigation
- Dashboard (stats overview)
- Cars (CRUD with publish toggle)
- Blogs (CRUD with publish toggle)
- Bookings (status management)
- Queries (WhatsApp integration)
- FAQs (manage Q&A)
- Testimonials (customer reviews)

### Common Actions
- **Add** - Create new items (+ button)
- **Edit** - Update existing items (pencil icon)
- **Delete** - Remove items (trash icon)
- **Publish/Hide** - Toggle visibility (eye icon)
- **WhatsApp** - Send message directly (WhatsApp icon)

### Responsive Design
- Mobile-friendly admin panel
- Touch-optimized buttons
- Responsive tables
- Dark mode support

---

## ✅ What's Changed

### ✨ Completed Migrations
- ✅ Removed all Supabase imports
- ✅ Replaced with MongoDB API calls
- ✅ Updated all routes to use BACKEND_URL
- ✅ Fixed TypeScript errors
- ✅ Added type annotations
- ✅ Removed WhatsApp API calls
- ✅ Added direct WhatsApp links only
- ✅ Updated booking messages (no WhatsApp automation)
- ✅ Admin panel fully functional
- ✅ Hide/unhide for cars and blogs
- ✅ WhatsApp integration for contact queries

### 📁 Updated Files
- `src/routes/admin.tsx` - Full admin panel
- `src/routes/index.tsx` - Homepage with API calls
- `src/routes/blog.tsx` - Blog list with API
- `src/routes/blog.$slug.tsx` - Single blog with API
- `src/routes/cars.tsx` - Cars list with API
- `src/routes/cars.$slug.tsx` - Car details with API
- `src/components/forms/BookingForm.tsx` - API submission
- `src/components/forms/BookingFormNew.tsx` - Updated messages
- `src/components/cars/CarCard.tsx` - Local types
- All other components updated to use BACKEND_URL

---

## 🚀 Next Steps

1. **Login to Admin Panel**
   - URL: http://localhost:5173/admin
   - Email: admin@swag.com
   - Password: Admin@123456

2. **Add Your Data**
   - Add cars with images and details
   - Create blog posts
   - Set up FAQs
   - Publish content

3. **Test Functionality**
   - Visit homepage to see cars/blogs
   - Make bookings
   - Submit contact queries
   - Check WhatsApp integration

4. **Deploy**
   - Deploy backend to production
   - Deploy frontend to Netlify/Vercel
   - Update BACKEND_URL in production env

---

## 📞 Support

**For any issues:**
- Check MongoDB connection
- Verify admin credentials
- Clear browser cache
- Check console for errors
- Verify API endpoints are responding

**Contact:** +91 88278 14985

---

**Status:** ✅ Fully Functional  
**Last Updated:** May 21, 2026  
**Version:** 1.0
