# Project Structure Guide

Your Vijay Cashew project is now organized with three main folders:

```
Vijaycashews/
│
├── backend/                    # Node.js/Express API Server
│   ├── models/                 # MongoDB schemas
│   ├── controllers/            # API business logic
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Auth middleware
│   ├── config/                 # Configuration files
│   ├── utils/                  # Utilities
│   ├── server.js               # Main server file
│   ├── package.json            # Backend dependencies
│   ├── .env                    # Backend configuration
│   └── README.md               # Backend documentation
│
├── frontend/                   # React/Vite UI
│   ├── src/                    # React source code
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── context/            # State management
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                 # Static assets
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── eslint.config.js        # Linting config
│   ├── .env                    # Frontend configuration
│   └── README.md               # Frontend documentation
│
├── internals/                  # Internal configurations
│   └── appscript.txt           # Google Apps Script
│
└── Root Documentation Files
    ├── QUICKSTART.md           # Quick start guide
    ├── ARCHITECTURE.md         # System architecture
    ├── BACKEND_SETUP.md        # Backend setup guide
    ├── MIGRATION_COMPLETE.md   # Migration summary
    ├── README.md               # Project overview
    ├── .gitignore              # Git ignore rules
    └── cleanup.ps1             # Cleanup script
```

## Quick Start

### Install & Run Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs at: `http://localhost:5000`

### Install & Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

### Start MongoDB
```bash
mongod
```
Database runs at: `mongodb://localhost:27017`

## Environment Setup

### Backend (.env)
Located at: `backend/.env`
```
MONGODB_URI=mongodb://localhost:27017/vijay-cashew
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
Located at: `frontend/.env`
```
VITE_API_URL=http://localhost:5000/api
```

## Project Features

### Backend API
- User authentication (JWT)
- Product management
- Shopping cart
- Orders
- Wishlist
- Testimonials
- Delivery tracking

### Frontend UI
- User registration/login
- Product browsing
- Shopping cart
- Order management
- Testimonials
- Reviews

## Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Backend installation
- **[backend/README.md](./backend/README.md)** - API reference
- **[frontend/README.md](./frontend/README.md)** - Frontend guide

## Next Steps

1. Ensure MongoDB is installed and running
2. Install dependencies in both folders
3. Start both backend and frontend servers
4. Visit `http://localhost:5173` in your browser
5. Register a test user and explore features

---

Happy coding! 🚀
