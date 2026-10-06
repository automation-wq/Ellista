@echo off
cd /d "%~dp0"
if "%~1"=="serve" goto serve
rem Optional services (remove "rem" and fill in): SMS through Twilio and Google sign-in. See README.md.
rem set TWILIO_ACCOUNT_SID=ACxxxxxxxx
rem set TWILIO_AUTH_TOKEN=xxxxxxxx
rem set TWILIO_FROM=+1xxxxxxxxxx
rem set GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
rem set BREVO_API_KEY=xkeysib-xxxx
rem set MAIL_FROM=you@yourdomain.com
rem set OTP_DEMO=1   (shows sign-in codes on the page for a client walkthrough; remove before real customers use the site)
where node >nul 2>nul || (echo Node.js is not installed. Download it from https://nodejs.org and run this again. & pause & exit /b 1)
if exist data\products.json echo Keeping existing store data in the data folder.
echo Starting Mytekkstore store... keep this window open while using the site.
start "Mytekkstore store" /min cmd /c ""%~f0" serve"
:wait
ping -n 2 127.0.0.1 >nul
curl -s -o nul http://localhost:3000/api/products || goto wait
start "" http://localhost:3000
echo Store is running at http://localhost:3000  (admin login: data\ADMIN_LOGIN.txt)
echo Close the minimized "Mytekkstore store" window to stop it.
exit /b

:serve
rem Runs in the minimized window. If the store ever stops (a crash, killed, any reason) it starts again after 3 seconds.
rem Exit code 0 means the port is in use, so another copy is already running: close quietly. Exit code 2 means a damaged data file: wait for you.
node server.js
if "%errorlevel%"=="0" exit /b
if "%errorlevel%"=="2" (pause & exit /b)
echo The store stopped unexpectedly (code %errorlevel%), starting it again in 3 seconds...
timeout /t 3 /nobreak >nul
goto serve
