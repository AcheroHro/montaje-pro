@echo off
title MONTAJE-PRO - Servidor + Tunel Movil
echo ====================================================
echo   INICIANDO SERVIDOR Y TUNEL HTTPS PARA EL MOVIL
echo ====================================================
echo.
start /B node server.js
timeout /t 2 >nul
echo.
echo Conectando tunel publico seguro HTTPS...
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:localhost:8080 nokey@localhost.run
pause
