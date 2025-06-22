import os
import sys
import time
import subprocess

sys.path.append(os.path.dirname(__file__))
from localremotehandler import create_log_file, run

def setup_firewall():
    """Setup firewall rules"""
    try:
        subprocess.run([
            "netsh", "advfirewall", "firewall", "add", "rule",
            "name=Local PC Remote", "dir=in", "action=allow",
            "protocol=TCP", "localport=8000"
        ], check=False, creationflags=subprocess.CREATE_NO_WINDOW)
        
        subprocess.run([
            "netsh", "advfirewall", "firewall", "add", "rule",
            "name=Local PC Remote 8080", "dir=in", "action=allow",
            "protocol=TCP", "localport=8080"
        ], check=False, creationflags=subprocess.CREATE_NO_WINDOW)
    except:
        pass

if __name__ == "__main__":
    time.sleep(5)
    
    create_log_file()
    setup_firewall()
    run()
