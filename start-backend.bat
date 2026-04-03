@echo off
echo =============================================
echo   Akshaya Bank - Starting Backend Server
echo =============================================
echo.
echo [1/2] Building Spring Boot application...
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Maven build failed!
    pause
    exit /b 1
)
echo.
echo [2/2] Starting server on http://localhost:8080
echo.
call mvn spring-boot:run
pause
