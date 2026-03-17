---
sidebar_position: 1
---

# API Reference Overview

Complete API documentation for Micro-SaaS backend endpoints.

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.yourdomain.com/api
```

## Authentication

All API endpoints (except login/register) require an `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

1. Register or login via `/api/auth/login`
2. Store the returned token
3. Include it in all subsequent requests

## Response Format

All responses follow a consistent format:

### Success Response (200)

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "123",
    "name": "Example"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "error_code",
  "statusCode": 400
}
```

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Something went wrong |

## API Sections

### 1. [Authentication API](./authentication-api.md)
- Register user
- Login user
- Logout
- Refresh token
- Change password

### 2. [Members API](./members-api.md)
- Create member
- Get member info
- Update member
- Delete member
- List all members

### 3. [Admins API](./admins-api.md)
- Create admin
- Get admin info
- Update admin
- Delete admin
- List all admins

### 4. Additional Endpoints

#### Subscriptions
- `GET /subscriptions` - List subscriptions
- `POST /subscriptions` - Create subscription
- `GET /subscriptions/:id` - Get subscription
- `PUT /subscriptions/:id` - Update subscription
- `DELETE /subscriptions/:id` - Cancel subscription

#### Invoices
- `GET /invoices` - List invoices
- `GET /invoices/:id` - Get invoice
- `POST /invoices/:id/pay` - Mark invoice as paid

#### Super Admins
- `GET /super-admins` - List super admins (SuperAdmin only)
- `GET /super-admins/:id` - Get super admin
- `POST /super-admins` - Create super admin (SuperAdmin only)

## Rate Limiting

API endpoints are rate limited to prevent abuse:

```
Default: 100 requests per 15 minutes per IP
Auth endpoints: 5 requests per 15 minutes per IP
```

Rate limit info is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Pagination

List endpoints support pagination:

```
GET /api/members?page=1&limit=10
```

Response includes pagination info:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

## Filtering & Sorting

### Filtering

```
GET /api/members?status=active&role=member
```

Supported filters vary by endpoint. Check specific documentation.

### Sorting

```
GET /api/members?sort=name:asc
GET /api/members?sort=created_at:desc
```

## Error Handling

### Example Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "validation_error",
  "statusCode": 400,
  "details": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

## Testing the API

### Using cURL

```bash
# Get auth token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token to make authenticated request
curl -X GET http://localhost:5000/api/members \
  -H "Authorization: Bearer <token>"
```

### Using Postman

1. Create a new request
2. Select method (GET, POST, etc.)
3. Enter endpoint URL
4. Add headers:
   ```
   Content-Type: application/json
   Authorization: Bearer <token>
   ```
5. Add request body (if needed)
6. Send request

### Using Bruno

See [Bruno Test Collection](../../Bruno-test-api/) for pre-built API tests.

## API Versioning

Current API Version: **v1**

Future versions will be available at `/api/v2/`, etc.

## Best Practices

### Request Headers

Always include:
```
Content-Type: application/json
Authorization: Bearer <token>
```

### Error Handling

```javascript
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}
```

### Retry Logic

```javascript
async function apiCallWithRetry(endpoint, options = {}, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall(endpoint, options);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

## Next Steps

- Explore [Authentication API](./authentication-api.md)
- Learn [Members API](./members-api.md)
- Review [Admins API](./admins-api.md)
- Check [Guides](../guides/introduction.md)

## Support

- Browse the [FAQ](../faq/troubleshooting.md)
- Check [Common Issues](../faq/common-issues.md)
- Open an issue on GitHub
