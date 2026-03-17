---
sidebar_position: 2
---

# Authentication API

Authentication endpoints for user login, registration, and token management.

## Register User

Create a new user account.

### Endpoint

```
POST /api/auth/register
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+14155552671"
}
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| email | string | ✅ | User email address |
| password | string | ✅ | Password (min 8 chars, uppercase, lowercase, number, special char) |
| firstName | string | ❌ | First name |
| lastName | string | ❌ | Last name |
| phone | string | ❌ | Phone number in E.164 format |

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

### Error Responses

```json
{
  "success": false,
  "message": "Email already registered",
  "error": "email_exists",
  "statusCode": 409
}
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

---

## Login User

Authenticate user and receive JWT token.

### Endpoint

```
POST /api/auth/login
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| email | string | ✅ | User email address |
| password | string | ✅ | User password |

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "member",
      "status": "active"
    }
  }
}
```

### Error Responses

```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "invalid_credentials",
  "statusCode": 401
}
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

---

## Logout User

Logout and invalidate current session.

### Endpoint

```
POST /api/auth/logout
```

### Headers

```
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

---

## Refresh Token

Get a new access token using refresh token.

### Endpoint

```
POST /api/auth/refresh
```

### Headers

```
Authorization: Bearer <refresh_token>
```

### Response

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Authorization: Bearer <refresh_token>"
```

---

## Change Password

Update user password.

### Endpoint

```
PUT /api/auth/change-password
```

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!"
}
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| currentPassword | string | ✅ | Current password |
| newPassword | string | ✅ | New password (must be different from current) |

### Response

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Error Responses

```json
{
  "success": false,
  "message": "Current password is incorrect",
  "error": "invalid_password",
  "statusCode": 401
}
```

### Example Request

```bash
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldPassword123!",
    "newPassword": "NewPassword456!"
  }'
```

---

## Forgot Password

Request password reset email.

### Endpoint

```
POST /api/auth/forgot-password
```

### Request Body

```json
{
  "email": "user@example.com"
}
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| email | string | ✅ | Email address |

### Response

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

---

## Reset Password

Reset password using reset token from email.

### Endpoint

```
POST /api/auth/reset-password
```

### Request Body

```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewPassword456!"
}
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| token | string | ✅ | Reset token from email |
| newPassword | string | ✅ | New password |

### Response

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### Error Responses

```json
{
  "success": false,
  "message": "Reset token has expired",
  "error": "token_expired",
  "statusCode": 400
}
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_from_email",
    "newPassword": "NewPassword456!"
  }'
```

---

## Get Current User

Get authenticated user information.

### Endpoint

```
GET /api/auth/me
```

### Headers

```
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "member",
    "status": "active",
    "phone": "+14155552671",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Example Request

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## Rate Limiting

Authentication endpoints have stricter rate limiting:

- **Register/Login**: 5 requests per 15 minutes per IP
- **Password Reset**: 3 requests per 30 minutes per email
- **Refresh Token**: 10 requests per minute per token

## Best Practices

### Password Requirements

Passwords must meet these criteria:
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (!@#$%^&*)

### Token Storage

```javascript
// Store tokens securely
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);

// Never log tokens
console.log(token); // ❌ DON'T DO THIS

// Always use Bearer prefix
Authorization: Bearer token // ✅ CORRECT
Authorization: token        // ❌ WRONG
```

### Token Refresh Strategy

```javascript
// Set timer to refresh before expiration
const tokenExpireTime = 24 * 60 * 60 * 1000; // 24 hours
const refreshTime = tokenExpireTime - (5 * 60 * 1000); // 5 minutes before

setTimeout(async () => {
  const newToken = await refreshToken();
  localStorage.setItem('accessToken', newToken);
}, refreshTime);
```

## Next Steps

- Explore [Members API](./members-api.md)
- Learn [Admins API](./admins-api.md)
- Review [API Overview](./overview.md)
