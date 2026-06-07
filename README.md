# 🛍️ ShopEase — Full-Stack MERN E-Commerce Platform

A production-ready, full-featured e-commerce application built with MongoDB, Express, React, and Node.js.

---

## 🏗️ Architecture Overview

```
ecommerce/
├── backend/          # Node.js + Express REST API
│   ├── config/       # DB + Cloudinary config
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Auth, error handlers
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── scripts/      # Seed script
│   └── utils/        # Helpers (JWT, etc.)
│
└── frontend/         # React + Vite + Tailwind
    └── src/
        ├── api/        # Axios + service functions
        ├── components/ # UI, layout, product components
        ├── pages/      # All page components
        │   ├── customer/   # Account, Orders, Wishlist
        │   ├── admin/      # Full admin panel
        │   └── delivery/   # Delivery partner panel
        ├── store/      # Zustand state stores
        └── utils/      # Helpers and formatters
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
# Edit .env with your credentials (already configured)
node scripts/seed.js   # Seed demo data
npm run dev            # Start on port 5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev            # Start on port 5173
```

---

## 🔐 Demo Accounts

| Role       | Email                      | Password      |
|------------|----------------------------|---------------|
| 👑 Admin   | admin@shopease.com         | admin123      |
| 🛒 Customer | customer@shopease.com     | customer123   |
| 🚚 Delivery | delivery@shopease.com     | delivery123   |

## 🎟️ Demo Coupon Codes

| Code       | Discount                        |
|------------|---------------------------------|
| WELCOME20  | 20% off (max ₹200, min ₹300)   |
| FLAT100    | ₹100 flat off (min ₹599)       |
| NUTS15     | 15% off (max ₹150, min ₹500)   |
| SUMMER50   | ₹50 flat off (no minimum)      |

---

## ✨ Features

### 🛒 Customer Panel
- Beautiful landing page with hero slider, featured products, categories
- Product search, filter, sort (price, rating, category, featured)
- Product detail page with image gallery, variants, reviews
- Shopping cart with quantity management
- Coupon code application
- Multi-step checkout (Address → Payment → Confirm)
- Order history with real-time status tracking
- Order cancellation (pending/confirmed only)
- Wishlist management
- Account management (profile, avatar, addresses, password)

### 👑 Admin Panel
- Analytics dashboard (revenue charts, order stats, KPIs)
- Order management (status updates, delivery assignment)
- Product management (CRUD, image upload via Cloudinary)
- Category management
- Customer management (view, activate/deactivate)
- Delivery team management (create accounts, track performance)
- Coupon management (percentage/fixed, expiry, usage limits)

### 🚚 Delivery Panel
- Active deliveries dashboard
- Order detail view with customer info and delivery address
- One-tap status updates (Shipped → Out for Delivery → Delivered)
- Completed deliveries history
- Performance stats (total deliveries, rating)

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/profile
PUT    /api/auth/change-password
POST   /api/auth/address
PUT    /api/auth/address/:id
DELETE /api/auth/address/:id
```

### Products
```
GET    /api/products              # List (search, filter, paginate)
GET    /api/products/:id         # Single product
GET    /api/products/admin       # Admin list
POST   /api/products             # Create (Admin)
PUT    /api/products/:id         # Update (Admin)
DELETE /api/products/:id         # Delete (Admin)
POST   /api/products/:id/reviews # Add review (Customer)
```

### Orders
```
POST   /api/orders               # Create (Customer)
GET    /api/orders/my            # My orders (Customer)
PUT    /api/orders/:id/cancel    # Cancel (Customer)
GET    /api/orders/admin/all     # All orders (Admin)
GET    /api/orders/admin/stats   # Dashboard stats (Admin)
PUT    /api/orders/admin/:id/status  # Update status (Admin)
PUT    /api/orders/admin/:id/assign  # Assign delivery (Admin)
GET    /api/orders/delivery/my   # My deliveries (Deliveryman)
PUT    /api/orders/delivery/:id/status # Update (Deliveryman)
```

### Cart
```
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/item/:id
DELETE /api/cart/item/:id
DELETE /api/cart/clear
POST   /api/cart/coupon
DELETE /api/cart/coupon
```

### Admin
```
GET    /api/admin/users
PUT    /api/admin/users/:id
POST   /api/admin/staff
PUT    /api/admin/users/:id/toggle
GET    /api/admin/deliverymen
GET    /api/admin/coupons
POST   /api/admin/coupons
PUT    /api/admin/coupons/:id
DELETE /api/admin/coupons/:id
```

---

## 🌐 Production Deployment

### Backend (Railway / Render)
1. Push to GitHub
2. Connect to Railway/Render
3. Set environment variables from `.env`
4. Deploy — `npm start`

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your backend URL
2. Build: `npm run build`
3. Deploy `dist/` folder

### MongoDB Atlas
- IP whitelist: `0.0.0.0/0` for deployment
- Connection string already in `.env`

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS 3     |
| State      | Zustand, React Hot Toast            |
| Backend    | Node.js, Express 4                  |
| Database   | MongoDB Atlas, Mongoose             |
| Auth       | JWT (access + refresh tokens)       |
| Images     | Cloudinary (auto-optimize)          |
| Security   | Helmet, CORS, Rate Limiting         |

---

## 🔒 Security Features

- JWT authentication with HTTP-only cookies
- bcrypt password hashing (12 rounds)
- Role-based access control (RBAC)
- Helmet.js security headers
- Rate limiting (200 req/15min)
- Input validation and sanitization
- CORS whitelisting
