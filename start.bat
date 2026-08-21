@echo off
title CVForge Dev Server

echo.
echo ============================================
echo          CVForge Dev Server
echo ============================================
echo.

REM Detect LAN IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| head -1') do set LAN_IP=%%a
set LAN_IP=%LAN_IP: =%

if "%LAN_IP%"=="" set LAN_IP=localhost

echo  Your LAN IP: %LAN_IP%
echo.
echo  -------------------------------------------
echo   Open on this device:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000/api
echo.
echo   Open on OTHER devices (same WiFi):
echo    Frontend: http://%LAN_IP%:5173
echo    Backend:  http://%LAN_IP%:5000/api
echo  -------------------------------------------
echo.

echo  Starting Backend (port 5000)...
start "CVForge Backend" cmd /k "cd backend && node src/server.js"

timeout /t 2 /nobreak >nul

echo  Starting Frontend (port 5173)...
start "CVForge Frontend" cmd /k "cd frontend && npx vite --host 0.0.0.0"

echo.
echo  Both servers started!
echo  Close the terminal windows to stop servers.
echo.
pause
