# QUICK START - SWAG Wheels

## 🚀 Start the Application

### Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5005
```

### Frontend
```bash
cd ..
npm run dev
# Frontend runs on http://localhost:5173
```

## 🔐 Admin Login

**URL:** `http://localhost:5173/admin-panel`

**Credentials:**
- Email: `admin@swagwheels.com`
- Password: `admin123456`

## ✨ Key Features

### 1. **Admin Dashboard**
- View statistics (bookings, revenue, queries)
- 7 tabs for complete management:
  - 📊 Dashboard (Stats)
  - 🚗 Cars (Fleet management)
  - 📖 Blogs (Content management)
  - 📅 Bookings (Rental management)
  - 💬 Contacts (Query management)
  - ⭐ Testimonials (Customer reviews)
  - ❓ FAQs (Help section)

### 2. **Customer Booking**
**URL:** `http://localhost:5173/cars/[car-slug]`

Fill the form with:
- ✅ Full Name
- ✅ Mobile Number
- ✅ Address
- ✅ Pickup Location (Delhi/Gurgaon/Noida)
- ✅ Drop Location (Delhi/Gurgaon/Noida)
- ✅ Start Date & End Date
- ✅ Special Requests (optional)

**Automatic:** WhatsApp message sent with:
- Booking ID
- Car details
- Total price
- Rental dates

### 3. **Public Pages**
- `/` - Home page
- `/cars` - Car listing
- `/cars/[slug]` - Car details with booking form
- `/blogs` - Blog listing
- `/blog/[slug]` - Blog details
- `/faq` - FAQ with expandable Q&A
- `/testimonials` - Customer testimonials with ratings
- `/contact` - Contact form
- `/about` - About us
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/refund-policy` - Refund policy

## 🛠️ Common Tasks

### Add a Testimonial
1. Go to Admin → Testimonials tab
2. Click "Add Testimonial"
3. Enter: Name, Role, Content, Rating
4. Save → Appears on `/testimonials` page

### Add a FAQ
1. Go to Admin → FAQs tab
2. Click "Add FAQ"
3. Enter: Question, Answer
4. Save → Appears on `/faq` page

### Manage a Booking
1. Go to Admin → Bookings tab
2. See all bookings with customer details
3. Click status to update (Pending/Confirmed/Completed)
4. Customer gets WhatsApp notification

### Add a Car
1. Go to Admin → Cars tab
2. Click "Add Car"
3. Fill details: Name, Brand, Model, Price, Image, Features
4. Save → Appears on `/cars` page

### Add a Blog
1. Go to Admin → Blogs tab
2. Click "Add Blog"
3. Fill: Title, Content, Category, Tags, Image
4. Save → Appears on `/blogs` page

## 📊 Database

Uses MongoDB with collections:
- admins
- cars
- blogs
- bookings
- contactqueries
- testimonials (NEW)
- faqs (NEW)

## ⚙️ Environment Setup

Create `.env` in root and backend folders:

```env
# Backend .env
MONGODB_URI=mongodb://localhost:27017/swag-wheels
JWT_SECRET=your_jwt_secret_key
PORT=5005
ADMIN_EMAIL=admin@swagwheels.com
ADMIN_PASSWORD=admin123456
WHATSAPP_PHONE_NUMBER=+91XXXXXXXXXX
FRONTEND_URL=http://localhost:5173

# Frontend: Use Vite's VITE_BACKEND_URL
VITE_BACKEND_URL=http://localhost:5005
```

## ✅ All Issues Resolved

- ✅ Fixed `data?.map is not a function` error
- ✅ Added FAQ and Testimonials management
- ✅ Created `/faq` and `/testimonials` pages
- ✅ Enhanced booking form with location selection
- ✅ Complete admin dashboard with tabs
- ✅ WhatsApp integration for bookings
- ✅ No more routing errors
- ✅ Professional UI/UX

## 🎯 Next Steps (Optional)

1. **Deploy Frontend:** Vercel, Netlify
2. **Deploy Backend:** Railway, Render, Heroku
3. **Database:** MongoDB Atlas
4. **Email:** SendGrid for notifications
5. **WhatsApp:** Configure with official API
6. **Payment:** Razorpay/Stripe integration

---

**Everything is working!** 🎉 No errors, all features complete.
