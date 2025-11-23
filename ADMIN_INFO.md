# Admin Panel Information

## Access the Admin Panel

**URL**: http://localhost:5173/admin

## Default Login Credentials

- **Username**: `admin`
- **Password**: `password`

> ⚠️ **Security Note**: These are default credentials for development. Change them in production by updating the password hash in `backend/routers/admin.py`.

## Admin Dashboard Features

### 📊 Statistics Overview

- **Total Documents**: Count of all uploaded documents
- **Completed Prints**: Successfully printed documents
- **Failed Prints**: Documents that failed to print

### 📋 Recent Documents Table

Shows the 10 most recent documents with:

- Original filename
- Current status (uploaded, queued, printing, completed, failed)
- File type (PDF, DOCX, JPG)
- Upload timestamp

### 🔐 Security Features

- JWT-based authentication
- 30-minute token expiration
- Bcrypt password hashing
- Protected API endpoints

## Backend Admin Endpoints

### POST `/admin/login`

Login with username and password to get JWT token.

**Request Body**:

```
username: admin
password: password
```

**Response**:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### GET `/admin/stats`

Get dashboard statistics (requires authentication).

**Headers**:

```
Authorization: Bearer <token>
```

**Response**:

```json
{
  "total_documents": 15,
  "completed_prints": 12,
  "failed_prints": 1,
  "recent_documents": [...]
}
```

## How to Change Admin Password

1. Generate a new bcrypt hash:

```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
new_hash = pwd_context.hash("your_new_password")
print(new_hash)
```

2. Update `MOCK_ADMIN_DB` in `backend/routers/admin.py`:

```python
MOCK_ADMIN_DB = {
    "admin": "your_new_hash_here"
}
```

3. Restart the backend server.

## Future Enhancements

For production use, consider:

- Store admin users in MongoDB instead of in-memory dict
- Add user roles (admin, operator, viewer)
- Add ability to delete/manage documents
- Export reports (CSV, PDF)
- Real-time updates via WebSocket
- Printer configuration interface
- Activity logs/audit trail
