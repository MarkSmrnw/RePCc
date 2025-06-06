import win32serviceutil
import servicemanager
import win32service
import win32event
import sys
import os
import subprocess
import threading
import time

sys.path.append(os.path.dirname(__file__))
from localremotehandler import create_log_file, write_to_log, start_server, stop_server

class LocalRemoteService(win32serviceutil.ServiceFramework):
    _svc_name_ = "LocalPCRemote"
    _svc_display_name_ = "Local computer remote"
    _svc_description_ = "WebUI remote used for controlling your Desktop using a phone."

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)
        self.is_alive = True
        self.server_thread = None

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        write_to_log("Service stop requested")
        self.is_alive = False
        
        # Stop the server
        try:
            stop_server()
        except:
            pass
            
        win32event.SetEvent(self.hWaitStop)

    def SvcDoRun(self):
        servicemanager.LogMsg(servicemanager.EVENTLOG_INFORMATION_TYPE,
                              servicemanager.PYS_SERVICE_STARTED,
                              (self._svc_name_,''))
        
        try:
            subprocess.run([
                "netsh", "advfirewall", "firewall", "add", "rule",
                "name=Local PC Remote", "dir=in", "action=allow",
                "protocol=TCP", "localport=8000"
            ], check=False)
        except:
            pass 
        
        create_log_file()
        write_to_log("Service started")

        # Start server in a separate thread
        self.server_thread = threading.Thread(target=self._run_server)
        self.server_thread.daemon = True
        self.server_thread.start()

        # Wait for stop signal
        while self.is_alive:
            if win32event.WaitForSingleObject(self.hWaitStop, 1000) == win32event.WAIT_OBJECT_0:
                break

        write_to_log("Service stopping")

    def _run_server(self):
        try:
            start_server()
        except Exception as E:
            write_to_log(f"Service error: {str(E)}", "ERROR")

if __name__ == "__main__":
    win32serviceutil.HandleCommandLine(LocalRemoteService)