# Vijay Cashew - Full Stack Architecture Guide

## Project Overview

The Vijay Cashew project has been upgraded from a Google Sheets-based backend to a modern full-stack application with Node.js/Express backend and MongoDB database.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│              http://localhost:5173                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                   HTTP/REST API
                             │
┌────────────────────────────┴────────────────────────────────┐
│                    Backend (Express.js)                     │
│              http://localhost:5000/api                      │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Auth Routes │  │ Product Rout.│  │  Cart Routes │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Order Routes │  │Wishlist Rout.│  │Test. Routes │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────────┬────────────────────────────────┘
                             │
                  MongoDB Connection
                             │
┌────────────────────────────┴────────────────────────────────┐
│                    MongoDB Database                         │
│              localhost:27017/vijay-cashew                   │
├──────────────────────────────────────────────────────────────┤
│  Collections: users, products, carts, wishlists, orders,   │
│              testimonials, deliveries                       │
└──────────────────────────────────────────────────────────────┘
```

## Data Storage Strategy

### Database (MongoDB) - New Data Only
✅ User accounts and authentication
✅ Shopping carts
✅ Wishlist items
✅ Orders and order history
✅ Testimonials
✅ Delivery tracking
✅ User profiles and addresses

### Excel (Original) - Products Only
⚠️ Product catalog (name, price, description, images)
⚠️ Keep existing Excel integration for product updates

## File Structure

### Backend
```
backend/
├── models/                 # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Wishlist.js
│   ├── Order.js
│   ├── Testimonial.js
│   └── Delivery.js
├── controllers/            # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── wishlistController.js
│   └── testimonialController.js
├── routes/                 # API endpoints
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── wishlistRoutes.js
│   └── testimonialRoutes.js
├── middleware/             # Custom middleware
│   └── auth.js            # JWT authentication
├── config/
│   └── database.js        # MongoDB connection
├── utils/
│   └── generateToken.js   # JWT token generation
├── server.js              # Entry point
├── package.json
├── .env                   # Configuration
└── README.md
```

### Frontend Updates
```
src/
├── services/
│   ├── api/
│   │   └── axios.js      # Updated with API URL & interceptors
│   ├── read/
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   ├── order.service.js
│   │   ├── wishlist.service.js
│   │   ├── testimonial.service.js
│   │   └── delivery.service.js
│   └── write/
│       ├── auth.service.js
│       ├── cart.service.js
│       ├── order.service.js
│       ├── wishlist.service.js
│       ├── testimonial.service.js
│       └── delivery.service.js
├── .env                  # VITE_API_URL=http://localhost:5000/api
└── ... (other files)
```

## Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or cloud)
- npm/yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup
```bash
npm install
# .env already configured with VITE_API_URL
npm run dev
```

### Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## API Authentication

### How JWT Works
1. User registers/logs in
2. Backend generates JWT token
3. Frontend stores token in localStorage
4. Frontend sends token in Authorization header: `Bearer <token>`
5. Backend verifies token on protected routes
6. If token invalid/expired, redirect to login

### Example Request
```javascript
// Token stored automatically by axios interceptor
const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
};

// Request to protected route
GET /api/cart
```

## Database Models

### User
```javascript
{
  name, email, password (hashed), phone,
  address: { street, city, state, zipCode, country },
  role: 'user|admin|delivery',
  isActive, timestamps
}
```

### Product
```javascript
{
  name, description, price, originalPrice,
  category, image, images[],
  stock, rating, reviews[],
  isActive, timestamps
}
```

### Order
```javascript
{
  userId, orderId (unique),
  items[], totalAmount, deliveryCharge, discount, finalAmount,
  shippingAddress {},
  status: 'pending|confirmed|shipped|delivered|cancelled',
  paymentMethod, paymentStatus,
  trackingNumber, timestamps
}
```

### Cart
```javascript
{
  userId,
  items: [{ productId, productName, price, quantity, image }],
  totalItems, totalPrice, timestamps
}
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/vijay-cashew
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secure_secret_key
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Key Features Implemented

✅ User Registration & Login
✅ JWT Authentication
✅ Password Hashing (bcryptjs)
✅ Product Management
✅ Shopping Cart (Create, Update, Delete)
✅ Wishlist (Add, Remove)
✅ Order Management
✅ Order Status Tracking
✅ Customer Testimonials
✅ Stock Management
✅ CORS Configuration
✅ Error Handling

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | ❌ | Register new user |
| POST | /auth/login | ❌ | Login user |
| GET | /auth/profile | ✅ | Get user profile |
| PUT | /auth/profile | ✅ | Update profile |
| GET | /products | ❌ | Get all products |
| GET | /products/:id | ❌ | Get product detail |
| POST | /cart | ✅ | Get user cart |
| POST | /cart/add | ✅ | Add to cart |
| POST | /cart/remove | ✅ | Remove from cart |
| POST | /cart/update | ✅ | Update quantity |
| POST | /orders | ✅ | Create order |
| GET | /orders | ✅ | Get user orders |
| GET | /orders/:id | ✅ | Get order detail |
| POST | /wishlist/add | ✅ | Add to wishlist |
| POST | /testimonials | ❌ | Submit testimonial |
| GET | /testimonials | ❌ | Get approved testimonials |

## Important Notes

### Security
- Passwords hashed before storage
- JWT tokens expire in 30 days
- CORS enabled for frontend URL only
- Authorization required for user operations

### Data Flow
- Products: Excel → Frontend (existing integration maintained)
- User Data: Frontend ↔ Backend ↔ MongoDB (new)
- Orders: Frontend ↔ Backend ↔ MongoDB (new)

### Production Considerations
- Use environment variables for sensitive data
- Deploy MongoDB to production service (MongoDB Atlas, etc.)
- Deploy backend to hosting (Railway, Render, Heroku, etc.)
- Configure CORS for production domain
- Use strong JWT_SECRET
- Enable HTTPS
- Set NODE_ENV=production

## Deployment Guide (Coming Soon)

Will include:
1. Backend deployment (Railway/Render/Heroku)
2. MongoDB Atlas setup
3. Frontend deployment (Vercel/Netlify)
4. Environment configuration
5. CI/CD setup

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify PORT is available
- Check .env file configuration

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend .env
- Check CORS settings in backend

### Authentication issues
- Clear localStorage and try again
- Verify JWT_SECRET matches between requests
- Check token expiration (30 days)

## Next Steps

1. Implement admin role-based middleware
2. Add email notifications
3. Integrate payment gateway
4. Add image upload functionality
5. Setup delivery partner system
6. Production deployment

---

For more details, see:
- [Backend README](./backend/README.md)
- [Backend Setup Guide](./BACKEND_SETUP.md)
- Individual service files in frontend
