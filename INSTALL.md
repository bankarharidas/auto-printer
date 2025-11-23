# Installation Instructions - Automatic Document Printing Machine

## Prerequisites
- **Python 3.9+**
- **Node.js 16+**
- **MongoDB** (Running locally or accessible via URL)
- **Printer** (Configured in OS)

## Backend Setup (Windows / Raspberry Pi)

1.  **Navigate to backend directory:**
    ```bash
    cd backend
    ```

2.  **Create Virtual Environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/Mac
    .\venv\Scripts\activate   # Windows
    ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment:**
    Create a `.env` file in `backend/` with:
    ```env
    MONGO_URL=mongodb://localhost:27017
    DB_NAME=auto_printer_db
    SECRET_KEY=your_secret_key_here
    ```

5.  **Run Backend:**
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    The API will be available at `http://localhost:8000`.
    Swagger Docs: `http://localhost:8000/docs`

## Frontend Setup

1.  **Navigate to frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The Kiosk UI will be available at `http://localhost:5173`.

## Printer Configuration

### Windows
- Ensure the printer is installed and set as **Default Printer**.
- The backend uses `win32print` to send files to the default printer.

### Raspberry Pi (Linux)
- Install CUPS: `sudo apt install cups libcups2-dev`
- Add user to lpadmin: `sudo usermod -aG lpadmin pi`
- Access CUPS web interface at `https://localhost:631` to add printers.
- The backend uses `pycups`.

## Kiosk Mode (Optional)
To run the frontend in full screen on startup:
- **Chrome:** `chrome.exe --kiosk http://localhost:5173`
