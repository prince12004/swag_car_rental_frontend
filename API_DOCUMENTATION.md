# API Documentation

## Base URL
```
http://localhost:5005/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Admin Endpoints

### Register Admin
```http
POST /admin/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123",
  "name": "Admin Name"
}

Response: 201
{
  "message": "Admin registered successfully",
  "token": "eyJhbGc...",
  "admin": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin Name",
    "role": "admin"
  }
}
```

### Login Admin
```http
POST /admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response: 200
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "admin": { ... }
}
```

### Get Admin Profile
```http
GET /admin/profile
Authorization: Bearer <token>

Response: 200
{
  "admin": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin Name",
    "role": "admin",
    "isActive": true,
    "lastLogin": "2024-01-15T10:30:00Z"
  }
}
```

### Update Admin Profile
```http
PUT /admin/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name",
  "email": "newemail@example.com"
}

Response: 200
```

### Change Password
```http
PUT /admin/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "current_password",
  "newPassword": "new_password"
}

Response: 200
```

---

## Car Endpoints

### Get All Cars
```http
GET /cars?type=sedan&availability=true&sortBy=price-asc

Query Parameters:
- type: sedan|suv|hatchback|truck|luxury
- availability: true|false
- sortBy: price-asc|price-desc|rating

Response: 200
{
  "count": 10,
  "cars": [
    {
      "_id": "...",
      "name": "Swift VXi",
      "brand": "Maruti",
      "model": "Swift",
      "year": 2024,
      "price": 500500,
      "description": "...",
      "image": "url",
      "images": [],
      "type": "hatchback",
      "seats": 5,
      "transmission": "manual",
      "fuelType": "petrol",
      "features": ["AC", "Power Steering"],
      "availability": true,
      "rating": 4.5,
      "reviews": 12,
      "location": "Mumbai",
      "pricePerDay": 1500,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### Search Cars
```http
GET /cars/search?query=swift&priceMin=1000&priceMax=3000

Query Parameters:
- query: search term
- type: car type filter
- priceMin: minimum price per day
- priceMax: maximum price per day

Response: 200
{
  "count": 5,
  "cars": [ ... ]
}
```

### Get Car by ID
```http
GET /cars/507f1f77bcf86cd799439011

Response: 200
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Swift VXi",
  ...
}
```

### Create Car (Admin)
```http
POST /cars
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Swift VXi",
  "brand": "Maruti",
  "model": "Swift",
  "year": 2024,
  "price": 500500,
  "pricePerDay": 1500,
  "description": "Compact hatchback with great features",
  "image": "url",
  "images": ["url1", "url2"],
  "type": "hatchback",
  "seats": 5,
  "transmission": "manual",
  "fuelType": "petrol",
  "features": ["AC", "Power Steering", "Music System"],
  "location": "Mumbai"
}

Response: 201
{
  "message": "Car added successfully",
  "car": { ... }
}
```

### Update Car (Admin)
```http
PUT /cars/507f1f77bcf86cd799439011
Authorization: Bearer <token>
Content-Type: application/json

{
  "pricePerDay": 1800,
  "availability": false
}

Response: 200
```

### Delete Car (Admin)
```http
DELETE /cars/507f1f77bcf86cd799439011
Authorization: Bearer <token>

Response: 200
```

### Toggle Car Availability (Admin)
```http
PATCH /cars/507f1f77bcf86cd799439011/availability
Authorization: Bearer <token>

Response: 200
```

---

## Blog Endpoints

### Get All Blogs
```http
GET /blogs?published=true&category=travel&page=1&limit=10

Query Parameters:
- published: true|false
- category: travel|tips|news|lifestyle|other
- sortBy: views|likes|newest
- page: page number (default: 1)
- limit: items per page (default: 10)

Response: 200
{
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "blogs": [ ... ]
}
```

### Get Blog by Slug
```http
GET /blogs/slug/my-blog-post

Response: 200
{
  "_id": "...",
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "content": "...",
  "excerpt": "...",
  "author": "SWAG Wheels Team",
  "image": "url",
  "category": "travel",
  "tags": ["travel", "tips"],
  "published": true,
  "views": 150,
  "likes": 25,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Create Blog (Admin)
```http
POST /blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Blog Post",
  "content": "Full blog content here...",
  "excerpt": "Short summary",
  "author": "John Doe",
  "image": "cover-image-url",
  "category": "travel",
  "tags": ["travel", "tips"],
  "published": false
}

Response: 201
```

### Update Blog (Admin)
```http
PUT /blogs/507f1f77bcf86cd799439011
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}

Response: 200
```

### Publish/Unpublish Blog (Admin)
```http
PATCH /blogs/507f1f77bcf86cd799439011/publish
Authorization: Bearer <token>

Response: 200
```

### Delete Blog (Admin)
```http
DELETE /blogs/507f1f77bcf86cd799439011
Authorization: Bearer <token>

Response: 200
```

### Like Blog
```http
POST /blogs/507f1f77bcf86cd799439011/like

Response: 200
```

---

## Booking Endpoints

### Create Booking (Public)
```http
POST /bookings
Content-Type: application/json

{
  "carId": "507f1f77bcf86cd799439011",
  "carName": "Swift VXi",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "919876543210",
  "pickupDate": "2024-02-01",
  "dropDate": "2024-02-05",
  "pickupLocation": "Mumbai Airport",
  "dropLocation": "Mumbai City",
  "pricePerDay": 1500,
  "totalDays": 4,
  "totalPrice": 6000,
  "specialRequests": "GPS needed"
}

Response: 201
{
  "message": "Booking created successfully",
  "booking": { ... },
  "whatsappNotification": true
}
```

### Get All Bookings (Admin)
```http
GET /bookings?status=pending&page=1&limit=10
Authorization: Bearer <token>

Query Parameters:
- status: pending|confirmed|completed|cancelled
- page: page number
- limit: items per page

Response: 200
```

### Get Booking Stats (Admin)
```http
GET /bookings/stats
Authorization: Bearer <token>

Response: 200
{
  "total": 50,
  "pending": 5,
  "confirmed": 20,
  "completed": 20,
  "cancelled": 5,
  "revenue": 150050
}
```

### Update Booking Status (Admin)
```http
PUT /bookings/507f1f77bcf86cd799439011/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}

