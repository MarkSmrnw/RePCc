@echo off
echo Installing Local PC Remote as Invisible Startup Application...
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

set "startup_folder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "target_path=%CD%\runstartup.pyw"
set "shortcut_path=%startup_folder%\LocalPCRemote.lnk"

echo Creating invisible startup shortcut...
for /f "tokens=*" %%i in ('py -3.12 -c "import sys; print(sys.executable)"') do set PYTHON_PATH=%%i
set PYTHONW_PATH=%%PYTHON_PATH:python.exe=pythonw.exe%%
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%shortcut_path%'); $Shortcut.TargetPath = '%PYTHONW_PATH%'; $Shortcut.Arguments = '\"%target_path%\"'; $Shortcut.WorkingDirectory = '%CD%'; $Shortcut.WindowStyle = 7; $Shortcut.Save()}"

if %errorlevel% neq 0 (
    echo ERROR: Failed to create startup shortcut!
    pause
    exit /b 1
)

echo Startup shortcut created successfully!
echo.

echo Setting up firewall rules...
netsh advfirewall firewall add rule name="Local PC Remote" dir=in action=allow protocol=TCP localport=8000
netsh advfirewall firewall add rule name="Local PC Remote 8080" dir=in action=allow protocol=TCP localport=8080

echo.
echo Starting application invisibly...
echo Testing Python installation...
py -3.12 --version
if %errorlevel% neq 0 (
    echo ERROR: Python 3.12 not found!
    pause
    exit /b 1
)

echo Finding Python installation path...
for /f "tokens=*" %%i in ('py -3.12 -c "import sys; print(sys.executable)"') do set PYTHON_PATH=%%i
set PYTHONW_PATH=%PYTHON_PATH:python.exe=pythonw.exe%

echo Python path: %PYTHON_PATH%
echo Pythonw path: %PYTHONW_PATH%

echo Starting invisible process...
start "" "%PYTHONW_PATH%" runstartup.pyw

echo Waiting for process to start...
timeout /t 3 /nobreak >nul

echo Checking if process is running...
tasklist /FI "IMAGENAME eq pythonw.exe" | find /I "pythonw.exe" >nul
if %errorlevel% equ 0 (
    echo Process started successfully and running invisibly!
) else (
    echo Warning: Process may not have started properly.
    echo Check Task Manager for pythonw.exe processes.
)

echo.
echo Installation complete!
echo Local PC Remote will now start invisibly when you log in.
echo Access the web interface at: http://localhost:8000
echo.
echo To stop the application, use Task Manager to end 'pythonw.exe' process.
pause
