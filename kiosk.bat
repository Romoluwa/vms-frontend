@echo off
set URL=%1

if "%URL%"=="" set URL=http://localhost:3000

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0kiosk.ps1" -Url "%URL%"
