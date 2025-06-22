@echo off

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo Disabling Local PC Remote Startup Application...
echo Running with administrator privileges.
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Stopping running Local PC Remote process...
taskkill /F /IM pythonw.exe /FI "WINDOWTITLE eq *runstartup.pyw*" 2>nul
if %errorlevel% equ 0 (
    echo Process stopped successfully.
) else (
    echo No running process found or failed to stop process.
    echo Attempting to stop all pythonw.exe processes...
    taskkill /F /IM pythonw.exe 2>nul
    if %errorlevel% equ 0 (
        echo All pythonw.exe processes stopped.
    ) else (
        echo No pythonw.exe processes found.
    )
)

echo.

set "startup_folder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "shortcut_path=%startup_folder%\LocalPCRemote.lnk"

echo Removing startup shortcut...
if exist "%shortcut_path%" (
    del "%shortcut_path%"
    if %errorlevel% equ 0 (
        echo Startup shortcut removed successfully.
    ) else (
        echo Failed to remove startup shortcut.
    )
) else (
    echo Startup shortcut not found.
)

echo.

echo Removing firewall rules...
netsh advfirewall firewall delete rule name="Local PC Remote" 2>nul
netsh advfirewall firewall delete rule name="Local PC Remote 8080" 2>nul
echo Firewall rules removed (if they existed).

echo.

echo Verifying removal...
if exist "%shortcut_path%" (
    echo WARNING: Startup shortcut still exists at: %shortcut_path%
) else (
    echo Startup shortcut successfully removed.
)

tasklist /FI "IMAGENAME eq pythonw.exe" | find /I "pythonw.exe" >nul
if %errorlevel% equ 0 (
    echo WARNING: pythonw.exe processes are still running.
    echo You may need to manually end them in Task Manager.
) else (
    echo No pythonw.exe processes found - application stopped.
)

echo.
echo Local PC Remote startup application has been disabled.
echo The application will no longer start automatically on login.
echo.
pause