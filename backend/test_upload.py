import requests
import os

# Create a dummy file
with open("test_doc.txt", "w") as f:
    f.write("This is a test document.")

url = "http://localhost:8000/upload"
files = {'file': ('test_doc.txt', open('test_doc.txt', 'rb'), 'text/plain')}
data = {'copies': 1, 'color_mode': 'bw'}

try:
    response = requests.post(url, files=files, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

# Clean up
os.remove("test_doc.txt")
