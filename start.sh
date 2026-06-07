#!/bin/bash
echo "🚀 Starting ShopEase..."

# Start backend
echo "📡 Starting backend server..."
cd backend && node server.js &
BACKEND_PID=$!

sleep 2

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ShopEase is running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Frontend:  http://localhost:5173"
echo "🔌 Backend:   http://localhost:5000"
echo "📊 Admin:     http://localhost:5173/admin"
echo "🚚 Delivery:  http://localhost:5173/delivery"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop all servers"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
