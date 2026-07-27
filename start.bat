@echo off
echo Starting AI Construction Cost Estimation...
echo.

echo Starting Backend Server (Port 8000)...
start "Backend" cmd /k "cd /d %~dp0backend && py -3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

timeout /t 2 /nobreak >nul

echo Starting Frontend Server (Port 5173)...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo.
echo Frontend: http://localhost:5173/
echo Backend:  http://localhost:8000/
echo ========================================
echo.
echo Press any key to exit (servers will keep running)...
pause >nul
