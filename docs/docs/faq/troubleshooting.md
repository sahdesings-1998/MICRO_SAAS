---
sidebar_position: 1
---

# Troubleshooting Guide

Common issues and their solutions.

## Server Issues

### Server Won't Start

**Error**: `Error: EADDRINUSE: address already in use :::5000`

**Cause**: Another process is using port 5000

**Solution 1** - Change the port:
```env
# .env
PORT=5001
```

**Solution 2** - Kill the process (Linux/macOS):
```bash
lsof -ti:5000 | xargs kill -9
```

**Solution 3** - Use different port (Windows):
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Cause**: Database server is not running

**Solution**:

macOS:
```bash
brew services start postgresql
```

Linux:
```bash
sudo systemctl start postgresql
```

Windows:
- Open Services and start PostgreSQL

### Module Not Found Error

**Error**: `Cannot find module 'express'`

**Cause**: Dependencies not installed

**Solution**:
```bash
cd server
pnpm install
```

### JWT Secret Not Configured

**Error**: `Error: JWT_SECRET is required`

**Cause**: Missing environment variable

**Solution**:
```env
# .env
JWT_SECRET=your_super_secret_key_min_32_chars
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Frontend Issues

### Port 5173 Already in Use

**Error**: `Error: EADDRINUSE: address already in use :::5173`

**Cause**: Vite dev server port is in use

**Solution**:
```bash
# Change port in vite.config.js or use CLI
pnpm dev -- --port 3000
```

### API Calls Failing

**Error**: `Failed to fetch from /api/...`

**Cause**: Backend not running or wrong URL

**Solution**:
1. Check backend is running: `curl http://localhost:5000/health`
2. Verify API URL in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
3. Check CORS configuration in server

### CORS Error

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Cause**: Frontend and backend URLs don't match

**Solution** - Update server `.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

Or enable all origins (development only):
```javascript
// server.js
app.use(cors({
  origin: '*', // ⚠️ Only for development!
}));
```

### Build Fails

**Error**: `Error: Module not found`

**Solution**:
```bash
cd client
pnpm install
pnpm build
```

## Authentication Issues

### "Invalid Token" Error

**Cause**: Token is expired or malformed

**Solution**:
```javascript
// Clear stored tokens and login again
localStorage.removeItem('authToken');
localStorage.removeItem('user');
// Refresh and login
```

### 401 Unauthorized

**Error**: `Unauthorized`

**Cause**: Missing or invalid authorization header

**Solution**:
```javascript
// Ensure token is sent correctly
const token = localStorage.getItem('authToken');
fetch('/api/members', {
  headers: {
    'Authorization': `Bearer ${token}`, // ✅ Include Bearer prefix
  },
});
```

### Login Always Fails

**Cause**: Wrong email/password or user doesn't exist

**Solution**:
1. Verify email and password
2. Check user exists in database
3. Try resetting password

## Database Issues

### Database Connection Timeout

**Error**: `Client request timeout`

**Cause**: Database is slow or query is too complex

**Solution**:
1. Check database performance
2. Simplify queries
3. Add indexes to slow queries:
   ```sql
   CREATE INDEX idx_users_email ON users(email);
   ```

### Transaction Rollback

**Error**: `Transaction rolled back`

**Cause**: Database constraint violated

**Solution**:
- Check unique constraints
- Verify foreign key relationships
- Ensure data is valid before insert/update

### Database Locked

**Error**: `Database is locked`

**Cause**: Another connection is accessing database

**Solution**:
```bash
# Restart database
# For SQLite, delete lock file
rm *.db-wal *.db-shm
```

## Deployment Issues

### 502 Bad Gateway

**Cause**: Backend server is not responding

**Solution**:
1. Check if server is running
2. Check server logs
3. Verify database connection
4. Check memory/CPU usage

### 503 Service Unavailable

**Cause**: Server is overloaded or down for maintenance

**Solution**:
1. Wait and retry
2. Check deployment status
3. Scale up resources if needed

### Environment Variables Not Applied

**Cause**: Changes to `.env` not reloaded

**Solution**:
1. Restart server: `pkill node` and restart
2. For hosting (Vercel, Heroku, etc.), redeploy
3. Clear build cache

## Performance Issues

### Slow API Responses

**Cause**: Unoptimized queries or missing indexes

**Solution**:
```sql
-- Add indexes
CREATE INDEX idx_subscriptions_member_id ON subscriptions(member_id);
CREATE INDEX idx_invoices_subscription_id ON invoices(subscription_id);

-- Analyze query performance
EXPLAIN ANALYZE SELECT ...;
```

### High Memory Usage

**Cause**: Memory leaks or large data operations

**Solution**:
```javascript
// Profile memory usage
console.log(process.memoryUsage());

// Use pagination for large datasets
const limit = 100;
const offset = (page - 1) * limit;
```

### Slow Frontend Build

**Cause**: Large bundle size

**Solution**:
```bash
# Analyze bundle
pnpm build --analyze

# Remove unused dependencies
pnpm prune

# Use code splitting
```

## Git Issues

### Merge Conflicts

**Cause**: Conflicting changes in same file

**Solution**:
```bash
# Resolve conflicts in files
git add .
git commit -m "Resolve merge conflicts"
git push
```

### Accidental Commits

**Cause**: Committed sensitive data or wrong files

**Solution**:
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

## Development Workflow

### Hot Reload Not Working

**Cause**: File changes not detected

**Solution**:
```bash
# Restart dev server
# Check if file is in correct directory
# Check file extension is tracked
```

### Linter Errors

**Cause**: Code doesn't follow style rules

**Solution**:
```bash
# View errors
pnpm lint

# Auto-fix errors
pnpm lint --fix
```

### TypeScript Errors (if using TS)

**Cause**: Type mismatches or missing types

**Solution**:
```bash
# Check all type errors
pnpm type-check

# Install type definitions
pnpm add -D @types/express
```

## Getting Help

If you can't find a solution:

1. **Check logs**:
   ```bash
   # Backend logs
   tail -f server.log

   # Browser console
   # Press F12 and check Console tab
   ```

2. **Enable debug mode**:
   ```env
   DEBUG=*
   LOG_LEVEL=debug
   ```

3. **Search documentation**:
   - Check [Common Issues](./common-issues.md)
   - Review [Installation Guide](../introduction/installation.md)

4. **Open an issue**:
   - Provide error message
   - Include steps to reproduce
   - Share relevant logs
   - Mention your OS and Node.js version

## Emergency Recovery

### Complete Reset

```bash
# Clear everything and start fresh
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# Reset database
dropdb micro_saas
createdb micro_saas
pnpm migrate

# Clear cache
pnpm clean
```

### Database Recovery

```bash
# From backup
psql micro_saas < backup.sql

# Or rebuild from migrations
pnpm migrate:rollback:all
pnpm migrate
pnpm seed
```

---

## Still Need Help?

- [Common Issues Guide](./common-issues.md)
- [Installation Guide](../introduction/installation.md)
- [API Reference](../api/overview.md)
- GitHub Issues
- Community Discord
