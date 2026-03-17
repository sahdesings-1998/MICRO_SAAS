---
sidebar_position: 3
---

# Installation Guide 🔧

Step-by-step guide to set up Micro-SaaS on your computer.

## What Do You Need? ✅

Before starting, make sure you have:

| What | Version | Download |
|------|---------|----------|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |
| **Code Editor** | Any | [VS Code](https://code.visualstudio.com) recommended |

Check if you have them:
```bash
node --version    # Should show v18 or higher
git --version     # Should show git version
```

## Installation Steps 📝

### Step 1: Download the Project 📥

```bash
git clone https://github.com/sahdesings-1998/MICRO_SAAS.git
cd MICRO_SAAS
```

### Step 2: Install Backend (Server) 🔧

```bash
cd server
pnpm install
```

> **Note**: We use `pnpm` - it's faster than npm. If you don't have it:
> ```bash
> npm install -g pnpm
> ```

### Step 3: Create Server Settings 🔐

Inside the `server` folder, create a new file named `.env`:

```env
# Copy this into your .env file
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/micro-saas
JWT_SECRET=your_secret_key_123
PORT=5000
NODE_ENV=development
```

**How to get MongoDB:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Replace `username:password` in the `.env` file

### Step 4: Install Frontend (Client) 🎨

Open a **new terminal** in the project folder:

```bash
cd client
pnpm install
```

### Step 5: Create Client Settings ⚙️

Inside the `client` folder, create a `.env` file:

```env
# Copy this into your .env file
VITE_API_URL=http://localhost:5000
```

## Testing Your Setup ✅

### Terminal 1: Start Backend
```bash
cd server
pnpm start
```

You should see:
```
✅ Server running on http://localhost:5000
```

### Terminal 2: Start Frontend
```bash
cd client
pnpm dev
```

You should see:
```
✅ Local: http://localhost:5173
```

### Open in Browser 🌐
Visit **http://localhost:5173** and you should see the Micro-SaaS app!

## Common Issues 🆘

**"Command not found: pnpm"**
```bash
npm install -g pnpm
```

**"MongoDB connection failed"**
- Check your `.env` file has correct MongoDB URL
- Make sure your IP is whitelisted in MongoDB Atlas

**"Port 5000 is already in use"**
- Change `PORT=5000` to `PORT=5001` in `.env`

**"Module not found errors"**
```bash
# Delete old files and reinstall
rm -rf node_modules
pnpm install
```

## Next Steps 🚀

1. ✅ Server running on port 5000
2. ✅ Client running on port 5173
3. ✅ Next: Read [How It Works](./architecture)
4. ✅ Then: Check [API Reference](../api/overview)

### 3. Install Package Manager (pnpm - Optional but Recommended)

```bash
npm install -g pnpm
pnpm --version
```

### 4. Set Up Backend

```bash
cd server
pnpm install
# or
npm install
```

Create `.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/micro_saas

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# API Configuration
API_URL=http://localhost:5000
API_PREFIX=/api
```

### 5. Set Up Frontend

```bash
cd ../client
pnpm install
# or
npm install
```

Create `.env` file or `.env.local`:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Micro-SaaS
```

### 6. Database Setup

Before running the server, ensure your database is ready:

#### Using PostgreSQL

**On macOS (with Homebrew)**:
```bash
brew install postgresql
brew services start postgresql
createdb micro_saas
```

**On Ubuntu/Debian**:
```bash
sudo apt-get install postgresql
sudo -u postgres createdb micro_saas
```

**On Windows**:
- Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run the installer and complete the setup
- Create database using pgAdmin or psql

### 7. Initialize Database

```bash
cd server
# Run migrations (if applicable)
pnpm run migrate
# or seed initial data
pnpm run seed
```

### 8. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd server
pnpm dev
```

**Terminal 2 - Frontend**:
```bash
cd client
pnpm dev
```

**Terminal 3 - Documentation (Optional)**:
```bash
cd docs
pnpm install
pnpm start
```

### 9. Verify Installation

- Backend API: http://localhost:5000
- Frontend App: http://localhost:5173 (or configured port)
- Documentation: http://localhost:3000 (if running docs)

Test the API:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Troubleshooting

### Port Already in Use

If port 5000 is already in use, change it in `.env`:
```env
PORT=5001
```

### Database Connection Error

Check your `DATABASE_URL`:
```bash
# Test connection
psql $DATABASE_URL
```

### Dependencies Installation Failed

Clear cache and reinstall:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### CORS Error

Ensure `CORS_ORIGIN` in `.env` matches your frontend URL:
```env
CORS_ORIGIN=http://localhost:3000
```

## Next Steps

1. Read the [Getting Started](../getting-started.md) guide
2. Explore the [Guides](../guides/introduction.md) section
3. Check the [API Reference](../api/overview.md)
4. Review the [Architecture](./architecture.md) documentation

## Useful Commands

```bash
# Backend
cd server
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run tests
pnpm lint         # Run linter

# Frontend
cd client
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run linter

# Documentation
cd docs
pnpm start        # Start documentation site
pnpm build        # Build documentation
```

## Need Help?

- Check the [FAQ](../faq/troubleshooting.md)
- Review [Common Issues](../faq/common-issues.md)
- Open an issue on GitHub
- Contact the support team
