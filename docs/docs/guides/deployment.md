---
sidebar_position: 4
---

# Deployment Guide

Complete guide to deploying Micro-SaaS to production.

## Deployment Platforms

Micro-SaaS can be deployed to various platforms:

| Platform | Best For | Difficulty | Cost | Startup Time |
|----------|----------|-----------|------|--------------|
| **Vercel** | Frontend | ⭐⭐ | Free-$$$ | Instant |
| **Heroku** | Full Stack | ⭐⭐⭐ | $$$ | Slow |
| **AWS** | Enterprise | ⭐⭐⭐⭐ | Variable | Medium |
| **DigitalOcean** | Startups | ⭐⭐⭐ | $$ | Fast |
| **Railway** | Full Stack | ⭐⭐ | Free-$$ | Very Fast |

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Environment variables configured
- [ ] Database backed up
- [ ] Code tested locally
- [ ] Build process verified
- [ ] Security audit completed
- [ ] CORS properly configured
- [ ] HTTPS enabled
- [ ] API rate limiting set
- [ ] Error logging configured
- [ ] Monitoring set up

## Frontend Deployment (Vercel)

### 1. Build the Frontend

```bash
cd client
pnpm build
```

### 2. Connect to Vercel

```bash
npm install -g vercel
vercel
```

### 3. Configure Environment Variables

In Vercel dashboard:
```
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Micro-SaaS
```

### 4. Deploy

```bash
vercel --prod
```

### 5. Verify Deployment

- Visit your Vercel deployment URL
- Test all features
- Check console for errors

## Backend Deployment (Railway)

### 1. Prepare Backend

```bash
cd server
pnpm build
```

### 2. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "GitHub Repo"
4. Connect your repository

### 3. Configure Environment Variables

In Railway dashboard, set:
```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com
```

### 4. Deploy

Railway auto-deploys on push to main branch.

### 5. Verify Deployment

```bash
curl https://your-railway-domain.com/api/health
```

## Database Deployment (PostgreSQL)

### Option 1: Managed Service

**Using Railway Database**:
```
1. Create PostgreSQL addon in Railway
2. Copy DATABASE_URL
3. Run migrations
```

**Using Heroku PostgreSQL**:
```bash
heroku addons:create heroku-postgresql:standard-0
```

**Using AWS RDS**:
```
1. Create RDS instance
2. Configure security groups
3. Run migrations
```

### Option 2: Self-Hosted

Not recommended for production. Requires:
- Dedicated server
- Backup procedures
- Monitoring
- Security hardening

### Running Migrations in Production

```bash
# Connect to production database
DATABASE_URL=production_url pnpm migrate

# Verify migrations
DATABASE_URL=production_url pnpm migrate:status
```

## Environment Configuration

### Production Environment

Create `.env.production`:

```env
# Server
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Authentication
JWT_SECRET=very_secure_random_secret_min_32_chars
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://yourdomain.com

# API
API_URL=https://api.yourdomain.com
API_PREFIX=/api

# Logging
LOG_LEVEL=info

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Monitoring (Optional)
SENTRY_DSN=your_sentry_dsn
```

## Build Optimization

### Frontend Build

```bash
cd client

# Analyze bundle size
pnpm build --analyze

# Optimize build
pnpm build
```

Check `dist/` folder size. Aim for:
- JavaScript: < 200KB (gzipped)
- CSS: < 50KB (gzipped)
- Total: < 1MB

### Backend Build

```bash
cd server

# Build for production
pnpm build

# Remove dev dependencies
npm prune --production
```

## Performance Optimization

### Caching Strategy

```javascript
// Server-side caching headers
app.use((req, res, next) => {
  // Cache API responses
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes

  // Don't cache dynamic content
  if (req.url.includes('/api/')) {
    res.set('Cache-Control', 'no-cache');
  }

  next();
});
```

### Database Query Optimization

```javascript
// Use indexes
// Keep queries simple
// Avoid N+1 queries
// Use connection pooling
```

### CDN Configuration

```javascript
// Serve static assets from CDN
const staticAssets = ['.js', '.css', '.jpg', '.png', '.svg'];

staticAssets.forEach(ext => {
  app.get(`/*${ext}`, (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
    next();
  });
});
```

## SSL/HTTPS Configuration

### Obtain SSL Certificate

**Automatic with Vercel/Railway**:
- Already included!

**Manual with Let's Encrypt**:
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

### Configure HTTPS

```javascript
// Node.js with HTTPS
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('path/to/private.key'),
  cert: fs.readFileSync('path/to/certificate.crt'),
};

https.createServer(options, app).listen(443);
```

## Monitoring and Logging

### Error Tracking (Sentry)

```bash
npm install @sentry/node
```

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

app.use(Sentry.Handlers.errorHandler());
```

### Application Logging

```javascript
// Simple logging
console.log(`[${new Date().toISOString()}] ${message}`);

// Or use Winston
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## Backup and Recovery

### Automated Backups

```bash
# Daily backup script
#!/bin/bash
pg_dump $DATABASE_URL | gzip > backup-$(date +%Y%m%d).sql.gz

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).sql.gz s3://your-bucket/backups/
```

### Recovery Procedure

```bash
# Restore from backup
gunzip backup-20240115.sql.gz
psql $DATABASE_URL < backup-20240115.sql
```

## Health Checks

### Add Health Endpoint

```javascript
// server.js
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});
```

### Monitor Health

```bash
# Test endpoint
curl https://api.yourdomain.com/health

# Set up monitoring
# (Use Uptime Robot, Datadog, etc.)
```

## Common Issues

### Database Connection Failed

```
Error: connect ECONNREFUSED
```

**Solution**:
- Check DATABASE_URL
- Verify database is accessible
- Check firewall rules
- Restart database service

### Build Fails

```
Error: Module not found
```

**Solution**:
- Run `pnpm install` before build
- Check Node.js version compatibility
- Check for typos in imports
- Clear cache: `pnpm clean`

### Memory Issues

```
Error: JavaScript heap out of memory
```

**Solution**:
- Increase Node.js memory: `node --max-old-space-size=4096 app.js`
- Optimize code
- Check for memory leaks

### CORS Errors

```
Access-Control-Allow-Origin header missing
```

**Solution**:
- Check CORS_ORIGIN in .env
- Verify frontend URL matches
- Check CORS middleware configuration

## Scaling Strategies

### Horizontal Scaling

```
Load Balancer
    ├── Server 1
    ├── Server 2
    └── Server 3
         │
    Database (Primary)
         │
    Replicas (Read-only)
```

### Vertical Scaling

- Increase server resources (RAM, CPU)
- Upgrade database instance
- Optimize code and queries

## Post-Deployment

### Monitoring Checklist

- [ ] Set up uptime monitoring
- [ ] Configure error tracking
- [ ] Enable application logging
- [ ] Set up performance monitoring
- [ ] Configure alerts
- [ ] Test rollback procedures

### Maintenance Schedule

- Daily: Check logs and monitoring
- Weekly: Run performance reports
- Monthly: Review security logs
- Quarterly: Update dependencies
- Annually: Full security audit

## Next Steps

- Set up [Monitoring and Alerts](../faq/troubleshooting.md)
- Review [Security Best Practices](../faq/common-issues.md)
- Explore [API Documentation](../api/overview.md)
- Check [Troubleshooting Guide](../faq/troubleshooting.md)

## Resources

- [Vercel Deployment](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app)
- [Let's Encrypt](https://letsencrypt.org)
- [Sentry Error Tracking](https://sentry.io)

Happy deploying! 🚀
