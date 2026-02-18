#!/bin/bash

echo "🚀 Deploying to Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI is not installed."
    echo "📦 Installing Vercel CLI globally..."
    npm install -g vercel
    echo ""
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Test build locally first
echo "🔨 Testing build locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Deploying to Vercel..."
    vercel --prod
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi
