@echo off
setlocal enabledelayedexpansion

echo.
echo ====================================
echo   Zoro Zipa Docker Startup Script
echo ====================================
echo.

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo [SUCCESS] .env created. Please edit it with your configuration.
        echo [INFO] Edit .env and set MAIL_USERNAME and MAIL_PASSWORD
        echo.
    ) else (
        echo [ERROR] .env.example not found!
        exit /b 1
    )
)

REM Create directories if they don't exist
if not exist data mkdir data
if not exist uploads mkdir uploads

echo [INFO] Building Docker images...
docker-compose build --no-cache

if errorlevel 1 (
    echo [ERROR] Build failed
    exit /b 1
)

echo [SUCCESS] Build successful
echo.

echo [INFO] Starting containers...
docker-compose up -d

if errorlevel 1 (
    echo [ERROR] Failed to start containers
    exit /b 1
)

echo [SUCCESS] Containers started
echo.

echo [INFO] Waiting for services to be ready...
timeout /t 10 /nobreak

echo.
docker-compose ps
echo.

echo [SUCCESS] Zoro Zipa is now running!
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8080
echo Uploads:   http://localhost:80/uploads
echo.
echo [INFO] View logs: docker-compose logs -f
echo [INFO] Stop: docker-compose down
echo.
