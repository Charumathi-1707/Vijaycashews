# Backend Setup & Installation Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Installation Steps

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Copy the `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/vijay-cashew
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secure_secret_key
FRONTEND_URL=http://localhost:5173
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas (Cloud):**
Update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vijay-cashew
```

### 5. Start Backend Server

**Development Mode (with hot reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## Verification

Check if backend is running:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{ "message": "Server is running" }
```

## Frontend Configuration

Update frontend `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## API Documentation

See [README.md](./README.md) for complete API endpoint documentation.

## Database Schema

### Collections:
- **users** - User accounts and profiles
- **products** - Product catalog
- **carts** - Shopping carts
- **wishlists** - User wishlists
- **orders** - Orders and history
- **testimonials** - Customer reviews
- **deliveries** - Delivery tracking

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` is correct
- For MongoDB Atlas, whitelist your IP

### Port Already in Use
```bash
# Change PORT in .env or kill process using port 5000
lsof -i :5000
kill -9 <PID>
```

### CORS Issues
- Update `FRONTEND_URL` in backend `.env`
- Ensure frontend is sending correct origin header

### JWT Token Issues
- Change `JWT_SECRET` to a secure random string
- Clear localStorage on frontend after changing secret

## Development Notes

- All operations except product retrieval require authentication
- JWT tokens expire in 30 days
- Passwords are hashed with bcryptjs
- Admin operations should have role-based middleware (todo)
- Stock is deducted from products when orders are created

## Next Steps

1. Setup admin role-based access control middleware
2. Add email notifications for order updates
3. Integrate payment gateway (Razorpay, Stripe)
4. Add image upload functionality
5. Setup production MongoDB instance
6. Deploy to hosting service (Heroku, Railway, Render, etc.)
