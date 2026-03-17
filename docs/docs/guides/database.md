---
sidebar_position: 3
---

# Database Guide

Complete guide to working with the Micro-SaaS database layer.

## Database Overview

Micro-SaaS uses a relational database to store all application data. This guide covers:
- Database setup
- Schema design
- Models and relationships
- Migrations
- Backup and recovery

## Supported Databases

- **PostgreSQL** (Recommended) - v12+
- **MySQL** - v8+
- **SQLite** - Development only

### Choosing a Database

| Database | Production | Development | Performance | Ease |
|----------|-----------|-------------|-------------|------|
| PostgreSQL | ✅ Yes | ✅ Yes | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| MySQL | ✅ Yes | ✅ Yes | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| SQLite | ❌ No | ✅ Yes | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## Database Setup

### PostgreSQL Setup

**macOS**:
```bash
brew install postgresql
brew services start postgresql
createdb micro_saas
```

**Linux (Ubuntu)**:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb micro_saas
```

**Windows**:
- Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run installer with default settings
- Create database using pgAdmin

### Environment Configuration

Create `.env` in the server directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/micro_saas
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=micro_saas
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword
```

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### SuperAdmins Table
```sql
CREATE TABLE super_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Admins Table
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  department VARCHAR(255),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Members Table
```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  company_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL,
  plan_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);
```

#### Invoices Table
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  due_date TIMESTAMP,
  paid_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);
```

## Working with Models

### Creating a Model

Example model for Members:

```javascript
// models/Member.js
import db from '../config/db.js';

export async function createMember(userId, companyName) {
  const query = `
    INSERT INTO members (user_id, company_name)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const result = await db.query(query, [userId, companyName]);
  return result.rows[0];
}

export async function getMemberById(id) {
  const query = `
    SELECT m.*, u.email, u.first_name, u.last_name
    FROM members m
    JOIN users u ON m.user_id = u.id
    WHERE m.id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
}

export async function updateMember(id, data) {
  const { companyName } = data;
  const query = `
    UPDATE members
    SET company_name = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [companyName, id]);
  return result.rows[0];
}

export async function deleteMember(id) {
  const query = `DELETE FROM members WHERE id = $1 RETURNING *;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
}
```

## Database Operations

### Running Queries

```javascript
// Using parameterized queries (SAFE)
const result = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
);

// Multiple results
const rows = result.rows;

// Single result
const user = result.rows[0];
```

### Transactions

```javascript
async function transferSubscription(fromMemberId, toMemberId, subscriptionId) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Remove from old member
    await client.query(
      'UPDATE subscriptions SET member_id = NULL WHERE id = $1',
      [subscriptionId]
    );

    // Add to new member
    await client.query(
      'UPDATE subscriptions SET member_id = $1 WHERE id = $2',
      [toMemberId, subscriptionId]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

## Migrations

### Creating a Migration

```sql
-- migrations/001_create_tables.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### Running Migrations

```bash
cd server

# Run all pending migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Rollback all migrations
npm run migrate:rollback:all
```

## Seeding Data

### Creating Seeds

```javascript
// seeds/001_initial_seed.js
async function seed(db) {
  // Insert initial data
  await db.query(`
    INSERT INTO subscription_plans (name, price, features)
    VALUES
      ('Basic', 9.99, '["Feature1", "Feature2"]'),
      ('Pro', 29.99, '["Feature1", "Feature2", "Feature3"]'),
      ('Enterprise', 99.99, '["All Features"]');
  `);
}

export default seed;
```

### Running Seeds

```bash
npm run seed
```

## Backup and Restore

### PostgreSQL Backup

```bash
# Backup entire database
pg_dump micro_saas > backup.sql

# Backup with compression
pg_dump -Fc micro_saas > backup.dump

# Backup only schema
pg_dump -s micro_saas > schema.sql
```

### PostgreSQL Restore

```bash
# Restore from SQL file
psql micro_saas < backup.sql

# Restore from dump file
pg_restore -d micro_saas backup.dump
```

## Performance Optimization

### Indexing Strategy

```sql
-- Index frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_subscriptions_member_id ON subscriptions(member_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_invoices_subscription_id ON invoices(subscription_id);

-- Composite indexes for common queries
CREATE INDEX idx_subscriptions_member_status 
ON subscriptions(member_id, status);
```

### Query Optimization

```javascript
// GOOD: Specific columns
const result = await db.query(
  'SELECT id, email, first_name FROM users WHERE status = $1',
  ['active']
);

// BAD: Select all (unnecessary)
const result = await db.query(
  'SELECT * FROM users WHERE status = $1',
  ['active']
);
```

## Connection Pooling

### Database Configuration

```javascript
// config/db.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
```

## Best Practices

✅ **DO**:
- Use parameterized queries (prevent SQL injection)
- Create indexes on frequently queried columns
- Use transactions for related operations
- Close database connections properly
- Implement connection pooling
- Backup regularly
- Use schema migrations

❌ **DON'T**:
- Concatenate user input into queries
- Use `SELECT *` unnecessarily
- Create too many indexes
- Leave connections open
- Store sensitive data in plain text
- Skip backups
- Modify production data directly

## Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:
- Start PostgreSQL service: `brew services start postgresql`
- Check DATABASE_URL in .env
- Verify database server is running

### Query Timeout

```
Error: Client request timeout
```

**Solution**:
- Check query complexity
- Add indexes to slow queries
- Increase timeout in pool config

### Too Many Connections

```
Error: sorry, too many clients already
```

**Solution**:
- Increase max connections in pool config
- Close unused connections
- Check for connection leaks

## Next Steps

- Read [Authentication Guide](./authentication.md)
- Explore [API Reference](../api/overview.md)
- Check [Deployment Guide](./deployment.md)
- Review [Architecture](../introduction/architecture.md)
