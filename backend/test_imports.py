import sys
print(f"Python executable: {sys.executable}")
print(f"Path: {sys.path}")

try:
    print("Importing fastapi...")
    import fastapi
    print("Success.")
except Exception as e:
    print(f"Failed: {e}")

try:
    print("Importing magic...")
    import magic
    print("Success.")
except Exception as e:
    print(f"Failed: {e}")

try:
    print("Importing database...")
    import database
    print("Success.")
except Exception as e:
    print(f"Failed: {e}")

try:
    print("Importing models...")
    import models
    print("Success.")
except Exception as e:
    print(f"Failed: {e}")

try:
    print("Importing routers.upload...")
    from routers import upload
    print("Success.")
except Exception as e:
    print(f"Failed: {e}")

try:
    print("Importing main...")
    import main
    print("Success.")
except Exception as e:
    print(f"Failed: {e}")
