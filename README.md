# 🖨️ Smart Print Kiosk - Automatic Document Printing Machine

A modern, full-stack automatic printing kiosk system built with **FastAPI** (Python) and **React** (TypeScript). Perfect for self-service printing stations, offices, or educational institutions.

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.121+-green.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)

## ✨ Features

### 🔐 Dual Authentication System

- **User Login**: Register and track personal print jobs
- **Admin Panel**: System management and statistics dashboard
- **Guest Mode**: Quick printing without registration
- JWT-based secure authentication with bcrypt password hashing

### 📄 Document Management

- **Supported Formats**: PDF, DOCX, JPG/JPEG
- **File Upload**: Drag-and-drop or click to upload (max 10MB)
- **Print Options**:
  - Number of copies (1-100)
  - Color or Black & White printing
  - Page range selection
- **Real-time Status**: Track document upload, queuing, and printing status

### 👨‍💼 Admin Dashboard

- Total documents uploaded
- Completed prints counter
- Failed prints monitoring
- Recent documents table with detailed information
- Secure JWT authentication

### 🚀 Technical Features

- **Async/Await**: Full async support for high performance
- **WebSocket**: Real-time status updates
- **Rate Limiting**: API protection with SlowAPI
- **File Validation**: Magic number checking for security
- **MongoDB**: NoSQL database for scalable document storage
- **Cross-Platform**: Windows (pywin32) and Linux (CUPS) printing support

## 🏗️ Architecture

```
Auto Printer/
├── backend/              # FastAPI Python Backend
│   ├── routers/         # API route handlers
│   │   ├── admin.py     # Admin authentication & stats
│   │   ├── user.py      # User authentication
│   │   ├── upload.py    # File upload handling
│   │   ├── print.py     # Print job management
│   │   ├── status.py    # Status checking
│   │   └── websocket.py # Real-time updates
│   ├── services/        # Business logic
│   │   └── printer.py   # Printer interface
│   ├── uploads/         # Uploaded files storage
│   ├── database.py      # MongoDB connection
│   ├── models.py        # Pydantic models
│   └── main.py          # FastAPI application
│
└── frontend/            # React TypeScript Frontend
    ├── src/
    │   ├── pages/       # Page components
    │   │   ├── Home.tsx      # Landing page with login
    │   │   ├── Upload.tsx    # File upload interface
    │   │   ├── Status.tsx    # Print status tracking
    │   │   ├── Admin.tsx     # Admin dashboard
    │   │   └── UserLogin.tsx # User auth page
    │   ├── App.tsx      # Main application
    │   └── main.tsx     # Entry point
    └── public/          # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+**
- **Node.js 16+**
- **MongoDB** (running locally or remote)
- **Printer** configured in your OS

### Backend Setup

1. **Navigate to backend directory**:

```bash
cd backend
```

2. **Create virtual environment**:

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

3. **Install dependencies**:

```bash
pip install -r requirements.txt
```

4. **Configure environment** (create `.env` file):

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=auto_printer_db
SECRET_KEY=your_super_secret_key_change_in_production
```

5. **Run backend server**:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at:

- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Frontend Setup

1. **Navigate to frontend directory**:

```bash
cd frontend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Run development server**:

```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

## 📖 Usage

### Default Admin Credentials

- **Username**: `admin`
- **Password**: `password`

⚠️ **Important**: Change these credentials in production!

### For Users

1. **Register/Login**:

   - Click "Login" on home page
   - Choose "User Login"
   - Register with name, email, and password
   - Or continue as guest

2. **Upload Document**:

   - Select PDF, DOCX, or JPG file (max 10MB)
   - Choose print options (copies, color mode)
   - Click "Upload and Print"

3. **Track Status**:
   - View real-time print job status
   - Check document history (for logged-in users)

### For Admins

1. **Access Dashboard**:

   - Click "Login" → "Admin Login"
   - Enter admin credentials
   - View system statistics and recent documents

2. **Monitor System**:
   - Total documents processed
   - Success/failure rates
   - Recent activity logs

## 🔌 API Endpoints

### User Endpoints

```
POST   /user/register          # Register new user
POST   /user/login             # User authentication
GET    /user/me                # Get user profile
GET    /user/my-documents      # Get user's documents
```

### Admin Endpoints

```
POST   /admin/login            # Admin authentication
GET    /admin/stats            # Dashboard statistics
```

### Document Endpoints

```
POST   /upload                 # Upload document
GET    /status/{document_id}   # Get document status
POST   /print                  # Trigger print job
```

### WebSocket

```
WS     /ws/status              # Real-time status updates
```

## 🛠️ Technologies Used

### Backend

- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver
- **PyJWT** - JWT authentication
- **bcrypt** - Password hashing
- **python-magic** - File type validation
- **SlowAPI** - Rate limiting
- **aiofiles** - Async file operations

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Database

- **MongoDB** - Document database

## 📁 Key Files

- `backend/main.py` - FastAPI application entry point
- `backend/routers/` - API route handlers
- `backend/services/printer.py` - Printer interface
- `backend/database.py` - MongoDB connection
- `backend/models.py` - Data models
- `frontend/src/App.tsx` - React application
- `frontend/src/pages/` - Page components

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **bcrypt Password Hashing**: Industry-standard password security
- **File Validation**: Magic number checking to prevent malicious uploads
- **Rate Limiting**: Prevents abuse with request throttling
- **CORS Protection**: Configured origins only
- **File Size Limits**: Prevents resource exhaustion

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check MongoDB is running
# Verify Python version: python --version
# Reinstall dependencies: pip install -r requirements.txt
```

### Frontend build errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Printing not working

- Ensure a printer is configured in your OS
- Check `services/printer.py` for your platform
- Windows: Requires pywin32
- Linux: Requires CUPS and pycups

### Login issues

- Clear browser localStorage
- Check MongoDB connection
- Verify SECRET_KEY in .env

## 📝 Documentation

- [Installation Guide](INSTALL.md)
- [Admin Panel Info](ADMIN_INFO.md)
- [User Authentication](USER_AUTH.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- [ ] Payment integration for paid printing
- [ ] Email notifications
- [ ] Print history reports (PDF/CSV export)
- [ ] Multiple printer support
- [ ] Network printer support
- [ ] Print preview functionality
- [ ] Mobile app (React Native)
- [ ] Cloud storage integration (Google Drive, Dropbox)
- [ ] QR code-based document retrieval
- [ ] Multi-language support

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- FastAPI documentation and community
- React and TypeScript teams
- MongoDB for excellent NoSQL database
- All open-source contributors

---

⭐ **Star this repository if you find it helpful!**

📧 **Contact**: your.email@example.com

🔗 **Demo**: [Live Demo Link](https://your-demo-link.com)
