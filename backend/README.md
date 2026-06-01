# Vijay Cashew Backend API

A Node.js + Express + MongoDB backend for the Vijay Cashew e-commerce landing page.

## Features

- User Authentication (Register, Login, Profile Management)
- Product Management
- Shopping Cart
- Wishlist
- Orders & Order Management
- Testimonials
- Delivery Tracking

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Password Hashing**: bcryptjs

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/vijay-cashew
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/review` - Add product review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `POST /api/cart/remove` - Remove from cart
- `POST /api/cart/update` - Update cart item quantity
- `POST /api/cart/clear` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `POST /api/wishlist/remove` - Remove from wishlist

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `POST /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (Admin)

### Testimonials
- `POST /api/testimonials` - Submit testimonial
- `GET /api/testimonials` - Get approved testimonials
- `GET /api/testimonials/admin/all` - Get all testimonials (Admin)
- `PUT /api/testimonials/:id/approve` - Approve testimonial (Admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin)

## Database Models

- **User**: User accounts and profiles
- **Product**: Product information
- **Cart**: User shopping carts
- **Wishlist**: User wishlists
- **Order**: Orders and order history
- **Testimonial**: Customer testimonials
- **Delivery**: Delivery tracking

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/vijay-cashew |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| JWT_SECRET | JWT secret key | your_jwt_secret |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## Notes

- All sensitive data operations require authentication
- Admin operations need role-based access control
- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- CORS is configured for frontend communication
