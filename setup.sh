#!/bin/bash

# SWAG Wheels - Complete Setup Script

echo "🚀 SWAG Wheels Car Rental System - Setup Script"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Install from: https://www.mongodb.com/try/download/community"
    echo "    Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
else
    echo "✅ MongoDB is installed"
fi

echo ""
echo "📦 Setting up Backend..."
echo "========================"

# Backend setup
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed"
fi

# Create .env from example
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ Backend .env created"
    echo "⚠️  Please edit backend/.env with your configuration"
else
    echo "Backend .env already exists"
fi

cd ..

echo ""
echo "🎨 Setting up Frontend..."
echo "=========================="

# Frontend setup
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

# Create .env.local from example
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > .env.local << 'EOF'
VITE_BACKEND_URL=http://localhost:5005
EOF
    echo "✅ Frontend .env.local created"
else
    echo "Frontend .env.local already exists"
fi

echo ""
echo "✨ Setup Complete!"
echo "==================="
echo ""
echo "Next steps:"
echo ""
echo "1. MongoDB Setup:"
echo "   • Local: Run 'mongod' in a new terminal"
echo "   • Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
echo ""
echo "2. Configure Backend (.env):"
echo "   • Edit: backend/.env"
echo "   • Set MONGODB_URI, JWT_SECRET, WHATSAPP_PHONE_NUMBER"
echo "   • Set admin credentials"
echo ""
echo "3. Start Backend:"
echo "   • cd backend && npm run dev"
echo "   • Runs on: http://localhost:5005"
echo ""
echo "4. Start Frontend:"
echo "   • npm run dev"
echo "   • Runs on: http://localhost:5173"
echo ""
echo "5. Access Admin Panel:"
echo "   • Go to: http://localhost:5173/admin"
echo "   • Email: admin@swagwheels.com"
echo "   • Password: (from .env ADMIN_PASSWORD)"
echo ""
echo "📚 Documentation:"
echo "   • Setup Guide: SETUP_GUIDE.md"
echo "   • API Docs: API_DOCUMENTATION.md"
echo ""
echo "Happy coding! 🎉"
