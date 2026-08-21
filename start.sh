#!/bin/bash

# ============================================
#  CVForge - Start Development Servers
#  Access from other devices on same WiFi
# ============================================

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║         🚀 CVForge Dev Server             ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Detect LAN IP
if command -v ipconfig &> /dev/null; then
  # Windows
  LAN_IP=$(ipconfig | grep -i "IPv4" | head -1 | awk '{print $NF}')
elif command -v ifconfig &> /dev/null; then
  # macOS / Linux
  LAN_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
else
  LAN_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
fi

LAN_IP=${LAN_IP:-"localhost"}

echo "📡 Your LAN IP: $LAN_IP"
echo ""
echo "┌───────────────────────────────────────────┐"
echo "│  Open on this device:                      │"
echo "│  ➜ Frontend: http://localhost:5173         │"
echo "│  ➜ Backend:  http://localhost:5000/api     │"
echo "│                                           │"
echo "│  Open on OTHER devices (same WiFi):        │"
echo "│  ➜ Frontend: http://$LAN_IP:5173          │"
echo "│  ➜ Backend:  http://$LAN_IP:5000/api      │"
echo "│                                           │"
echo "│  📱 Scan QR code on your phone:           │"
echo "│     (URL shown above)                      │"
echo "└───────────────────────────────────────────┘"
echo ""

# Start backend
echo "🔧 Starting Backend (port 5000)..."
cd backend && node src/server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
echo "🎨 Starting Frontend (port 5173)..."
cd ../frontend && npx vite --host 0.0.0.0 &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers started!"
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "   Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
