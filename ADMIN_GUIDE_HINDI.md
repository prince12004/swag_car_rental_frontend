# 🎯 Admin Panel Guide (आपके लिए सब कुछ तैयार है!)

## 📱 Admin Panel कहाँ खोलें?

```
URL: http://localhost:5173/admin
```

## 🔐 Login करने के लिए

```
Email:    admin@swag.com
Password: Admin@123456
```

## 📞 Contact Number (सबको दीजिए)

```
+91 88278 14985
```

---

## 🚗 Admin Panel में क्या-क्या कर सकते हो?

### 1. **Dashboard (शुरुआत)**
- कुल कितनी cars हैं
- कितने bookings pending हैं
- कितने queries आई हैं
- कितना revenue हुआ

### 2. **Cars Management** 🚗
- ✅ नई car add करो
- ✅ Car की details edit करो
- ✅ Car को hide/show करो (दिखाना है या नहीं)
- ✅ Car को featured बना सकते हो (home page पर)
- ✅ Car को delete करो

**Car में देना पड़ता है:**
- Car का नाम (जैसे BMW M5)
- Price per day (रोज की कीमत)
- Category (luxury/sports/suv/sedan/budget)
- Photos
- Details (seats, fuel type, automatic/manual)

### 3. **Blogs Management** 📝
- ✅ नया blog post लिखो
- ✅ Blog को edit करो
- ✅ Blog को publish करो (दिखाना है)
- ✅ Blog को unpublish करो (छुपाना है)
- ✅ Blog को delete करो

### 4. **Bookings Management** 📅
- ✅ सभी bookings देखो
- ✅ Booking का status change करो:
  - pending → confirmed → completed
- ✅ Customer का फोन, email देखो
- ✅ Booking delete करो

### 5. **Contact Queries** 💬
- ✅ जो लोग contact form भरते हैं, उनके सभी queries यहाँ आएँगी
- ✅ "Message on WhatsApp" button दबाओ
- ✅ सीधा WhatsApp खुल जाता है customer के साथ बात करने के लिए
- ✅ कोई API नहीं, सीधा messaging

### 6. **FAQs** ❓
- ✅ سوالات और جوابات add करो
- ✅ FAQ को publish/unpublish करो
- ✅ FAQ को delete करो
- ✅ Order change करो

---

## 🗄️ MongoDB में डाटा

### Database Connection
```
mongodb+srv://princekushwahfzd_db_user:8CXhbT5HEvpuPoWc@princecluster.0dtjwgi.mongodb.net/swag_wheels_db
```

### Collections (डाटा रखने की जगह)

#### **cars** - सभी cars
```javascript
{
  title: "BMW M5",
  brand: "BMW",
  category: "luxury",
  price_per_day: 8000,
  seats: 5,
  fuel: "petrol",
  transmission: "automatic",
  is_published: true, // frontend पर दिखेगा या नहीं
  is_featured: true,  // home page पर दिखेगा या नहीं
  available: true
}
```

#### **blogs** - सभी blog posts
```javascript
{
  title: "Car Rental Tips",
  category: "Guides",
  content: "Blog का content यहाँ",
  is_published: true // दिखेगा या नहीं
}
```

#### **bookings** - सभी customers की bookings
```javascript
{
  customerName: "Raj",
  customerPhone: "98765 43210",
  carTitle: "BMW M5",
  pickupDate: "2026-06-01",
  dropDate: "2026-06-03",
  status: "pending" // pending/confirmed/completed
}
```

#### **contact_queries** - Contact form से आने वाली queries
```javascript
{
  name: "Priya",
  email: "priya@example.com",
  phone: "98765 43210",
  subject: "Car booking inquiry",
  message: "मुझे एक car चाहिए..."
}
```

#### **faqs** - सवाल जवाब
```javascript
{
  question: "कम से कम कितनी उम्र होनी चाहिए?",
  answer: "21 साल या उससे ज्यादा"
}
```

---

## 🌐 API Endpoints

सभी कोई भी काम के लिए ये endpoints हैं:

```
GET    http://localhost:5005/api/cars
POST   http://localhost:5005/api/cars
PATCH  http://localhost:5005/api/cars/:id
DELETE http://localhost:5005/api/cars/:id

GET    http://localhost:5005/api/blogs
POST   http://localhost:5005/api/blogs
PATCH  http://localhost:5005/api/blogs/:id
DELETE http://localhost:5005/api/blogs/:id

GET    http://localhost:5005/api/bookings
PATCH  http://localhost:5005/api/bookings/:id

GET    http://localhost:5005/api/contact_queries
POST   http://localhost:5005/api/contact_queries

GET    http://localhost:5005/api/faqs
```

