@echo off
echo Installing Local PC Remote Service...
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.
echo Installing service...
py -3.12 runremote.py install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install service!
    echo Make sure you're running as Administrator and Python 3.12 is installed.
    pause
    exit /b 1
)

echo Service installed successfully!
echo.
echo Configuring service for auto-start...
sc config LocalPCRemote start= auto
if %errorlevel% neq 0 (
    echo ERROR: Failed to configure auto-start!
    pause
    exit /b 1
)

echo Auto-start configured successfully!
echo.
echo Starting service...
py -3.12 runremote.py start
if %errorlevel% neq 0 (
    echo ERROR: Failed to start service!
    pause
    exit /b 1
)

echo Service started successfully!
echo.
echo Service Status:
sc query LocalPCRemote
echo.

echo Installation complete!
echo Your Local PC Remote service is now running and will start automatically on boot.
echo Access the web interface at: http://localhost:8000
echo.
pause