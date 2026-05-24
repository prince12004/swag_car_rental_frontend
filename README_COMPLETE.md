# 🚗 SWAG Wheels - Car Rental Management System

A complete, production-ready car rental platform with admin dashboard, WhatsApp integration, and MongoDB backend.

## ✨ Features

### 🎯 Core Features
- 🔐 **Admin Authentication**: Secure JWT-based login
- 🚗 **Fleet Management**: Add, edit, delete cars with full details
- 📝 **Blog Management**: Publish blog posts with categories and tags
- 📅 **Booking System**: Customer bookings with automatic confirmation
- 💬 **Contact Queries**: Customer inquiries with response tracking
- 📊 **Dashboard**: Real-time statistics and metrics
- 📱 **WhatsApp Integration**: Automatic notifications for bookings and queries

### 🔧 Technical Stack
- **Frontend**: React + TanStack Router + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + MongoDB + JWT
- **Admin Panel**: Full-featured dashboard with CRUD operations
- **Integration**: WhatsApp Business API (manual wa.me links or Twilio)

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- npm or bun

### Step 1: Clone & Install
```bash
# Frontend dependencies
npm install

# Backend dependencies  
cd backend
npm install
cd ..
```

### Step 2: Configure Environment
```bash
# Backend configuration
cd backend
cp .env.example .env
# Edit .env with your settings
cd ..

# Frontend configuration
cp .env.local.example .env.local
# (Usually needs no changes for local development)
```

### Step 3: Start MongoDB
```bash
# Local MongoDB
mongod

# OR use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env
```

### Step 4: Run Services
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

### Step 5: Access the Application
- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **API**: http://localhost:5005/api

### Step 6: Login to Admin
- **Email**: admin@swagwheels.com (or from .env)
- **Password**: admin123456 (or from .env)

---

## 📋 Admin Panel Features

### Dashboard
- View booking statistics
- Track revenue
- Monitor contact queries
- Response rate metrics

### 🚗 Cars Management
- Add cars with full specifications
- Edit car details and pricing
- Toggle availability status
- Manage fleet inventory

### 📝 Blogs Management
- Create blog posts
- Publish/unpublish posts
- Manage categories and tags
- Track views and likes

### 📅 Bookings
- View all bookings
- Update booking status
- Cancel bookings
- Track customer details
- Monitor payment status

### 💬 Contact Queries
- View customer inquiries
- Reply to queries (via WhatsApp)
- Track response status
- Delete old queries

### ⚙️ Settings
- Update admin profile
- Change password
- View account information

---

## 🔗 API Endpoints

### Public Endpoints
```
GET    /api/cars                    - Get all cars
GET    /api/cars/search             - Search cars
GET    /api/cars/:id                - Get car details
GET    /api/blogs                   - Get all blogs
GET    /api/blogs/slug/:slug        - Get blog by slug
POST   /api/bookings                - Create booking
POST   /api/contact                 - Submit contact form
```

### Protected Endpoints (Admin)
```
POST   /api/admin/login             - Admin login
GET    /api/admin/profile           - Get profile
PUT    /api/admin/profile           - Update profile
PUT    /api/admin/change-password   - Change password

POST   /api/cars                    - Create car
PUT    /api/cars/:id                - Update car
DELETE /api/cars/:id                - Delete car
PATCH  /api/cars/:id/availability   - Toggle availability

POST   /api/blogs                   - Create blog
PUT    /api/blogs/:id               - Update blog
DELETE /api/blogs/:id               - Delete blog
PATCH  /api/blogs/:id/publish       - Publish/unpublish

GET    /api/bookings                - Get all bookings
PUT    /api/bookings/:id/status     - Update status
PUT    /api/bookings/:id/cancel     - Cancel booking

GET    /api/contact                 - Get all queries
PUT    /api/contact/:id/reply       - Reply to query
DELETE /api/contact/:id             - Delete query
```

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed documentation.

---

## 📱 WhatsApp Integration

### Automatic Notifications
- ✅ Booking confirmation sent to customer
- ✅ Admin notified of new bookings
- ✅ Contact query acknowledgment
- ✅ Reply sent to customer via WhatsApp

