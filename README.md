# RePCc
RePCc (Remote PC Control) is a little project to make my PC remotely controlled from my phone via WebUI.


## Installation Guide

!!! GUIDE IS OUT OF DATE !!!

Here are the steps:
- Install the project and navigate to `./scripts/` inside the RePCc directory.
- Run the `installservice.bat` file as administrator. This will install a Windows service that hosts the web server and handles requests.
- You are all set! Access the WebUI using `[HOST_PC_IP]:8000`

The service will automatically configure to run on boot (DELAYED-AUTO).
You can uninstall or stop the service by:

- Running the `uninstallservice.bat` file inside `./scripts/` as administrator

You may need to reboot your PC.
