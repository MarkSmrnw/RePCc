# RePCc
RePCc (Remote PC Control) is a little project to make my PC remotely controlled from my phone via WebUI.


## Installation guide

### You will need python 3.12.5 for this.

Here are the steps:
- Run the batch inside of `/scripts/`, called `enable.bat`. This will create a shortcut inside of Startup apps inside of `%APPDATA%/Microsoft/Windows/Start Menu/Programs/Startup`
- After running, the webserver and command handler should always deploy windowless.
- You can access the WEBUI via `[SERVER-IP]:8000`

Notes:
- The script automatically creates firewall rules for PRIVATE NETWORKS. If you cant access the remote via IP:8000, make sure your servers network is set to PRIVATE!


## Removal guide

- Run the `disable.bat` batch inside of scripts, it'll remove everything, including the firewall rules.
