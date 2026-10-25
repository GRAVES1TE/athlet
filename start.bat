@echo off
chcp 65001 >nul
echo ========================================================
echo   ⚡ АТЛЕТ — Домашние Тренировки (PWA сервер)
echo ========================================================
echo.
echo 1. На компьютере открой в браузере:
echo    http://localhost:8080
echo.
echo 2. На iPhone (подключенном к той же сети Wi-Fi):
for /f "tokens=4" %%a in ('route print ^| findstr 0.0.0.0.*0.0.0.0') do (
    set LOCAL_IP=%%a
    goto :ip_found
)
:ip_found
if defined LOCAL_IP (
    echo    http://%LOCAL_IP%:8080
) else (
    echo    http://192.168.1.105:8080
)
echo.
echo 3. В Safari нажми "Поделиться" -^> "На экран Домой"
echo.
echo Нажми Ctrl+C для остановки сервера.
echo.
python -m http.server 8080
pause
