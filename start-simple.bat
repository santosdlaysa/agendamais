@echo off
echo Iniciando Backend e Frontend...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Pressione Ctrl+C para parar
echo.

start "Backend Flask" cmd /k "cd backend && python run.py"
timeout /t 3 /nobreak > nul
start "Frontend React" cmd /k "cd frontend && npm run dev"

echo Ambos os servidores foram iniciados em janelas separadas
pause