#!/bin/bash

echo "🚀 Setting up Sport Stream Project..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Setup database
echo "🗄️ Setting up database..."
npx prisma generate
npx prisma db push

# Install frontend dependencies
echo "🎨 Installing frontend dependencies..."
cd ../frontend
npm install

echo "✅ Setup complete!"
echo ""
echo "🎯 To start the project:"
echo "1. Start backend: cd backend && npm run dev"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Open http://localhost:3000"
