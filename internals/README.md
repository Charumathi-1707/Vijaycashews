# 📚 Vijay Cashew - Full Stack E-Commerce Platform

## 🎯 Project Structure

Your Vijay Cashew project is now organized with **three main folders**:

```
Vijaycashews/
├── backend/        ← Node.js/Express API Server
├── frontend/       ← React/Vite User Interface  
└── internals/      ← Internal configurations
```

## ⚡ Quick Start (5 Minutes)

### Terminal 1: Start MongoDB
```bash
mongod
```

### Terminal 2: Start Backend
```bash
cd backend
npm install
npm run dev
```
**Runs at**: `http://localhost:5000/api`

### Terminal 3: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
**Runs at**: `http://localhost:5173`

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | Get started in 5 minutes ⭐ |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Detailed folder organization |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design & overview |
| [BACKEND_SETUP.md](./BACKEND_SETUP.md) | Backend installation guide |
| [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) | Migration summary |
| [backend/README.md](./backend/README.md) | Backend API reference |
| [frontend/README.md](./frontend/README.md) | Frontend guide |

## 🏗️ Project Components

### Backend
**Location**: `backend/`
- Node.js + Express server
- MongoDB database integration
- REST API with 30+ endpoints
- JWT authentication
- 7 data models ready
- Start: `npm run dev`

### Frontend
**Location**: `frontend/`
- React 18 + Vite
- Responsive UI
- Shopping cart & orders
- User authentication
- Start: `npm run dev`

### Internals
**Location**: `internals/`
- Google Apps Script configuration
- Internal tools

## ✨ Key Features

✅ User Registration & Login  
✅ Product Browsing  
✅ Shopping Cart (Database-backed)  
✅ Order Management  
✅ Wishlist Management  
✅ Testimonials & Reviews  
✅ JWT Authentication  
✅ Stock Management  
✅ CORS Protection  

## 🌐 Service URLs

| Service | URL |
|---------|-----|
| Frontend UI | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| API Health | http://localhost:5000/api/health |
| MongoDB | mongodb://localhost:27017 |

## 🔐 Technology Stack

**Frontend**:
- React 18+
- Vite (build tool)
- Axios (HTTP client)
- Tailwind CSS

**Backend**:
- Node.js
- Express.js
- MongoDB
- JWT (authentication)
- bcryptjs (password hashing)

**Database**:
- MongoDB
- 7 collections

## 📁 File Organization

```
backend/
├── models/              # MongoDB schemas
├── controllers/         # Business logic
├── routes/             # API endpoints
├── middleware/         # Auth middleware
├── config/            # Configuration
├── server.js          # Entry point
└── package.json

frontend/
├── src/
│   ├── components/    # React components
│   ├── pages/        # Page screens
│   ├── services/     # API services
│   ├── context/      # State management
│   └── hooks/        # Custom hooks
├── public/           # Static assets
├── index.html
├── package.json
└── vite.config.js

internals/
└── appscript.txt
```

## 🚀 Getting Started

### Step 1: Prerequisites
- Node.js v16 or higher
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn

### Step 2: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection
npm run dev
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Verify
- Visit http://localhost:5173
- Register a test user
- Add items to cart
- Create a test order

## 📊 API Overview

| Feature | Endpoints |
|---------|-----------|
| Auth | /auth/register, /login, /profile |
| Products | /products, /products/:id |
| Cart | /cart, /cart/add, /cart/remove |
| Orders | /orders, /orders/:id |
| Wishlist | /wishlist, /wishlist/add |
| Testimonials | /testimonials |

**Full API docs**: See [backend/README.md](./backend/README.md)

## 🔑 Environment Configuration

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

## 🆘 Troubleshooting

**Backend won't start?**
- Check MongoDB is running: `mongod`
- Verify PORT 5000 is available
- Check backend/.env configuration

**Frontend can't connect to backend?**
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check frontend/.env VITE_API_URL
- Open DevTools Network tab to see API calls

**MongoDB connection error?**
- Ensure MongoDB is running
- For MongoDB Atlas, whitelist your IP address
- Check MONGODB_URI in backend/.env

See [QUICKSTART.md](./QUICKSTART.md) for more help.

## 📈 Project Status

✅ Backend infrastructure complete
✅ Frontend updated with new API
✅ Database models ready
✅ Authentication system implemented
✅ API endpoints configured
✅ Project restructured (3 main folders)

## 🎯 Next Steps

1. Read [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
2. Follow [QUICKSTART.md](./QUICKSTART.md)
3. Start MongoDB, backend, and frontend
4. Test user registration and orders
5. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for details

## 📞 Documentation

Need help? Check these files:

- **New to the project?** → [QUICKSTART.md](./QUICKSTART.md)
- **Want to understand structure?** → [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **Need architecture details?** → [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Setting up backend?** → [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **Looking for API docs?** → [backend/README.md](./backend/README.md)

---

**Status**: ✅ Ready to run  
**Version**: 1.0.0  
**Last Updated**: May 30, 2026

**Start with**: [QUICKSTART.md](./QUICKSTART.md)
