@echo off
echo Uninstalling Local PC Remote Service...
echo.
cd /d "%~dp0"

echo Current directory: %CD%
echo.

sc query LocalPCRemote >nul 2>&1
if %errorlevel% neq 0 (
    echo Service 'LocalPCRemote' is not installed.
    echo Nothing to uninstall.
    pause
    exit /b 0
)

echo Stopping service...
py -3.12 runremote.py stop
if %errorlevel% neq 0 (
    echo Warning: Could not stop service normally, trying force stop...
    sc stop LocalPCRemote
    timeout /t 5 /nobreak >nul
)

echo Service stopped (or was already stopped).
echo.

echo Removing service...
py -3.12 runremote.py remove
if %errorlevel% neq 0 (
    echo Warning: Could not remove service using Python script, trying direct removal...
    sc delete LocalPCRemote
    if %errorlevel% neq 0 (
        echo ERROR: Failed to remove service!
        echo The service may be marked for deletion. Try rebooting and running this script again.
        pause
        exit /b 1
    )
)

echo Service removed successfully!
echo.

echo Removing firewall rule...
netsh advfirewall firewall delete rule name="Local PC Remote" >nul 2>&1
if %errorlevel% equ 0 (
    echo Firewall rule removed successfully!
) else (
    echo Firewall rule not found or already removed.
)
echo.
echo Cleaning up any remaining processes...
taskkill /f /im python.exe /fi "WINDOWTITLE eq LocalPCRemote*" >nul 2>&1

echo.
echo Uninstallation complete!
echo The Local PC Remote service has been completely removed.
echo.
sc query LocalPCRemote >nul 2>&1
if %errorlevel% neq 0 (
    echo ✓ Service successfully removed from system.
) else (
    echo ⚠ Service may still be marked for deletion. Reboot may be required.
)

echo.
pause