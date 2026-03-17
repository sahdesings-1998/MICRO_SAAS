---
sidebar_position: 2
---

# Common Issues

Frequently encountered problems and quick solutions.

## Installation Issues

### Node.js Version Not Compatible

**Problem**: Getting errors about Node.js version

**Quick Fix**:
```bash
node --version  # Check version (need v18+)
nvm install 20  # Install via nvm if needed
nvm use 20
```

### pnpm Command Not Found

**Problem**: `pnpm: command not found`

**Quick Fix**:
```bash
npm install -g pnpm  # Install pnpm globally
pnpm --version       # Verify installation
```

### Permission Denied on npm/pnpm

**Problem**: `Error: EACCES: permission denied`

**Quick Fix** (macOS/Linux):
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ~/.pnpm-home
```

### Missing PostgreSQL

**Problem**: `Error: FATAL: role "postgres" does not exist`

**Quick Fix**:

**macOS**:
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux**:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows**:
- Download from [postgresql.org](https://www.postgresql.org/download)
- Run installer with default settings

## API & Authentication Issues

### Login Endpoint Not Found

**Problem**: `POST /api/auth/login returns 404`

**Cause**: Server routes not properly configured

**Quick Fix**:
1. Check server is running: `curl http://localhost:5000/health`
2. Verify routes are imported in `server.js`
3. Check route path: `/api/auth/login` (not `/auth/login`)

### CORS Errors When Calling API

**Problem**: `Access-Control-Allow-Origin header is missing`

**Quick Fix** - Check `.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

Must match your frontend URL exactly.

### Token Not Persisting After Logout

**Problem**: Token still works after logout

**Cause**: Token stored but not cleared

**Quick Fix**:
```javascript
// On logout
localStorage.removeItem('authToken');
localStorage.removeItem('user');
// Redirect to login
window.location.href = '/login';
```

### Password Reset Email Not Sending

**Problem**: Email functionality not working

**Quick Fix** - Configure email in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-password
SMTP_FROM=noreply@yourdomain.com
```

## Database Issues

### Database Already Exists

**Problem**: `Error: database "micro_saas" already exists`

**Quick Fix**:
```bash
# Drop existing database
dropdb micro_saas

# Create fresh database
createdb micro_saas

# Run migrations
pnpm migrate
```

### Table Already Exists

**Problem**: Migration fails with "table already exists"

**Quick Fix**:
```bash
# Reset all migrations
pnpm migrate:rollback:all

# Run from scratch
pnpm migrate
pnpm seed
```

### Foreign Key Constraint Violation

**Problem**: `Error: update or delete on table violates foreign key constraint`

**Quick Fix**:
```sql
-- Check dependent records
SELECT * FROM members WHERE user_id = 'user-id';

-- Delete dependents first
DELETE FROM members WHERE user_id = 'user-id';

-- Then delete user
DELETE FROM users WHERE id = 'user-id';
```

## Frontend Issues

### Components Not Rendering

**Problem**: Page loads but nothing displays

**Quick Fix**:
1. Check browser console (F12) for errors
2. Verify API is responding: `curl http://localhost:5000/api/health`
3. Check token is stored: `localStorage.getItem('authToken')`
4. Restart dev server: `pnpm dev`

### Styling Not Applied

**Problem**: CSS not showing

**Quick Fix**:
```bash
# Restart Vite dev server
# Press Ctrl+C in terminal
pnpm dev
```

### Images Not Loading

**Problem**: 404 for image files

**Quick Fix**:
- Images go in `client/public/` folder
- Reference without `/public`: `<img src="/image.png" />`

### Build Succeeds But Site Blank

**Problem**: Production build shows blank page

**Quick Fix**:
1. Check browser console for errors
2. Verify BASE_URL in vite.config.js
3. Check API endpoint is correct
4. Verify network requests in DevTools

## Development Server Issues

### Changes Not Hot-Reloading

**Problem**: Must refresh page manually

**Quick Fix**:
1. Check file is being saved
2. Check file is in `src/` directory
3. Restart dev server: `Ctrl+C` then `pnpm dev`

### Dev Server Takes Long to Start

**Problem**: `pnpm dev` is very slow

**Quick Fix**:
```bash
# Clear cache
rm -rf .vite

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install
pnpm dev
```

### Port Already in Use

**Problem**: `EADDRINUSE: address already in use :::5173`

**Quick Fix** - Kill process on port:

**Linux/macOS**:
```bash
lsof -ti:5173 | xargs kill -9
```

**Windows**:
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## Deployment Issues

### Build Fails in Production

**Problem**: `pnpm build` works locally but fails in CI/CD

**Quick Fix**:
1. Clear build cache: `rm -rf dist .next build`
2. Remove lock file and reinstall: `rm pnpm-lock.yaml && pnpm install`
3. Check Node.js version matches in deployment

### Environment Variables Not Loaded

**Problem**: .env values show as undefined in production

**Quick Fix**:
1. Vercel/Heroku: Set vars in dashboard, not .env file
2. Rebuild/redeploy after setting variables
3. Check variable names exactly (case-sensitive)

### Database Not Accessible in Production

**Problem**: Deployment can't connect to database

**Quick Fix**:
1. Verify DATABASE_URL is set in production
2. Check database is accessible from server IP
3. Check database credentials are correct
4. Verify firewall rules allow connection

### Static Files Not Serving

**Problem**: CSS/JS files return 404 in production

**Quick Fix**:
- Check build output: `ls dist/` or `ls .next/`
- Verify static files are included in build
- Check base URL configuration

## Common Quick Fixes

### "Unexpected token" JSON Error

```javascript
// ❌ WRONG - Don't concatenate in URL
fetch(`/api/users/${userId}`)  // This works
fetch('/api/users/' + userId)  // Also works

// ✅ CORRECT - Always stringify JSON body
fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify(data),  // Don't forget!
})
```

### "Cannot read property X of undefined"

```javascript
// ❌ WRONG - Accessing before checking
const email = user.profile.email

// ✅ CORRECT - Check existence first
const email = user?.profile?.email
```

### "Module not found"

```bash
# ❌ WRONG - Wrong relative path
import User from '../../../models/User'

# ✅ CORRECT - Check import path
import User from './models/User'  # If in same parent
```

### Async/await timing issues

```javascript
// ❌ WRONG - Not waiting for async operation
const user = getUser(123)  // Missing await

// ✅ CORRECT - Always await async operations
const user = await getUser(123)
```

## Quick Diagnostic Checklist

- [ ] Is Node.js v18+ installed? `node --version`
- [ ] Are all dependencies installed? Check `node_modules/`
- [ ] Is .env file created with required variables?
- [ ] Is database created and running?
- [ ] Is backend server running on port 5000?
- [ ] Is frontend dev server running on port 5173?
- [ ] Are no port conflicts? Check with `lsof` or `netstat`
- [ ] Are CORS origins configured correctly?
- [ ] Is JWT_SECRET set in backend .env?
- [ ] Are all migrations run? `pnpm migrate:status`

## Still Stuck?

1. **Check logs**:
   ```bash
   # Backend errors
   tail -f error.log

   # Browser errors
   F12 → Console tab
   ```

2. **Enable debug mode**:
   ```env
   DEBUG=*
   LOG_LEVEL=debug
   ```

3. **Search issue tracker**: GitHub Issues
4. **Ask for help**: Include error message, OS, and steps to reproduce

## Next Steps

- Review [Troubleshooting Guide](./troubleshooting.md) for detailed solutions
- Check [Installation Guide](../introduction/installation.md)
- Explore [API Reference](../api/overview.md)
