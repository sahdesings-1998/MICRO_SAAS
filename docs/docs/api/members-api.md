---
sidebar_position: 3
---

# Members API

API endpoints for managing member accounts and information.

## List All Members

Get a paginated list of all members.

### Endpoint

```
GET /api/members
```

### Headers

```
Authorization: Bearer <token>
```

### Query Parameters

| Name | Type | Description |
|------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| status | string | Filter by status (active, inactive) |
| sort | string | Sort field (name, createdAt, etc.) |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "member-123",
      "userId": "user-456",
      "email": "member@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+14155552671",
      "companyName": "Acme Corp",
      "status": "active",
      "subscriptions": 2,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

### Example Request

```bash
curl -X GET "http://localhost:5000/api/members?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

## Get Member by ID

Get detailed information about a specific member.

### Endpoint

```
GET /api/members/:id
```

### Headers

```
Authorization: Bearer <token>
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | ✅ | Member ID |

### Response

```json
{
  "success": true,
  "data": {
    "id": "member-123",
    "userId": "user-456",
    "email": "member@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+14155552671",
    "companyName": "Acme Corp",
    "status": "active",
    "subscriptions": [
      {
        "id": "sub-123",
        "planName": "Pro",
        "status": "active",
        "startDate": "2024-01-15",
        "endDate": "2025-01-15"
      }
    ],
    "invoices": [
      {
        "id": "inv-123",
        "amount": 29.99,
        "status": "paid",
        "dueDate": "2024-02-15",
        "paidDate": "2024-02-10"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Error Responses

```json
{
  "success": false,
  "message": "Member not found",
  "error": "not_found",
  "statusCode": 404
}
```

### Example Request

```bash
curl -X GET http://localhost:5000/api/members/member-123 \
  -H "Authorization: Bearer <token>"
```

---

## Create Member

Create a new member account (Admin only).

### Endpoint

```
POST /api/members
```

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "email": "member@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+14155552671",
  "companyName": "Acme Corp",
  "password": "SecurePassword123!"
}
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| email | string | ✅ | Email address |
| firstName | string | ✅ | First name |
| lastName | string | ✅ | Last name |
| phone | string | ❌ | Phone number |
| companyName | string | ❌ | Company name |
| password | string | ✅ | Password |

### Response

```json
{
  "success": true,
  "message": "Member created successfully",
  "data": {
    "id": "member-123",
    "userId": "user-456",
    "email": "member@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "companyName": "Acme Corp",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/members \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "member@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "companyName": "Acme Corp",
    "password": "SecurePassword123!"
  }'
```

---

## Update Member

Update member information.

### Endpoint

```
PUT /api/members/:id
```

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | ✅ | Member ID |

### Request Body

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+14155552672",
  "companyName": "Tech Corp"
}
```

### Response

```json
{
  "success": true,
  "message": "Member updated successfully",
  "data": {
    "id": "member-123",
    "email": "member@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+14155552672",
    "companyName": "Tech Corp",
    "updatedAt": "2024-01-16T10:30:00Z"
  }
}
```

### Example Request

```bash
curl -X PUT http://localhost:5000/api/members/member-123 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "companyName": "Tech Corp"
  }'
```

---

## Delete Member

Delete a member account (Admin only).

### Endpoint

```
DELETE /api/members/:id
```

### Headers

```
Authorization: Bearer <token>
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | ✅ | Member ID |

### Response

```json
{
  "success": true,
  "message": "Member deleted successfully"
}
```

### Error Responses

```json
{
  "success": false,
  "message": "Cannot delete member with active subscriptions",
  "error": "constraint_violation",
  "statusCode": 409
}
```

### Example Request

```bash
curl -X DELETE http://localhost:5000/api/members/member-123 \
  -H "Authorization: Bearer <token>"
```

---

## Get Current Member Info

Get information about the authenticated member.

### Endpoint

```
GET /api/members/profile
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
    "id": "member-123",
    "userId": "user-456",
    "email": "member@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+14155552671",
    "companyName": "Acme Corp",
    "status": "active",
    "subscriptions": 2,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Example Request

```bash
curl -X GET http://localhost:5000/api/members/profile \
  -H "Authorization: Bearer <token>"
```

---

## Update Member Profile

Update own member profile.

### Endpoint

```
PUT /api/members/profile
```

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+14155552672",
  "companyName": "New Company"
}
```

### Response

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "member-123",
    "email": "member@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+14155552672",
    "companyName": "New Company"
  }
}
```

### Example Request

```bash
curl -X PUT http://localhost:5000/api/members/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "companyName": "New Company"
  }'
```

---

## Member Status Transitions

```
active   → inactive (suspend account)
inactive → active   (reactivate account)
```

---

## Permissions

| Action | Role | Permission |
|--------|------|-----------|
| List Members | Admin | ✅ |
| List Members | Member | Own profile only |
| Get Member | Admin | ✅ |
| Get Member | Member | Own profile only |
| Create Member | Admin | ✅ |
| Create Member | Member | ❌ |
| Update Member | Admin | ✅ |
| Update Member | Member | Own profile only |
| Delete Member | Admin | ✅ |
| Delete Member | Member | ❌ |

---

## Error Codes

| Code | Meaning |
|------|---------|
| not_found | Member doesn't exist |
| unauthorized | Not permitted to access this member |
| email_exists | Email already registered |
| constraint_violation | Cannot perform action due to constraints |
| validation_error | Invalid input data |

---

## Next Steps

- Explore [Admins API](./admins-api.md)
- Review [API Overview](./overview.md)
- Check [Guides](../guides/introduction.md)
