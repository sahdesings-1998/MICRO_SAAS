@echo off

REM Docusaurus Site Startup Script (Windows)

echo 🚀 Starting Micro-SaaS Documentation Site...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call pnpm install
    echo.
)

REM Check if .docusaurus exists
if not exist ".docusaurus" (
    echo 🔨 Building Docusaurus...
    call pnpm build
    echo.
)

echo ✅ Starting development server...
echo 📍 Documentation site will be available at: http://localhost:3000
echo.

call pnpm start
