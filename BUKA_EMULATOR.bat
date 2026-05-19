@echo off
title LayanDesa Mobile — Build & Emulator
color 0A
cd /d "%~dp0"

echo.
echo  ==========================================
echo   LAYANDESA MOBILE — Build untuk Emulator
echo  ==========================================
echo.

REM Cek node_modules
if not exist "node_modules" (
  echo  [1] Install dependencies...
  call npm install
  echo.
)

echo  [1] Sync Capacitor...
call npx cap sync android
echo.

echo  [2] Buka Android Studio (jalankan di emulator dari sana)...
call npx cap open android

echo.
echo  ==========================================
echo   Android Studio akan terbuka.
echo   Klik tombol RUN (segitiga hijau) untuk
echo   menjalankan di emulator.
echo  ==========================================
echo.
pause
