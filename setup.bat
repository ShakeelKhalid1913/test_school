@echo off
echo 🚀 Setting up Test School Competency Assessment Platform...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v16 or higher) and try again.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

echo ✅ npm found
npm --version

REM Setup Backend
echo.
echo 📦 Setting up Backend...
cd backend
echo Installing backend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please configure your environment variables in backend\.env file
)

cd ..

REM Setup Frontend
echo.
echo 🎨 Setting up Frontend...
cd frontend
echo Installing frontend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed successfully
cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Configure your environment variables in backend\.env
echo 2. Make sure MongoDB is running
echo 3. Start the backend server: cd backend ^&^& npm run dev
echo 4. Start the frontend server: cd frontend ^&^& npm start
echo.
echo 🌐 The application will be available at:
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:5000
echo.
echo 📚 For more information, check the README.md file
echo.
pause
