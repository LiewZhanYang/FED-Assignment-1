@echo off
echo ============================================
echo  Popular Bookstore - Angular Application
echo ============================================
echo.

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting development server...
echo Application will open at http://localhost:4200
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
pause