Response: 200
```

### Cancel Booking (Admin)
```http
PUT /bookings/507f1f77bcf86cd799439011/cancel
Authorization: Bearer <token>

Response: 200
```

---

## Contact Query Endpoints

### Create Contact Query (Public)
```http
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "919876543210",
  "subject": "Booking Inquiry",
  "message": "I want to book a car for..."
}

Response: 201
{
  "message": "Query submitted successfully",
  "query": { ... },
  "whatsappNotification": true
}
```

### Get All Queries (Admin)
```http
GET /contact?status=new&page=1&limit=10
Authorization: Bearer <token>

Query Parameters:
- status: new|read|replied
- page: page number
- limit: items per page

Response: 200
```

### Get Query Stats (Admin)
```http
GET /contact/stats
Authorization: Bearer <token>

Response: 200
{
  "total": 100,
  "new": 15,
  "read": 45,
  "replied": 40
}
```

### Reply to Query (Admin)
```http
PUT /contact/507f1f77bcf86cd799439011/reply
Authorization: Bearer <token>
Content-Type: application/json

{
  "adminReply": "Thank you for your inquiry. We have a Swift available..."
}

Response: 200
```

### Delete Query (Admin)
```http
DELETE /contact/507f1f77bcf86cd799439011
Authorization: Bearer <token>

Response: 200
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Car not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "error details"
}
```

---

## Rate Limiting

- No rate limiting currently (add in production)
- Recommended: 100 requests/minute per IP

## CORS

- Allowed Origin: `http://localhost:5173` (development)
- Change in production to your domain

## Pagination

- Default limit: 10 items
- Max limit: 100 items
- Page numbers start from 1
