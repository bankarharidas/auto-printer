import urllib.request

def check_cors(origin):
    req = urllib.request.Request("http://localhost:8000/")
    req.add_header("Origin", origin)
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Origin: {origin}")
            print(f"Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin')}")
            print(f"Access-Control-Allow-Credentials: {response.headers.get('Access-Control-Allow-Credentials')}")
            print("-" * 20)
    except Exception as e:
        print(f"Failed for {origin}: {e}")

check_cors("http://localhost:5173")
check_cors("http://127.0.0.1:5173")
check_cors("http://google.com") # Should not return allow-origin