---

## 📱 WhatsApp Integration

### कैसे काम करता है?

1. **Customer form भरता है**
   - Name, Email, Phone, Message

2. **Admin को notification मिलता है**
   - Admin panel में query दिखता है

3. **Admin WhatsApp button दबाता है**
   - सीधा WhatsApp खुल जाता है

4. **Customer से बात करो**
   - Message pre-filled रहता है
   - कोई API charge नहीं

### Contact Number
```
+91 88278 14985
```

---

## 🚀 शुरुआत कैसे करें?

### Step 1: Backend चलाओ
```bash
cd backend
npm install
npm run dev
```

### Step 2: Frontend चलाओ (नया terminal खोलो)
```bash
npm install
npm run dev
```

### Step 3: URLs खोलो
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5173/admin
- API: http://localhost:5005

### Step 4: Login करो
```
Email: admin@swag.com
Password: Admin@123456
```

### Step 5: अपना data add करो
- 5-10 cars add करो
- 2-3 blogs लिखो
- 5-6 FAQs add करो

---

## ✨ क्या-क्या बदल दिया?

### ❌ हटाया गया:
- ❌ Supabase हटा दिया (खर्चीला था)
- ❌ WhatsApp API हटा दी (महंगी थी)
- ❌ WhatsApp booking automation हटा दी

### ✅ जोड़ा गया:
- ✅ MongoDB लगाया (सस्ता और अच्छा)
- ✅ WhatsApp direct messaging (फ्री!)
- ✅ Full admin panel बनाया
- ✅ Hide/Show feature लगाया
- ✅ Contact phone हमेशा दिखता है

---

## 🎛️ Admin Panel Features

### Dashboard Tab
- Stats देखो (कुल cars, bookings, queries)

### Cars Tab
- ➕ नई car add करो
- ✏️ Car edit करो
- 👁️ Hide/Show करो
- ⭐ Featured बना सकते हो
- 🗑️ Delete करो

### Blogs Tab
- ➕ नया blog लिखो
- ✏️ Edit करो
- 📰 Publish/Unpublish करो
- 🗑️ Delete करो

### Bookings Tab
- 📋 सभी bookings देखो
- 📊 Status update करो
- 🗑️ Delete करो

### Queries Tab
- 💬 Contact queries देखो
- 💚 WhatsApp पर reply करो
- ✅ Mark as read करो

### FAQs Tab
- ❓ FAQ add करो
- ✏️ Edit करो
- 📰 Publish/Unpublish करो

---

## 📞 Support

**कोई problem हो तो:**
- Browser cache clear करो
- Backend चल रहा है या नहीं देखो
- MongoDB connect है या नहीं
- Contact: +91 88278 14985

---

## 🎯 अगला Step क्या है?

1. ✅ Admin panel ready है
2. ✅ MongoDB setup है
3. ✅ सभी features काम कर रहे हैं
4. ⏭️ अब अपना data add करो
5. ⏭️ Website को live करो

---

## 📝 Sample Data Add करने का तरीका

### Car add करो
1. Admin panel खोलो
2. "Cars" tab पर जाओ
3. "+ Add Car" button दबाओ
4. Details भरो:
   - Title: BMW M5
   - Brand: BMW
   - Category: luxury
   - Price: 8000
   - Seats: 5
   - Fuel: petrol
   - Images: upload करो
5. "Save" दबाओ
6. अब website पर दिखेगा!

### Car को hide करो
1. Cars list में देखो
2. Car के आगे eye 👁️ icon दबाओ
3. Car website से गायब हो जाएगी
4. फिर से दबाओ तो फिर से दिख जाएगी

### Blog publish करो
1. Blogs tab खोलो
2. "+ Add Blog" दबाओ
3. Title, content, category लिखो
4. Images upload करो
5. "Publish" toggle on करो
6. Blog website पर live हो जाएगा!

---

## 🎓 आसान बातें

- ✅ सब कुछ ready है, बस अपना data add करो
- ✅ WhatsApp 100% free है
- ✅ MongoDB सस्ता है
- ✅ Admin panel बहुत आसान है
- ✅ कोई coding नहीं करनी पड़ेगी

---

## 📋 Checklist

- [x] Admin panel ready
- [x] MongoDB setup
- [x] WhatsApp integration
- [x] सभी features काम कर रहे हैं
- [ ] अपना data add करो
- [ ] Website को test करो
- [ ] Live करो

---

**Last Updated:** 21 May 2026  
**Status:** ✅ सब कुछ तैयार है!  
**Next:** अपना data add करो और live करो!
