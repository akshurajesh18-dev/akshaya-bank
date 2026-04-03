@echo off
echo =============================================
echo   Akshaya Bank - Starting Frontend
echo =============================================
echo.
echo [1/2] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo.
echo [2/2] Starting React app on http://localhost:5173
echo.
call npm run dev
pause
