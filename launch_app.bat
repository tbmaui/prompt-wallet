@echo off
setlocal
title PromptWallet Launcher

cd /d "%~dp0"

echo ========================================================
echo        PromptWallet Launcher
echo ========================================================

echo Starting Server...
:: Start npm run dev in a MINIMIZED window so it doesn't clutter
start "PromptWallet Server" /min cmd /c "npm run dev"

echo Waiting for server to initialize...
:: Wait 4 seconds
timeout /t 4 >nul

echo Opening Browser...
:: Open localhost:3000 (Vite's default when 5173 is taken or configured)
start http://localhost:3000

:: Optional: Close this launcher window automatically
exit
