import subprocess
import time
import urllib.request
import os
import signal

PORT = 8000
SUBDOMAIN = "skin-cancer-hud-api"
HEALTH_URL = f"https://{SUBDOMAIN}.loca.lt/health"

def kill_process(proc):
    if proc:
        try:
            print("Killing process group...")
            os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
            time.sleep(2)
        except Exception as e:
            print(f"Error killing process group: {e}")

def check_health():
    try:
        req = urllib.request.Request(
            HEALTH_URL, 
            headers={"bypass-tunnel-reminder": "true"}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.getcode()
            content = response.read().decode('utf-8')
            if status == 200 and '"status"' in content:
                return True
    except Exception as e:
        print(f"Health check failed: {e}")
    return False

def main():
    print("Starting Localtunnel Watchdog...")
    proc = None
    while True:
        # Check if the process is running
        if proc is None or proc.poll() is not None:
            print("Localtunnel process is not running. Starting new instance...")
            cmd = f"npx localtunnel --port {PORT} --subdomain {SUBDOMAIN}"
            proc = subprocess.Popen(cmd, shell=True, preexec_fn=os.setsid)
            time.sleep(8)  # Wait for tunnel to establish
            continue

        # Check health of the tunnel
        if not check_health():
            print("Tunnel is unresponsive or returned 503. Restarting...")
            kill_process(proc)
            proc = None
            time.sleep(5)
        else:
            print("Tunnel is healthy.")
            time.sleep(20)

if __name__ == "__main__":
    main()
