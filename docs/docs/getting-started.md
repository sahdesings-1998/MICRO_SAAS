---
sidebar_position: 1
title: Getting Started
---

# Getting Started with Micro-SaaS ✅

Welcome! Let's get **Micro-SaaS** running on your computer in **5 minutes**.

## What is Micro-SaaS? 🤔

Micro-SaaS is a complete **Software-as-a-Service** (SaaS) platform. Think of it like a starter template for building apps where users can:

✅ Create accounts and log in  
✅ Subscribe to plans (billing)  
✅ Get invoices  
✅ Manage their profile  

It's built with **modern, easy-to-learn** technologies:
- **React** - For the website/app people see
- **Node.js + Express** - The server (backend)
- **MongoDB** - Where data is stored

## Do You Have These? 💻

Before starting, make sure you have:
- ✅ Node.js installed ([Download here](https://nodejs.org))
- ✅ Git installed ([Download here](https://git-scm.com))
- ✅ A code editor (like [VS Code](https://code.visualstudio.com))

Check if you have them:
```bash
node --version
git --version
```

## 5-Minute Setup

### Step 1: Get the Code 📥

```bash
# Copy the project to your computer
git clone https://github.com/sahdesings-1998/MICRO_SAAS.git
cd MICRO_SAAS
```

### Step 2: Install Backend (Server) 🔧

```bash
cd server
pnpm install
```

### Step 3: Setup Server Secrets 🔐

Create a `.env` file inside the `server` folder. Add this:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/micro-saas
JWT_SECRET=my_super_secret_key_12345
PORT=5000
NODE_ENV=development
```

> Don't have MongoDB? Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Step 4: Install Frontend (Client) 🎨

Open a **new terminal** and run:

```bash
cd client
pnpm install
```

### Step 5: Start the App 🚀

**Terminal 1 - Start the Server:**
```bash
cd server
pnpm start
```

Should show: ✅ `Server running on http://localhost:5000`

**Terminal 2 - Start the Website:**
```bash
cd client
pnpm dev
```

Should show: ✅ `Local: http://localhost:5173`

### Step 6: Test It! 🎉

1. Open http://localhost:5173 in your browser
2. You should see the Micro-SaaS homepage
3. Try clicking "Login" or exploring the app

**Success!** Your app is running! 🎊

## What Can You Do Now?

- 👤 **Create users** - Make admin accounts
- 💰 **Add subscriptions** - Create payment plans  
- 📄 **Send invoices** - Generate billing docs
- 🔒 **Test login** - Use the authentication system

## Quick Tips 💡

- Keep **both terminals running** (server + client)
- `.env` files contain secrets - don't share them
- If something breaks, check [Troubleshooting](./faq/troubleshooting)
- Each part of the docs has **copy-paste code** examples

## What's Next?

1. 👉 Read [Installation Guide](./introduction/installation) for detailed help
2. 👉 Learn about [How It Works](./introduction/architecture)
3. 👉 Check [API Reference](./api/overview) to use the server
4. 👉 See [Authentication](./guides/authentication) to understand login

## Stuck? 🆘

Don't worry! Check these:
- **Something not working?** → [Common Issues](./faq/common-issues)
- **Need help?** → [Troubleshooting](./faq/troubleshooting)
- **Have a question?** → Check the [API docs](./api/overview)
- Check the [API Reference](./api/overview) to understand available endpoints
- Explore [Common Issues](./faq/common-issues) if you encounter any problems

## Support

For additional help:
- Check the [FAQ](./faq/troubleshooting) section
- Visit our GitHub repository
- Open an issue on GitHub

Happy coding! 🚀
