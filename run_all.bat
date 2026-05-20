@echo off
title Shivam Nexus Launcher
color 0B
echo =====================================================================
echo  🚀 SHIVAM NEXUS - DUAL LAUNCHER
echo =====================================================================
echo.
echo  Starting Shivam Nexus Backend (FastAPI on Port 8000)...
start "Shivam Nexus Backend" cmd /k "cd backend && uvicorn main:app --port 8000 --reload"

echo  Starting Shivam Nexus Frontend (React/Vite on Port 5173)...
start "Shivam Nexus Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo =====================================================================
echo  ✅ LAUNCH SEQUENCE COMPLETE!
echo.
echo  - Frontend Web UI : http://localhost:5173
echo  - Backend API Gateway : http://localhost:8000/api
echo  - API Documentation : http://localhost:8000/docs
echo =====================================================================
echo.
pause
