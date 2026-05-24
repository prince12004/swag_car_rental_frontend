#!/bin/bash

# Quick Start - Run both backend and frontend

echo "🚀 SWAG Wheels - Quick Start"
echo "============================"
echo ""
echo "Make sure MongoDB is running!"
echo ""

# Check if both are set up
if [ ! -f "backend/.env" ]; then
    echo "❌ Backend not configured. Run setup.sh first"
    exit 1
fi

if [ ! -f ".env.local" ]; then
    echo "❌ Frontend not configured. Run setup.sh first"
    exit 1
fi

echo "Starting services..."
echo ""

# Start backend in background
echo "📡 Starting Backend on http://localhost:5005"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

sleep 2

# Start frontend
echo "🎨 Starting Frontend on http://localhost:5173"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✨ Services are starting..."
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5005"
echo "Admin:    http://localhost:5173/admin"
echo ""
echo "Press Ctrl+C to stop all services"

# Handle Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Wait for both processes
wait
