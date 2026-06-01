# Quick Start Guide - Vijay Cashew Full Stack

## 🚀 One-Minute Setup

### Terminal 1: Start MongoDB
```bash
mongod
```
Keep this running in the background.

### Terminal 2: Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs at: `http://localhost:5000`

### Terminal 3: Start Frontend
```bash
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

## ✅ Verify Everything Works

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected: `{"message":"Server is running"}`

2. **Frontend App**
   Visit: `http://localhost:5173`

3. **Inspect Network**
   - Open DevTools (F12)
   - Go to Network tab
   - Try login or add to cart
   - See API calls to `http://localhost:5000/api`

## 📝 First Time Users

### 1. Register a New User
- Click "Register" or "Sign Up"
- Fill in details (name, email, password, phone)
- Submit
- Token saved in localStorage
- Redirected to home/dashboard

### 2. Add Products to Cart
- Browse products
- Click "Add to Cart"
- Goes to MongoDB via API
- Check cart

### 3. Create an Order
- Go to cart
- Fill shipping address
- Click "Checkout"
- Order saved to MongoDB
- View in "My Orders"

### 4. Add Testimonial
- Go to "Testimonials"/"Contact"
- Fill review form
- Submit
- Visible after admin approval

## 🔧 Common Commands

### Backend Development
```bash
cd backend
npm run dev          # Development with hot reload
npm start           # Production mode
npm install         # Install dependencies
```

### Frontend Development
```bash
npm run dev         # Development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Database
```bash
# MongoDB connection
mongodb://localhost:27017/vijay-cashew

# MongoDB Atlas (cloud)
mongodb+srv://user:pass@cluster.mongodb.net/vijay-cashew
```

## 📋 File Changes Summary

### Backend (NEW)
- `backend/` - Complete Express.js + MongoDB backend
- `backend/package.json` - Dependencies
- `backend/.env` - Configuration
- `backend/server.js` - Entry point

### Frontend (UPDATED)
- `src/services/api/axios.js` - Now uses http://localhost:5000/api
- `src/services/read/*` - Updated to use API endpoints
- `src/services/write/*` - Updated to use API endpoints
- `.env` - Added VITE_API_URL

### New Docs
- `BACKEND_SETUP.md` - Detailed setup guide
- `ARCHITECTURE.md` - Full architecture overview

## 🔑 Default Credentials

No default users - register new ones.

## 📦 What Data is Where

| Feature | Storage | Location |
|---------|---------|----------|
| Products | Excel | Original integration |
| Users | Database | MongoDB users collection |
| Cart | Database | MongoDB carts collection |
| Orders | Database | MongoDB orders collection |
| Wishlist | Database | MongoDB wishlists collection |
| Reviews | Database | MongoDB products.reviews array |

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -i :5000
kill -9 <PID>

# Kill process on port 5173 (frontend)
lsof -i :5173
kill -9 <PID>
```

### MongoDB Connection Failed
- Ensure `mongod` is running
- Check `MONGODB_URI` in backend `.env`
- For MongoDB Atlas, whitelist your IP

### Frontend Can't Connect to Backend
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check `VITE_API_URL` in frontend `.env`
- Browser DevTools → Network tab to see API errors

### npm install Issues
```bash
# Clear npm cache
npm cache clean --force

# Install again
npm install
```

## 📚 Learning Resources

1. **API Testing**: Use Postman or Thunder Client
2. **Database Exploration**: Use MongoDB Compass
3. **Frontend Debugging**: Browser DevTools
4. **Backend Logs**: Check terminal output

## 🎯 Next Features to Implement

1. Admin dashboard
2. Payment integration
3. Email notifications
4. Delivery tracking
5. Advanced reporting
6. Production deployment

## 📞 Common Tasks

### Register and Test
```javascript
// POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

### Get Products
```javascript
// GET http://localhost:5000/api/products
// No auth required
```

### Add to Cart
```javascript
// POST http://localhost:5000/api/cart/add
// Requires auth token
{
  "productId": "product_id_from_db",
  "quantity": 2
}
```

### Create Order
```javascript
// POST http://localhost:5000/api/orders
// Requires auth token
{
  "shippingAddress": {
    "name": "John",
    "email": "john@example.com",
    "phone": "9876543210",
    "street": "123 Main St",
    "city": "Chennai",
    "state": "TN",
    "zipCode": "600001"
  },
  "paymentMethod": "cod",
  "deliveryCharge": 50,
  "discount": 0
}
```

## ✨ Tips

- Use VS Code's REST Client extension for API testing
- Keep browser DevTools open to see network requests
- Check MongoDB Compass to see actual database data
- Backend logs show all API activity

---

Happy coding! 🎉

For detailed docs, see `ARCHITECTURE.md` and `BACKEND_SETUP.md`
