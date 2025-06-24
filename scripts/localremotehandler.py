import socketserver
import http.server
import threading
import datetime
import win32gui
import win32api
import json
import os

from flask import Flask, jsonify, request
from flask_cors import CORS

PORT = 8000
FLASKPORT = 8080
LOG_FILE_PATH = None
httpd = None  # Global reference to server

class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        webui_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "webui")
        super().__init__(*args, directory=webui_dir, **kwargs)
    
    def log_message(self, format, *args):
        pass

    def do_GET(self):
        if self.path == "/":
            write_to_log(f"HTTP: serving ui.html to client {self.client_address[0]}")
            self.path = "/ui.html"
        return super().do_GET()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

def write_to_log(message, level="INFO"):
    """Writes a message to the most recent log file."""
    global LOG_FILE_PATH
    if LOG_FILE_PATH and os.path.exists(LOG_FILE_PATH):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(LOG_FILE_PATH, "a") as log_file:
            log_file.write(f"[{timestamp}] [{level}] {message}\n")

def create_log_file():
    """Creates new latest log file."""

    global LOG_FILE_PATH

    script_dir = os.path.dirname(os.path.abspath(__file__))
    logs_dir = os.path.join(script_dir, "logs")
    os.makedirs(logs_dir, exist_ok=True)

    latest_path = os.path.join(logs_dir, "latest.log")

    if os.path.exists(latest_path):
        counter = 1
        while True:
            numbered_path = os.path.join(logs_dir, f"{counter}.log")
            if not os.path.exists(numbered_path):
                os.rename(latest_path, numbered_path)
                break
            counter+=1

    with open(latest_path, "w") as log_file:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_file.write(f"[{timestamp}] [INFO] LOG FILE CREATED\n")

    LOG_FILE_PATH = latest_path
    return latest_path

# REQUESTS

flask_app = Flask(__name__)
CORS(flask_app)

@flask_app.route('/ctl/shutdown')
def shutdown():
    write_to_log("Shutdown called..")
    os.system("shutdown -s -t 10")
    return jsonify({'message':'Shutdown success.'}), 200

@flask_app.route('/mouse/getpos')
def getMousePos():
    write_to_log("Getting mouse position..")
    try:
        cursor_pos = win32gui.GetCursorPos()
        write_to_log(cursor_pos)
        return jsonify({"position":cursor_pos}), 200
    except Exception as E:
        write_to_log(str(E), "ERROR")
        return jsonify({"error":str(E)}), 500
    
@flask_app.route('/mouse/setpos/<int:x>/<int:y>', methods=['POST'])
def setMousePos(x,y):
    write_to_log(f"Setting mouse pos to {x}, {y}")
    try:
        win32api.SetCursorPos((x,y))
        return jsonify({"message":"Successfully set cursor pos"}), 200
    except Exception as E:
        write_to_log(str(E), "ERROR")
        return jsonify({'error':str(E)}), 500
    
@flask_app.route('/actions/postnew', methods=['POST'])
def makeNewAction():
    ''' Data:
        - mouse pos 
        - label

        {
            "name":"LABEL",
            "pos":{
                "x":x,
                "y":y
            }
        }
    '''

    write_to_log("Request recieved to POST new action.")

    try:
        if request.is_json:
            data = request.json

            write_to_log(data)

            if data["name"] and data["pos"] and data["pos"]["x"] and data["pos"]["y"]:

                script_dir = os.path.dirname(__file__)
                actions_dir = os.path.join(script_dir, "actions")
                json_file_path = os.path.join(actions_dir, f"{data['name']}.json")

                if os.path.exists(json_file_path):
                    write_to_log("Requested name for action already exsists.")
                    return jsonify({'error':'bad name'}), 403
                else:
                    write_to_log("Requested name for action is avalible.")

                    with open(json_file_path, "w")as file:
                        json.dump(data, file, indent=2)

                        file.close()

                    write_to_log("New actions file created.")

                    return jsonify({'message':'missing items'}), 200
            else:
                write_to_log("Request has missing items. 400", "WARN")
                return jsonify({'error':'missing items'}), 400
        else:
            write_to_log("Request is not json. 400", "WARN")
            return jsonify({'error':'not json'}), 400
    except Exception as E:

        write_to_log(str(E), "ERROR")
        return jsonify({'error':str(E)}), 500

def start_server():
    global httpd
    try:
        write_to_log("Starting server")
        httpd = socketserver.ThreadingTCPServer(("0.0.0.0", PORT), QuietHTTPRequestHandler)
        write_to_log(f"Starting server on port {PORT}")
        write_to_log(f"Serving directory: {os.path.join(os.path.dirname(os.path.dirname(__file__)), 'webui')}")
        httpd.serve_forever()
    except Exception as E:
        write_to_log(f"Server failed to start: {str(E)}", "ERROR")
        raise

def stop_server():
    global httpd
    if httpd:
        write_to_log("Stopping server")
        httpd.shutdown()
        httpd.server_close()
        write_to_log("Server stopped")

def flask_run():
    write_to_log("Starting FLASK")
    write_to_log(f"Running FLASK on port {FLASKPORT}")
    flask_app.run(debug=False, host="0.0.0.0", port=FLASKPORT)

def run():
    write_to_log("Application started")

    write_to_log("Running version DEV 0.02")

    server_thread = threading.Thread(target=start_server, daemon=True)
    api_thread = threading.Thread(target=flask_run, daemon=True)
    server_thread.start()
    api_thread.start()

    try:
        # Wait for both threads
        while server_thread.is_alive() or api_thread.is_alive():
            threading.Event().wait(1)
    except KeyboardInterrupt:
        write_to_log("Server stopped.", "INFO")
    finally:
        stop_server()
        write_to_log("Application shutdown complete")

if __name__ == "__main__":
    create_log_file()
    run()