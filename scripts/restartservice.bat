@echo off
echo Restarting LocalPCRemote service...

echo Stopping LocalPCRemote service...
net stop "LocalPCRemote"
if %errorlevel% neq 0 (
    echo Failed to stop service or service was not running
) else (
    echo Service stopped successfully
)

echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo Starting LocalPCRemote service...
net start "LocalPCRemote"
if %errorlevel% neq 0 (
    echo Failed to start service
    pause
    exit /b 1
) else (
    echo Service started successfully
)

echo LocalPCRemote service restarted successfully!
pause