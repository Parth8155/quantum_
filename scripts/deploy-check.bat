@echo off
echo 🚀 Preparing for deployment...
echo.

echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 goto error

echo.
echo 🔍 Running type check...
npm run type-check
if %errorlevel% neq 0 goto error

echo.
echo 🧹 Running linter...
npm run lint
if %errorlevel% neq 0 goto error

echo.
echo 🏗️ Building application...
npm run build
if %errorlevel% neq 0 goto error

echo.
echo ✅ Build completed successfully!
echo 📋 Deployment checklist:
echo    ✓ Dependencies installed
echo    ✓ TypeScript compilation passed
echo    ✓ Linting passed
echo    ✓ Production build created
echo.
echo 🌐 Ready for deployment!
echo    • Vercel: vercel --prod
echo    • Netlify: netlify deploy --prod
echo    • Custom: npm start
echo.
echo ⚠️  Don't forget to set environment variables:
echo    • IBM_QUANTUM_API_TOKEN
echo    • NEXTAUTH_SECRET
echo    • NEXTAUTH_URL
goto end

:error
echo.
echo ❌ Build failed! Please fix the errors above.
exit /b 1

:end
echo.
pause
