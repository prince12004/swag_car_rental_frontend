# MongoDB Setup & Admin Panel Configuration

## 🔐 Admin Credentials

**Admin Panel URL:** `http://localhost:5005/admin`

### Login Credentials
```
Email: admin@swag.com
Password: Admin@123456
```

---

## 📱 Application URLs

| Purpose | URL |
|---------|-----|
| Frontend Home | http://localhost:5173 |
| Admin Dashboard | http://localhost:5173/admin |
| API Base | http://localhost:5005 |
| Cars API | http://localhost:5005/api/cars |
| Blogs API | http://localhost:5005/api/blogs |
| Bookings API | http://localhost:5005/api/bookings |
| Contact Queries API | http://localhost:5005/api/contact_queries |
| FAQs API | http://localhost:5005/api/faqs |

---

## 🗄️ MongoDB Connection

```
CONNECTION_URL: mongodb+srv://princekushwahfzd_db_user:8CXhbT5HEvpuPoWc@princecluster.0dtjwgi.mongodb.net/
DATABASE_NAME: swag_wheels_db
```

---

## 📊 MongoDB Collections Structure

### 1. **cars** Collection
Stores all car listings with hide/unhide functionality.

```javascript
{
  "_id": ObjectId,
  "title": "String", // Car name (e.g., "BMW M5")
  "slug": "String", // URL-friendly slug (e.g., "bmw-m5")
  "brand": "String", // Manufacturer (e.g., "BMW")
  "category": "String", // luxury | sports | suv | sedan | budget
  "cover_image": "String", // Image URL
  "images": ["String"], // Array of image URLs
  "description": "String", // Long description
  "price_per_day": Number, // Rental price (e.g., 5005)
  "seats": Number, // Number of seats
  "fuel": "String", // petrol | diesel | electric | hybrid
  "transmission": "String", // manual | automatic
  "rating": Number, // 1-5 stars
  "available": Boolean, // true if available for booking
  "is_published": Boolean, // true if visible on frontend
  "is_featured": Boolean, // true if featured on homepage
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

**Sample Data:**
```javascript
db.cars.insertMany([
  {
    title: "BMW M5 Sedan",
    slug: "bmw-m5-sedan",
    brand: "BMW",
    category: "luxury",
    cover_image: "https://example.com/bmw-m5.jpg",
    images: ["https://example.com/bmw-1.jpg", "https://example.com/bmw-2.jpg"],
    description: "Premium luxury sedan with powerful performance",
    price_per_day: 8000,
    seats: 5,
    fuel: "petrol",
    transmission: "automatic",
    rating: 4.8,
    available: true,
    is_published: true,
    is_featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Audi R8 Sports",
    slug: "audi-r8-sports",
    brand: "Audi",
    category: "sports",
    cover_image: "https://example.com/audi-r8.jpg",
    images: ["https://example.com/audi-1.jpg"],
    description: "High-performance sports car",
    price_per_day: 15005,
    seats: 2,
    fuel: "petrol",
    transmission: "automatic",
    rating: 4.9,
    available: true,
    is_published: true,
    is_featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Mahindra XUV700 SUV",
    slug: "mahindra-xuv700",
    brand: "Mahindra",
    category: "suv",
    cover_image: "https://example.com/xuv700.jpg",
    images: ["https://example.com/xuv-1.jpg"],
    description: "Spacious and comfortable SUV",
    price_per_day: 4000,
    seats: 7,
    fuel: "diesel",
    transmission: "automatic",
    rating: 4.5,
    available: true,
    is_published: true,
    is_featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

---

### 2. **blogs** Collection
Blog posts with publish/unpublish functionality.

```javascript
{
  "_id": ObjectId,
  "title": "String", // Blog title
  "slug": "String", // URL-friendly slug
  "category": "String", // e.g., "Reviews", "Guides", "News"
  "cover_image": "String", // Featured image URL
  "content": "String", // Full blog content (markdown)
  "excerpt": "String", // Short summary
  "author": "String", // Author name
  "is_published": Boolean, // true if visible on frontend
  "published_at": ISODate,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

**Sample Data:**
```javascript
db.blogs.insertMany([
  {
    title: "Ultimate Guide to Car Rental in India",
    slug: "ultimate-guide-car-rental-india",
    category: "Guides",
    cover_image: "https://example.com/guide.jpg",
    content: "# Car Rental Guide\n\nWhen renting a car in India...",
    excerpt: "Everything you need to know about renting luxury cars",
    author: "SWAG Team",
    is_published: true,
    published_at: new Date("2026-05-15"),
    createdAt: new Date("2026-05-15"),
    updatedAt: new Date("2026-05-15")
  },
  {
    title: "Top 5 Supercars for Weekend Getaway",
    slug: "top-5-supercars-weekend",
    category: "Reviews",
    cover_image: "https://example.com/supercars.jpg",
    content: "# Best Supercars\n\n1. BMW M5\n2. Audi R8...",
    excerpt: "Discover the best supercars for your next adventure",
    author: "Car Enthusiast",
    is_published: true,
    published_at: new Date("2026-05-10"),
    createdAt: new Date("2026-05-10"),
    updatedAt: new Date("2026-05-10")
  }
])
```

---

### 3. **bookings** Collection
Customer booking records with status tracking.

```javascript
{
  "_id": ObjectId,
  "customerName": "String",
  "customerEmail": "String",
  "customerPhone": "String",
  "carId": ObjectId, // Reference to cars collection
  "carTitle": "String", // Car name for quick display
  "pickupLocation": "String",
  "dropLocation": "String",
  "pickupDate": ISODate,
  "dropDate": ISODate,
  "status": "String", // pending | confirmed | completed | cancelled
  "totalPrice": Number,
  "message": "String", // Customer message/notes
  "whatsappMessage": "String", // WhatsApp inquiry text
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

**Sample Data:**
```javascript
db.bookings.insertMany([
  {
    customerName: "Raj Kumar",
    customerEmail: "raj@example.com",
    customerPhone: "+91 88278 14985",
    carId: ObjectId("..."),
    carTitle: "BMW M5 Sedan",
    pickupLocation: "Mumbai Airport",
    dropLocation: "Mumbai City Center",
    pickupDate: new Date("2026-06-01"),
    dropDate: new Date("2026-06-03"),
    status: "pending",
    totalPrice: 16000,
    message: "Need for business trip",
    whatsappMessage: "Hi, I need BMW M5 for June 1-3",
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

---

### 4. **contact_queries** Collection
Contact form submissions with WhatsApp integration.

```javascript
{
  "_id": ObjectId,
  "name": "String",
  "email": "String",
  "phone": "String",
  "subject": "String",
  "message": "String",
  "is_read": Boolean, // true if viewed in admin
  "whatsappLink": "String", // Pre-formatted WhatsApp link
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

**Sample Data:**
```javascript
db.contact_queries.insertMany([
  {
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    subject: "Inquiry about wedding fleet",
    message: "Looking for 10 cars for wedding event",
    is_read: false,
    whatsappLink: "https://wa.me/918827814985?text=Hi%20SWAG%20team%2C%20I%20have%20a%20query%20about%20wedding%20fleet",
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

---

### 5. **faqs** Collection
Frequently asked questions.

```javascript
{
  "_id": ObjectId,
  "question": "String",
  "answer": "String", // Can contain markdown
  "category": "String", // e.g., "Booking", "Payment", "Delivery"
  "is_published": Boolean,
  "order": Number, // For sorting
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

**Sample Data:**
```javascript
db.faqs.insertMany([
  {
    question: "What is the minimum age to rent a car?",
    answer: "You must be at least 21 years old with a valid driving license.",
    category: "Booking",
    is_published: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "Do you provide insurance?",
    answer: "Yes, all our cars come with comprehensive insurance included in the rental price.",
    category: "Payment",
    is_published: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "Can you deliver the car to my location?",
    answer: "Yes, we provide delivery to most locations in the city for a small additional fee.",
    category: "Delivery",
    is_published: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

---

### 6. **testimonials** Collection (Optional)
Customer testimonials and reviews.

```javascript
{
  "_id": ObjectId,
  "customerName": "String",
  "customerRole": "String", // e.g., "CEO", "Entrepreneur"
  "message": "String", // Testimonial text
  "rating": Number, // 1-5
  "is_published": Boolean,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

---

## 🎛️ Admin Panel Features

### Dashboard Tab
- Total cars count
- Active bookings count
- Pending contact queries count
- Revenue overview

### Cars Management
- **Add Car:** Create new car listings
- **Edit Car:** Update car details
- **Delete Car:** Remove listings
- **Toggle Publish:** Show/hide cars from frontend
- **Toggle Featured:** Mark as featured on homepage
- Bulk actions available

### Blogs Management
- **Add Blog:** Create new blog posts
- **Edit Blog:** Update blog content
- **Delete Blog:** Remove blogs
- **Toggle Publish:** Control blog visibility
- Markdown editor support

### Bookings Management
- View all customer bookings
- **Update Status:** pending → confirmed → completed
- Filter by status
- Delete bookings

### Contact Queries Management
- View all contact form submissions
- **Mark as Read:** Track viewed queries
- **WhatsApp Integration:** Direct WhatsApp links to customer
- Delete queries

### FAQs Management
- **Add FAQ:** Create new Q&A
- **Edit FAQ:** Update answers
- **Delete FAQ:** Remove FAQs
- **Toggle Publish:** Control visibility
- Order/sort FAQs

---

## 🔗 API Endpoints

### Cars API
```
GET    /api/cars              - Get all cars
POST   /api/cars              - Create car
GET    /api/cars/:id          - Get single car
PATCH  /api/cars/:id          - Update car
DELETE /api/cars/:id          - Delete car
```

### Blogs API
```
GET    /api/blogs             - Get all blogs
POST   /api/blogs             - Create blog
GET    /api/blogs/:id         - Get single blog
PATCH  /api/blogs/:id         - Update blog
DELETE /api/blogs/:id         - Delete blog
```

### Bookings API
```
GET    /api/bookings          - Get all bookings
POST   /api/bookings          - Create booking
PATCH  /api/bookings/:id      - Update booking status
DELETE /api/bookings/:id      - Delete booking
```

### Contact Queries API
```
GET    /api/contact_queries   - Get all queries
POST   /api/contact_queries   - Create query (from contact form)
PATCH  /api/contact_queries/:id - Mark as read
DELETE /api/contact_queries/:id - Delete query
```

### FAQs API
```
GET    /api/faqs              - Get all FAQs
POST   /api/faqs              - Create FAQ
PATCH  /api/faqs/:id          - Update FAQ
DELETE /api/faqs/:id          - Delete FAQ
```

---

## 📱 WhatsApp Integration

**No API calls** - Direct messaging only

When a customer submits a contact query or inquiry:

1. **Pre-formatted WhatsApp Link:**
   ```
   https://wa.me/918827814985?text=Hi%20SWAG%20team%2C%20[message]
   ```

2. **Admin Panel WhatsApp Button:**
   - Shows a "Message on WhatsApp" button for each query
   - Opens WhatsApp chat directly with pre-filled message

3. **Contact Number:** `+91 88278 14985`

---

## 🚀 MongoDB Setup Instructions

### 1. Create Database & Collections
```bash
# Connect to MongoDB
mongo "mongodb+srv://princekushwahfzd_db_user:8CXhbT5HEvpuPoWc@princecluster.0dtjwgi.mongodb.net/swag_wheels_db"

# Create collections with indexes
db.createCollection("cars")
db.createCollection("blogs")
db.createCollection("bookings")
db.createCollection("contact_queries")
db.createCollection("faqs")
db.createCollection("testimonials")

# Create indexes for faster queries
db.cars.createIndex({ "slug": 1, "is_published": 1 })
db.blogs.createIndex({ "slug": 1, "is_published": 1 })
db.bookings.createIndex({ "status": 1, "createdAt": -1 })
db.contact_queries.createIndex({ "is_read": 1, "createdAt": -1 })
db.faqs.createIndex({ "is_published": 1, "order": 1 })
```

### 2. Insert Sample Data
Use the sample data provided above for each collection.

### 3. Create Admin User
```javascript
// Backend: Create admin in your authentication system
db.admins.insertOne({
  email: "admin@swag.com",
  password: "hashed_password_here", // Use bcrypt
  role: "admin",
  createdAt: new Date()
})
```

---

## 🔐 Environment Variables

Add to `.env` in your backend:
```
MONGODB_URI=mongodb+srv://princekushwahfzd_db_user:8CXhbT5HEvpuPoWc@princecluster.0dtjwgi.mongodb.net/swag_wheels_db
DATABASE_NAME=swag_wheels_db
ADMIN_EMAIL=admin@swag.com
ADMIN_PASSWORD=Admin@123456
JWT_SECRET=your_secret_key_here
PORT=5005
```

Add to `.env` in your frontend:
```
VITE_BACKEND_URL=http://localhost:5005
```

---

## ✅ Features Implemented

- ✅ All Supabase removed - MongoDB only
- ✅ Admin dashboard with full CRUD operations
- ✅ Hide/unhide functionality for cars and blogs
- ✅ Contact queries with WhatsApp integration (no API)
- ✅ Direct phone messaging (+91 88278 14985)
- ✅ Booking management with status tracking
- ✅ FAQ management with publish/unpublish
- ✅ No WhatsApp API calls - direct messaging only
- ✅ Mobile-responsive admin panel
- ✅ Real-time data updates

---

## 🛠️ Troubleshooting

### MongoDB Connection Issues
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

### Admin Login Not Working
- Clear browser cache
- Check JWT token in localStorage
- Verify admin credentials in database

### API Endpoints Not Responding
- Check backend server is running on port 5005
- Verify MongoDB connection is active
- Check CORS settings

---

## 📞 Support Contact

**Phone:** +91 88278 14985  
**WhatsApp:** [Direct messaging via app](https://wa.me/918827814985)

---

**Last Updated:** May 21, 2026  
**Version:** 1.0
