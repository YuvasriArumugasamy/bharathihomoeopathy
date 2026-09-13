@echo off
echo ====================================================
echo Starting Dr. Bharathi's Homeo Care Local Servers...
echo ====================================================

:: Set execution policy & environment path
set "PATH=%PATH%;%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64"

:: Start Backend
start "Backend Server (Port 5000)" cmd /k "cd /d %~dp0backend && node server.js"

:: Start Frontend
start "Frontend Vite (Port 5173)" cmd /k "cd /d %~dp0 && npm.cmd run dev"

echo.
echo Both servers are starting up!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api/health
echo ====================================================
pause
