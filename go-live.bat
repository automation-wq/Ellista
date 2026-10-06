@echo off
cd /d "%~dp0"
rem Puts the running store on a public https address for a demo, through Cloudflare's free quick tunnel (no account, no cost).
rem Start the store with start.bat first. Keep this window open while people look at the site; close it to go offline again.
curl -s -o nul http://localhost:3000/api/products || (echo Start the store first with start.bat, then run this again. & pause & exit /b 1)
set "CF=cloudflared"
where cloudflared >nul 2>nul || set "CF=%LOCALAPPDATA%\Microsoft\WinGet\Links\cloudflared.exe"
if not exist "%CF%" if "%CF%" neq "cloudflared" (
  echo Installing cloudflared, one time only...
  winget install --id Cloudflare.cloudflared -e --accept-source-agreements --accept-package-agreements
  if not exist "%CF%" (echo Could not install cloudflared. Download it from https://github.com/cloudflare/cloudflared/releases and run it with: cloudflared tunnel --url http://localhost:3000 & pause & exit /b 1)
)
echo.
echo Your public address appears below as https://....trycloudflare.com - share it with the client.
echo.
"%CF%" tunnel --url http://localhost:3000
pause
