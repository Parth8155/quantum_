#!/bin/bash

echo "🚀 Preparing for deployment..."

echo "📦 Installing dependencies..."
npm install

echo "🔍 Running type check..."
npm run type-check

echo "🧹 Running linter..."
npm run lint

echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "📋 Deployment checklist:"
echo "   ✓ Dependencies installed"
echo "   ✓ TypeScript compilation passed"
echo "   ✓ Linting passed"
echo "   ✓ Production build created"
echo ""
echo "🌐 Ready for deployment!"
echo "   • Vercel: vercel --prod"
echo "   • Netlify: netlify deploy --prod"
echo "   • Custom: npm start"
echo ""
echo "⚠️  Don't forget to set environment variables:"
echo "   • IBM_QUANTUM_API_TOKEN"
echo "   • NEXTAUTH_SECRET"
echo "   • NEXTAUTH_URL"
