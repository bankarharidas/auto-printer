# User Authentication System

## Overview

The Auto Printer application now has a dual authentication system:

1. **User Login** - For regular users to track their documents
2. **Admin Login** - For administrators to manage the system

## Accessing the Login Options

### From Home Page

1. Visit: http://localhost:5173/
2. Click the **"Login"** button in the top right corner
3. A modal will appear with three options:
   - **User Login** (Blue) - For regular users
   - **Admin Login** (Purple) - For administrators
   - **Continue as Guest** - Skip login

## User Login System

### Registration

**URL**: http://localhost:5173/user-login

New users can register with:

- **Full Name**: Your display name
- **Email**: Valid email address (username for login)
- **Password**: Minimum 6 characters

**Backend Endpoint**: `POST /user/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Login

Use your registered email and password to login.

**Backend Endpoint**: `POST /user/login`

- Returns JWT token (valid for 24 hours)
- Returns user information

### User Features

Once logged in, users can:

- Upload documents linked to their account
- View their upload history
- Track their print jobs
- See their statistics

### User API Endpoints

#### Get User Profile

```
GET /user/me
Authorization: Bearer <token>
```

Returns:

```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-11-23T...",
  "total_prints": 5
}
```

#### Get User Documents

```
GET /user/my-documents
Authorization: Bearer <token>
```

Returns list of documents uploaded by the user.

## Admin Login System

### Access Admin Panel

**URL**: http://localhost:5173/admin

### Credentials

- **Username**: `admin`
- **Password**: `password`

### Admin Features

- View dashboard statistics
- Monitor all uploads
- See completed/failed prints
- Access recent documents table
- System management

**Backend Endpoint**: `POST /admin/login`

## Session Management

### User Session

- **Token Lifetime**: 24 hours
- **Storage**: LocalStorage (`user_token`, `user_data`)
- **Auto-logout**: On token expiration

### Admin Session

- **Token Lifetime**: 30 minutes
- **Storage**: LocalStorage (`admin_token`)
- **Auto-logout**: On token expiration or manual logout

## Guest Mode

Users can still use the application without logging in:

- Upload documents anonymously
- Track by document ID
- No history or profile features

## Security Features

### Password Security

- Bcrypt hashing with automatic salt
- Minimum 6 character passwords
- Stored securely in MongoDB

### Token Security

- JWT (JSON Web Tokens)
- HS256 algorithm
- Expiration validation
- Bearer token authentication

### API Protection

Protected endpoints require valid JWT token:

- `/user/me`
- `/user/my-documents`
- `/admin/stats`

## Database Schema

### Users Collection

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password_hash": "$2b$12$...",
  "created_at": "2025-11-23T...",
  "total_prints": 0
}
```

### Documents Collection (Updated)

Documents can now optionally include:

```json
{
  "_id": "ObjectId",
  "user_id": "user_id_if_logged_in",
  "filename": "doc_123.pdf",
  "original_filename": "report.pdf",
  ...
}
```

## Testing the System

### Test User Registration

1. Open http://localhost:5173/user-login
2. Click "Don't have an account? Register"
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. Click "Create Account"
5. You should see "Registration successful!"

### Test User Login

1. Enter the email and password you just registered
2. Click "Login"
3. You should be redirected to the upload page
4. Your user data is stored in localStorage

### Test Admin Login

1. Click "Login" from home
2. Select "Admin Login"
3. Enter:
   - Username: admin
   - Password: password
4. View the admin dashboard with statistics

## Frontend Components

### Home.tsx

- Login button
- Login modal with user/admin options
- Guest mode option

### UserLogin.tsx

- User registration form
- User login form
- Toggle between login/register
- Guest mode link
- Error handling

### Admin.tsx (Existing)

- Admin login form
- Dashboard with statistics
- Recent documents table

## Future Enhancements

1. **User Dashboard**: Add a dedicated user dashboard page
2. **Password Reset**: Email-based password recovery
3. **Profile Management**: Update name, email, change password
4. **Document Sharing**: Share documents between users
5. **Payment Integration**: Paid printing with user accounts
6. **OAuth**: Google/Facebook login integration
7. **Email Verification**: Verify email on registration
8. **User Roles**: Different permission levels
9. **Activity Logs**: Track user actions
10. **2FA**: Two-factor authentication for admins

## Troubleshooting

### "Email already registered"

- The email is already in use
- Try logging in or use a different email

### "Incorrect email or password"

- Verify your credentials
- Passwords are case-sensitive

### "Failed to fetch stats. Session might be expired"

- Your admin token expired (30 min)
- Login again

### Token not working

- Clear localStorage in browser console:
  ```javascript
  localStorage.clear();
  ```
- Refresh the page and login again

## Development Notes

### Change Admin Password

See `ADMIN_INFO.md` for instructions.

### Add Email Validation

The system uses `email-validator` package for proper email validation.

### Environment Variables

Set in `.env` file:

```env
SECRET_KEY=your_super_secret_key_here_change_in_production
```

⚠️ **Important**: Change the SECRET_KEY in production!
