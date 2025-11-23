import urllib.request
import urllib.error

def check_endpoint(url):
    try:
        with urllib.request.urlopen(url) as response:
            print(f"GET {url}: {response.status} {response.reason}")
            print(response.read().decode('utf-8'))
    except urllib.error.URLError as e:
        print(f"GET {url} Failed: {e}")

print("Checking Backend Root...")
check_endpoint("http://localhost:8000/")

print("\nChecking Backend Docs...")
check_endpoint("http://localhost:8000/docs")
