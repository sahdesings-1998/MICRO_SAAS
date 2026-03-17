---
sidebar_position: 4
---

# Admins API

API endpoints for managing admin accounts and permissions (Admin/SuperAdmin only).

## List All Admins

Get a paginated list of all admins.

### Endpoint

```
GET /api/admins
```

### Headers

```
Authorization: Bearer <token>
```

### Permissions

- **SuperAdmin**: Can list all admins
- **Admin**: Can list only own info
- **Member**: ❌ No access

### Query Parameters

| Name | Type | Description |
|------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| status | string | Filter by status (active, inactive) |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "admin-123",
      "userId": "user-456",
      "email": "admin@example.com",
      "firstName": "Jane",
      "lastName": "Admin",
      "phone": "+14155552671",
      "department": "Operations",
      "status": "active",
      "permissions": ["create_members", "edit_members", "view_reports"],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Example Request

```bash
curl -X GET "http://localhost:5000/api/admins?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

## Get Admin by ID

Get detailed information about a specific admin.

### Endpoint

```
GET /api/admins/:id
```

### Headers

```
Authorization: Bearer <token>
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | ✅ | Admin ID |

### Response

```json
{
  "success": true,
  "data": {
    "id": "admin-123",
    "userId": "user-456",
    "email": "admin@example.com",
    "firstName": "Jane",
    "lastName": "Admin",
    "phone": "+14155552671",
    "department": "Operations",
    "status": "active",
    "permissions": [
      "create_members",
      "edit_members",
      "delete_members",
      "view_reports",
      "manage_subscriptions"
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Example Request

```bash
curl -X GET http://localhost:5000/api/admins/admin-123 \
  -H "Authorization: Bearer <token>"
```

---

## Create Admin

Create a new admin account (SuperAdmin only).

### Endpoint

```
POST /api/admins
```

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Permissions

- **SuperAdmin**: ✅ Can create admins
- **Admin**: ❌ Cannot create admins

### Request Body

```json
{
  "email": "newadmin@example.com",
  "firstName": "Jane",
  "lastName": "Admin",
  "phone": "+14155552671",
  "department": "Operations",
  "password": "SecurePassword123!",
  "permissions": [
    "create_members",
    "edit_members",
    "view_reports"
  ]
}
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| email | string | ✅ | Email address |
| firstName | string | ✅ | First name |
| lastName | string | ✅ | Last name |
| phone | string | ❌ | Phone number |
| department | string | ❌ | Department |
| password | string | ✅ | Password |
| permissions | array | ❌ | Array of permission strings |

### Available Permissions

```
- create_members       # Create new members
- edit_members        # Edit member information
- delete_members      # Delete members
- view_members        # View member list
- manage_subscriptions # Manage member subscriptions
- manage_invoices     # Manage invoices
- view_reports        # View system reports
- manage_admins       # Manage other admins (SuperAdmin only)
- view_audit_logs     # View audit logs
- system_settings     # Modify system settings
```

### Response

```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "id": "admin-123",
    "userId": "user-456",
    "email": "newadmin@example.com",
    "firstName": "Jane",
    "lastName": "Admin",
    "department": "Operations",
    "permissions": ["create_members", "edit_members", "view_reports"],
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/admins \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "firstName": "Jane",
    "lastName": "Admin",
    "department": "Operations",
    "password": "SecurePassword123!",
    "permissions": ["create_members", "edit_members", "view_reports"]
  }'
```

---

## Update Admin

Update admin information and permissions (SuperAdmin only).

### Endpoint

```
PUT /api/admins/:id
```

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | ✅ | Admin ID |

### Request Body

```json
{
  "firstName": "Janet",
  "lastName": "Supervisor",
  "phone": "+14155552672",
  "department": "Management",
  "permissions": [
    "create_members",
    "edit_members",
    "delete_members",
    "view_reports",
    "manage_subscriptions"
  ]
}
```

### Response

```json
{
  "success": true,
  "message": "Admin updated successfully",
  "data": {
    "id": "admin-123",
    "email": "newadmin@example.com",
    "firstName": "Janet",
    "lastName": "Supervisor",
    "department": "Management",
    "permissions": [
      "create_members",
      "edit_members",
      "delete_members",
      "view_report",
      "manage_subscriptions"
    ],
    "updatedAt": "2024-01-16T10:30:00Z"
  }
}
```

### Example Request

```bash
curl -X PUT http://localhost:5000/api/admins/admin-123 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Janet",
    "lastName": "Supervisor",
    "department": "Management",
    "permissions": ["create_members", "edit_members", "view_reports"]
  }'
```

---

## Delete Admin

Delete an admin account (SuperAdmin only).

### Endpoint

```
DELETE /api/admins/:id
```

### Headers

```
Authorization: Bearer <token>
```

### Permissions

- **SuperAdmin**: ✅ Can delete admins
- **Admin**: ❌ Cannot delete admins

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | ✅ | Admin ID |

### Response

```json
{
  "success": true,
  "message": "Admin deleted successfully"
}
```

### Error Responses

```json
{
  "success": false,
  "message": "Cannot delete last SuperAdmin",
  "error": "constraint_violation",
  "statusCode": 409
}
```

### Example Request

```bash
curl -X DELETE http://localhost:5000/api/admins/admin-123 \
  -H "Authorization: Bearer <token>"
```

---

## Get Current Admin Info

Get information about the authenticated admin.

### Endpoint

```
GET /api/admins/me
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
    "id": "admin-123",
    "userId": "user-456",
    "email": "admin@example.com",
    "firstName": "Jane",
    "lastName": "Admin",
    "phone": "+14155552671",
    "department": "Operations",
    "status": "active",
    "permissions": [
      "create_members",
      "edit_members",
      "view_reports"
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Example Request

```bash
curl -X GET http://localhost:5000/api/admins/me \
  -H "Authorization: Bearer <token>"
```

---

## Update Admin Profile

Update own admin profile information.

### Endpoint

```
PUT /api/admins/me
```

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "firstName": "Janet",
  "lastName": "Smith",
  "phone": "+14155552672"
}
```

### Response

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "admin-123",
    "email": "admin@example.com",
    "firstName": "Janet",
    "lastName": "Smith",
    "phone": "+14155552672"
  }
}
```

### Example Request

```bash
curl -X PUT http://localhost:5000/api/admins/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Janet",
    "lastName": "Smith",
    "phone": "+14155552672"
  }'
```

---

## Admin Roles

### SuperAdmin
- Full system access
- Can create/edit/delete admins
- Can manage all members
- Can access all reports
- Can modify system settings

### Admin
- Limited system access
- Can manage members
- Can view assigned reports
- Cannot manage other admins
- Cannot modify system settings

---

## Permissions

| Action | SuperAdmin | Admin | Member |
|--------|-----------|-------|--------|
| List Admins | ✅ All | ⚠️ Own only | ❌ |
| Get Admin | ✅ | ⚠️ Own only | ❌ |
| Create Admin | ✅ | ❌ | ❌ |
| Update Admin | ✅ | ⚠️ Own only | ❌ |
| Delete Admin | ✅ | ❌ | ❌ |

---

## Error Codes

| Code | Meaning |
|------|---------|
| not_found | Admin doesn't exist |
| unauthorized | Not permitted to access |
| permission_denied | Insufficient permissions |
| email_exists | Email already registered |
| constraint_violation | Cannot perform action |
| invalid_permissions | Invalid permission names |

---

## Next Steps

- Review [API Overview](./overview.md)
- Check [Members API](./members-api.md)
- Explore [Guides](../guides/introduction.md)
