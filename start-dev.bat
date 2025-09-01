@echo off
echo ========================================
echo  Iniciando Sistema de Agendamento MVP
echo ========================================
echo.
echo Instalando dependencias se necessario...
echo.

REM Verificar se node_modules existe no root
if not exist "node_modules" (
    echo Instalando concurrently...
    npm install
)

REM Verificar se requirements estão instalados no backend
cd backend
if not exist "venv" (
    echo Criando ambiente virtual Python...
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)
cd ..

REM Verificar se node_modules existe no frontend
cd frontend
if not exist "node_modules" (
    echo Instalando dependencias do frontend...
    npm install
)
cd ..

echo.
echo ========================================
echo  Iniciando Backend (Flask) + Frontend (React)
echo ========================================
echo.
echo Backend rodara em: http://localhost:5000
echo Frontend rodara em: http://localhost:5173
echo.
echo Pressione Ctrl+C para parar ambos os servidores
echo.

npm run dev

pause