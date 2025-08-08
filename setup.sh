#!/bin/bash

# Test School Setup Script
echo "🚀 Setting up Test School Competency Assessment Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) and try again."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend
echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please configure your environment variables in backend/.env file"
fi

cd ..

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd frontend
echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your environment variables in backend/.env"
echo "2. Make sure MongoDB is running"
echo "3. Start the backend server: cd backend && npm run dev"
echo "4. Start the frontend server: cd frontend && npm start"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5000"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
