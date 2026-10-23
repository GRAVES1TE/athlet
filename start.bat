@echo off
chcp 65001 >nul
echo ========================================================
echo   ⚡ АТЛЕТ — Домашние Тренировки (Сервер запущен)
echo ========================================================
echo.
echo 1. На компьютере открой в браузере:
echo    http://localhost:8080
echo.
echo 2. На iPhone (подключенном к тому же Wi-Fi) открой Safari:
echo    http://192.168.1.105:8080
echo.
echo 3. В Safari нажми "Поделиться" (квадрат со стрелкой вверх)
echo    и выбери "На экран Домой" (Add to Home Screen).
echo.
echo Нажми Ctrl+C для остановки.
echo.
python -m http.server 8080
pause