### Setup Options

#### Option 1: Manual (Development)
- Uses WhatsApp Web URL format
- No API credentials needed
- Good for testing

#### Option 2: Twilio (Recommended)
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

#### Option 3: WhatsApp Business API
- Official WhatsApp integration
- Requires business account
- Best for production

---

## 📊 Database Models

### Car
```javascript
{
  name, brand, model, year, price, pricePerDay,
  description, image, type, seats, transmission,
  fuelType, features[], availability, rating,
  location, createdAt, updatedAt
}
```

### Blog
```javascript
{
  title, slug, content, excerpt, author, image,
  category, tags[], published, views, likes,
  createdAt, updatedAt
}
```

### Booking
```javascript
{
  carId, carName, customerName, customerEmail,
  customerPhone, pickupDate, dropDate,
  pickupLocation, dropLocation, totalDays,
  pricePerDay, totalPrice, status, paymentStatus,
  specialRequests, whatsappSent, createdAt, updatedAt
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
  email, password, name, role, isActive,
  lastLogin, createdAt, updatedAt
}
```

---

## 🛠️ Customization

### Change Admin Credentials
Edit `backend/.env`:
```env
ADMIN_EMAIL=youremail@domain.com
ADMIN_PASSWORD=your_secure_password
```

### Add Car Categories
Edit `backend/src/models/Car.ts`:
```typescript
type: {
  enum: ['sedan', 'suv', 'hatchback', 'truck', 'luxury', 'van', 'sports']
}
```

### Customize WhatsApp Messages
Edit `backend/src/utils/whatsappService.ts`:
- Modify message templates
- Add custom branding
- Change message format

### Customize UI
- Replace logo in `src/assets/`
- Edit colors in `tailwind.config.ts`
- Modify components in `src/components/`

---

## 📁 Project Structure

```
swag-wheels/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & validation
│   │   ├── config/          # Database setup
│   │   ├── utils/           # Helper functions
│   │   └── index.ts         # Main server
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── src/
│   ├── components/
│   │   ├── admin/           # Admin dashboard
│   │   ├── cars/            # Car components
│   │   ├── forms/           # Forms
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── routes/              # TanStack routes
│   ├── lib/                 # Utilities
│   └── assets/              # Images & media
├── SETUP_GUIDE.md           # Detailed setup
├── API_DOCUMENTATION.md     # API reference
├── setup.sh                 # Auto setup script
└── start.sh                 # Quick start script
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway/Render)
```bash
cd backend
npm run build
# Deploy with Dockerfile or package.json
```

### Database (MongoDB Atlas)
1. Create free cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

---

## 🔒 Security Best Practices

- ✅ Change default admin credentials immediately
- ✅ Use strong JWT_SECRET (change from default)
- ✅ Enable HTTPS in production
- ✅ Validate all user inputs
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting
- ✅ Add CORS restrictions
- ✅ Enable MongoDB authentication

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Clear and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### MongoDB connection error
```bash
# Check if MongoDB is running
mongod

# Verify connection string in .env
MONGODB_URI=mongodb://localhost:27017/swag-wheels
```

### Admin login fails
- Check credentials in `.env`
- Verify token expiration
- Clear browser localStorage
- Check backend console for errors

### WhatsApp not working
- Verify phone number format (91XXXXXXXXXX)
- Check internet connection
- For Twilio: verify credentials
- Check backend logs

---

## 📞 Support

- **Documentation**: See [SETUP_GUIDE.md](SETUP_GUIDE.md) and [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Issues**: Check troubleshooting section
- **Contact**: +91 88278 14985

---

## 📝 License

SWAG Wheels © 2024. All rights reserved.

Built with ❤️ for car rental businesses

---

## 🎯 Roadmap

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Customer reviews & ratings
- [ ] Insurance options

---

## ✅ Checklist for First Run

- [ ] Node.js installed (v18+)
- [ ] MongoDB running
- [ ] `backend/.env` configured
- [ ] `.env.local` exists in root
- [ ] Backend running on port 5005
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can access http://localhost:5173/admin
- [ ] Can login with admin credentials

---

**Happy renting! 🚗💨**
