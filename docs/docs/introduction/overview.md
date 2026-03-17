---
sidebar_position: 1
---

# Project Overview

## What We Build

Micro-SaaS is a full-stack SaaS platform that provides:

- **User Management** - Handle members, admins, and super admins
- **Authentication & Authorization** - Secure JWT-based authentication
- **Subscription Management** - Multiple subscription plans and billing
- **Admin Dashboard** - Complete admin control panel
- **RESTful API** - Well-documented API endpoints

## Key Features

### 1. Multi-Level User Management
- Super Admins - Full system access
- Admins - Administrative capabilities
- Members - Regular users with limited access

### 2. Secure Authentication
- JWT token-based authentication
- Role-based access control (RBAC)
- Secure password hashing

### 3. Subscription System
- Multiple subscription plans
- Invoice management
- Billing automation

### 4. API-First Architecture
- RESTful endpoints
- Comprehensive error handling
- Request validation

## Tech Stack

### Frontend
- React 18+
- Vite (Build tool)
- Modern CSS & Responsive Design

### Backend
- Node.js
- Express.js
- Relational Database (PostgreSQL/MySQL)

### Documentation
- Docusaurus
- Markdown-based
- Easy to maintain

## Architecture Overview

```
┌─────────────────┐
│   React Client  │
└────────┬────────┘
         │ (API Calls)
┌────────▼────────┐
│  Express Server │
└────────┬────────┘
         │
┌────────▼────────┐
│    Database     │
└─────────────────┘
```

## Directory Structure

```
micro-saas/
├── client/              # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/              # Node.js backend
│   ├── models/         # Database models
│   ├── controllers/    # Route handlers
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── package.json
└── docs/                # Documentation (Docusaurus)
    ├── docs/           # Documentation pages
    └── package.json
```

## Development Workflow

1. **Setup** - Install dependencies and configure environment
2. **Development** - Run both frontend and backend in dev mode
3. **Testing** - Write and run tests
4. **Documentation** - Update docs as features are added
5. **Deployment** - Build and deploy to production

## Getting Help

- Start with [Getting Started](../getting-started.md)
- Check [Guides](../guides/introduction.md) for detailed instructions
- Review [API Documentation](../api/overview.md) for endpoints
- See [Common Issues](../faq/common-issues.md) for troubleshooting
