# SWAG Wheels - Quick Reference Guide

## 🚀 Quick Commands

### Setup
```bash
# Run everything automatically
bash setup.sh

# Or manual setup
cd backend && npm install && cd ..
npm install
```

### Start Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
npm run dev

# Or use quick start script
bash start.sh
```

### Build for Production
```bash
# Backend
cd backend && npm run build

# Frontend
npm run build
```

---

## 🔐 Authentication

### Admin Login
- **URL**: `http://localhost:5173/admin`
- **Email**: `admin@swag.com`
- **Password**: `Admin@123456`

### Change Credentials
1. Edit `backend/.env`
2. Or change via admin settings dashboard

---

## 📝 Environment Variables

### Backend `.env`
```env
PORT=5005
MONGODB_URI=mongodb+srv://princekushwahfzd_db_user:8CXhbT5HEvpuPoWc@princecluster.0dtjwgi.mongodb.net/swag_wheels_db
DATABASE_NAME=swag_wheels_db
JWT_SECRET=change_me_to_random_key
ADMIN_EMAIL=admin@swag.com
ADMIN_PASSWORD=Admin@123456
CONTACT_PHONE=+918827814985
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env.local`
```env
VITE_BACKEND_URL=http://localhost:5005
```

---

## 📱 Contact Information

**WhatsApp Phone:** `+91 88278 14985`  
**WhatsApp Integration:** Direct messaging (no API calls)

---

## 🗄️ MongoDB Collections

- **cars** - All car listings with hide/show toggle
- **blogs** - Blog posts with publish/unpublish
- **bookings** - Customer bookings with status tracking
- **contact_queries** - Contact form submissions
- **faqs** - FAQ management
- **testimonials** - Customer testimonials

---

## 🚗 Common Admin Tasks

### Add a Car
1. Go to `http://localhost:5173/admin`
2. Click **Cars** tab
3. Click **+ Add Car**
4. Fill details (name, price, category, images)
5. Click **Save**
6. Car appears on website immediately

### Hide/Show a Car
1. Go to Cars tab
2. Find the car
3. Click the Eye 👁️ icon to toggle visibility
4. Car will hide/show from frontend

### Create a Blog Post
1. Go to **Blogs** tab
2. Click **+ Add Blog**
3. Write title and content
4. Click **Publish** toggle to make live
5. Blog appears on website

### Hide/Show a Blog
1. Go to Blogs tab
2. Find the blog
3. Click Eye 👁️ icon to toggle visibility
4. Blog will hide/show from frontend

### Manage Bookings
1. Go to **Bookings** tab
2. View all customer bookings
3. Click **Update** to change status:
   - pending → confirmed → completed → cancelled
4. Status automatically updates in system

### Reply to Contact Queries
1. Go to **Queries** tab
2. Find the query
3. Click **Message on WhatsApp** button
4. WhatsApp opens automatically with pre-filled message
5. No API required - direct messaging only

### Add FAQs
1. Go to **FAQs** tab
2. Click **+ Add FAQ**
3. Enter question and answer
4. Click **Publish** to make live
5. FAQ appears on website

---

## 📊 Dashboard Widgets

### Booking Overview
- Total Bookings
- Pending (Yellow)
- Confirmed (Blue)
- Completed (Purple)
- Revenue (Total from paid bookings)

### Contact Overview
- Total Queries
- New (Red)
- Read (Yellow)
- Replied (Green)

### Quick Stats
- Response Rate: % of queries replied
- Booking Conversion: % of bookings confirmed
- Completion Rate: % of bookings completed

---

## 🔗 API Quick Reference

### Get All Cars
```bash
curl http://localhost:5005/api/cars
```

### Create Booking
```bash
curl -X POST http://localhost:5005/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "carId": "...",
    "carName": "Swift VXi",
    "customerName": "John",
    "customerPhone": "919876543210",
    "pickupDate": "2024-02-01",
    "dropDate": "2024-02-05",
    "pickupLocation": "Airport",
    "dropLocation": "City",
    "pricePerDay": 1500,
    "totalPrice": 6000,
    "totalDays": 4
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:5005/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@swagwheels.com",
    "password": "admin123456"
  }'
```

---

## 🛠️ Troubleshooting Quick Fixes

### Backend not running?
```bash
cd backend
npm install
npm run dev
```

### MongoDB not connecting?
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in .env
```

### Admin login not working?
```bash
# Clear browser storage
localStorage.clear()

# Reload and try again
# Check backend .env credentials
```

### WhatsApp not sending?
- Check phone number format: `91XXXXXXXXXX`
- Verify internet connection
- Check backend console logs

---

## 📱 Mobile Testing

### Use ngrok for testing on mobile
```bash
# Install ngrok
# Start backend
npm run dev

# In new terminal
ngrok http 5005

# Use the provided URL on mobile
```

---

## 🔄 Restart Services

### All Services
```bash
# Kill all Node processes
pkill -f "node"

# Or specific services
lsof -ti:5005,5173 | xargs kill
```

---

## 📦 Useful npm Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Lint code
npm run format       # Format code

# Backend
cd backend
npm run dev          # Start dev server
npm run build        # Build TypeScript
npm run lint         # Lint code
```

---

## 🗂️ File Locations

- **Admin Login**: `src/components/admin/adminLogin.tsx`
- **Admin Dashboard**: `src/components/admin/adminDashboard.tsx`
- **Booking Form**: `src/components/forms/BookingFormNew.tsx`
- **Backend Models**: `backend/src/models/`
- **API Routes**: `backend/src/routes/`
- **Controllers**: `backend/src/controllers/`
- **WhatsApp Service**: `backend/src/utils/whatsappService.ts`

---

## 📚 Documentation Files

- **Full Setup**: `SETUP_GUIDE.md`
- **API Docs**: `API_DOCUMENTATION.md`
- **Complete README**: `README_COMPLETE.md`
- **This Guide**: `QUICK_REFERENCE.md`

---

## 💡 Pro Tips

1. **Use environment variables** for all secrets
2. **Change admin password** after first login
3. **Test WhatsApp** before going live
4. **Backup MongoDB** regularly
5. **Monitor backend logs** for errors
6. **Use browser DevTools** to debug frontend
7. **Keep dependencies updated** regularly
8. **Test on different browsers** before deploy

---

## 🚀 Deploy Checklist

- [ ] Change all default credentials
- [ ] Update environment variables
- [ ] Enable HTTPS
- [ ] Set up automated backups
- [ ] Configure email notifications
- [ ] Test all features
- [ ] Set up monitoring
- [ ] Document deployment process
- [ ] Plan for scaling

---

## 📞 Need Help?

- Check the full documentation: `SETUP_GUIDE.md`
- Review API docs: `API_DOCUMENTATION.md`
- Check backend logs for errors
- Test individual components in isolation
- Use browser DevTools for debugging

---

**Happy coding! 🎉**
