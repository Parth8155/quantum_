#!/bin/bash

echo "🚀 Deploying QuantumPlayground to Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔍 Running pre-deployment checks..."

# Check if build works
echo "  ✅ Testing build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "  ✅ Build successful!"

# Check environment variables
if [ ! -f .env.local ]; then
    echo "⚠️  No .env.local found. Make sure to add environment variables in Vercel dashboard:"
    echo "    - IBM_QUANTUM_API_TOKEN"
    echo "    - NEXTAUTH_SECRET"
    echo "    - NEXTAUTH_URL"
    echo ""
fi

echo "🚀 Deploying to production..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Your QuantumPlayground is now live!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Test your quantum backend APIs"
    echo "  2. Verify IBM Quantum integration"
    echo "  3. Share your quantum playground with the world!"
    echo ""
    echo "🔗 Don't forget to:"
    echo "  - Add environment variables in Vercel dashboard"
    echo "  - Test the /api/quantum/test-connection endpoint"
    echo "  - Monitor function logs for any issues"
else
    echo "❌ Deployment failed! Check the error messages above."
    exit 1
fi
