@echo off
echo 🚀 Deploying QuantumPlayground to Vercel...
echo.

REM Check if vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

echo 🔍 Running pre-deployment checks...

REM Check if build works
echo   ✅ Testing build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

echo   ✅ Build successful!

REM Check environment variables
if not exist .env.local (
    echo ⚠️  No .env.local found. Make sure to add environment variables in Vercel dashboard:
    echo     - IBM_QUANTUM_API_TOKEN
    echo     - NEXTAUTH_SECRET
    echo     - NEXTAUTH_URL
    echo.
)

echo 🚀 Deploying to production...
vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo 🌐 Your QuantumPlayground is now live!
    echo.
    echo 📋 Next steps:
    echo   1. Test your quantum backend APIs
    echo   2. Verify IBM Quantum integration
    echo   3. Share your quantum playground with the world!
    echo.
    echo 🔗 Don't forget to:
    echo   - Add environment variables in Vercel dashboard
    echo   - Test the /api/quantum/test-connection endpoint
    echo   - Monitor function logs for any issues
) else (
    echo ❌ Deployment failed! Check the error messages above.
    pause
    exit /b 1
)

echo.
pause
