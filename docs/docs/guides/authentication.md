---
sidebar_position: 2
---

# Authentication Guide 🔒

Learn how Micro-SaaS handles user login and security.

## What is Authentication? 🤔

Authentication means **verifying who you are**. Think of it like:
- You enter your username and password
- The system checks if it's correct
- If yes, you get access ✅
- If no, you get an error ❌

## How Micro-SaaS Does It 🔑

Micro-SaaS uses **JWT (JSON Web Tokens)**. Here's the simple version:

```
1. User enters email + password
              ↓
2. Server checks if password is correct
              ↓
3. Server gives token (like a ticket)
              ↓
4. User keeps ticket in browser
              ↓
5. For every action, user shows ticket
              ↓
6. Server verifies ticket = you're allowed! ✅
```

## User Login Example 📝

### Using the API

```bash
# Send login request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "mypassword123"
  }'
```

**Response** (if correct):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Using React (Frontend)

```javascript
// Save this in your component
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (data.success) {
    // Save token in browser storage
    localStorage.setItem('token', data.token);
    // Now you're logged in! ✅
  }
};
```

## Check If User is Logged In ✅

```javascript
// Check if we have a token
const token = localStorage.getItem('token');

if (token) {
  console.log('✅ User is logged in');
} else {
  console.log('❌ User needs to login');
}
```

## Logout (Clear Access) 🚪

```javascript
// Remove token when user clicks "Logout"
const logout = () => {
  localStorage.removeItem('token');
  console.log('✅ Logged out');
  // Redirect to login page
};
```

## Different User Types 👥

Micro-SaaS has different user roles:

| Role | Can Do | Example |
|------|--------|---------|
| **Member** | View own profile, subscribe | Regular customer |
| **Admin** | Manage members, view analytics | Support team |
| **SuperAdmin** | Manage everything | Company owner |

## Protected Routes 🔐

Some API endpoints need a token. Always send it in the header:

```bash
# Include token in Authorization header
curl -X GET http://localhost:5000/api/members/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

In React:
```javascript
const getProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/members/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  console.log('My profile:', data);
};
```

## Security Tips 🛡️

✅ **DO:**
- Always use HTTPS in production
- Keep tokens safe in localStorage
- Never share your token
- Use strong passwords
- Change password regularly

❌ **DON'T:**
- Put token in URL
- Send token in plain text (not HTTPS)
- Share token with anyone
- Commit `.env` files with secrets

## Common Errors 🆘

**"Invalid token"**
- Token might be expired
- Solution: Login again

**"Token not found"**
- You might not be logged in
- Solution: Check localStorage for token

**"Wrong password"**
- Double check your password
- Solution: Use "Forgot Password" to reset

## Next Steps 🚀

1. ✅ Understand JWT authentication
2. 👉 Check [API Reference](../api/authentication-api) for all login endpoints
3. 👉 See [Common Issues](../faq/common-issues) for help

```
POST /api/auth/register
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+14155552671"
}
```

### Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Implementation Example

```javascript
// Frontend (React)
async function registerUser(userData) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}

// Usage
const newUser = await registerUser({
  email: 'user@example.com',
  password: 'securePassword123!',
  firstName: 'John',
  lastName: 'Doe',
});
```

## User Login

### API Endpoint

```
POST /api/auth/login
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "role": "member",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Implementation Example

```javascript
// Frontend (React)
async function loginUser(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const { data } = await response.json();

  // Store token
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
}

// Usage
const { token, user } = await loginUser(
  'user@example.com',
  'securePassword123!'
);
```

## Token Management

### Storing the Token

```javascript
// Store token
localStorage.setItem('authToken', token);

// Retrieve token
const token = localStorage.getItem('authToken');

// Clear token (logout)
localStorage.removeItem('authToken');
localStorage.removeItem('user');
```

### Using the Token

Always include the token in the `Authorization` header:

```javascript
const response = await fetch('/api/members', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

### Token Refresh

Tokens expire after a certain period. Implement refresh logic:

```javascript
async function refreshToken() {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
  });

  if (response.ok) {
    const { data } = await response.json();
    localStorage.setItem('authToken', data.token);
    return data.token;
  } else {
    // Redirect to login
    window.location.href = '/login';
  }
}
```

## Password Recovery

### Request Password Reset

```
POST /api/auth/forgot-password
```

### Reset Password

```
POST /api/auth/reset-password
```

## Role-Based Access Control

### User Roles

1. **SuperAdmin** - Full system access
2. **Admin** - Administrative capabilities
3. **Member** - Regular user

### Checking Permissions

```javascript
// Frontend
function isAdmin(user) {
  return user.role === 'admin' || user.role === 'superadmin';
}

function isSuperAdmin(user) {
  return user.role === 'superadmin';
}

// Backend
app.get('/api/admin/dashboard', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  // Admin logic here
});
```

## Best Practices

### Security

- ✅ Always use HTTPS in production
- ✅ Never store passwords in plain text
- ✅ Use secure token generation
- ✅ Implement token expiration
- ✅ Validate input data
- ✅ Use CORS properly

### Token Management

- ✅ Store tokens securely (localStorage or sessionStorage)
- ✅ Include tokens in API requests
- ✅ Handle token expiration
- ✅ Implement token refresh mechanism
- ✅ Clear tokens on logout

### Password Security

- ✅ Require strong passwords (min 8 characters)
- ✅ Include uppercase, lowercase, numbers, and special characters
- ✅ Hash passwords with bcrypt
- ✅ Implement password reset mechanism
- ✅ Rate limit login attempts

## Troubleshooting

### Invalid Token Error

**Problem**: Getting "Invalid token" errors
**Solution**: 
- Ensure token is stored correctly
- Check token format (should include "Bearer " prefix)
- Verify token hasn't expired
- Check server JWT secret configuration

### Unauthorized Access

**Problem**: Getting 401 errors
**Solution**:
- Verify token is included in headers
- Check if token has expired
- Ensure you're logged in first
- Clear cache and try again

### Login Fails

**Problem**: Cannot login
**Solution**:
- Verify email and password
- Check if user exists
- Ensure database is running
- Check server logs for errors

## Next Steps

- Explore [Role-Based Authorization](../api/authentication-api.md)
- Learn about [Database Models](./database.md)
- Review [API Reference](../api/overview.md)
- Check [Deployment Guide](./deployment.md)
