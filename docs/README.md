# Micro-SaaS Documentation

Welcome to the Micro-SaaS documentation site! This documentation provides everything you need to understand, develop, deploy, and maintain the Micro-SaaS platform.

## 📚 Documentation Structure

### [Getting Started](./docs/getting-started.md)
Quick setup guide to get the project running locally in minutes.

### [Introduction](./docs/introduction/)
- **[Overview](./docs/introduction/overview.md)** - Project architecture and features
- **[Architecture](./docs/introduction/architecture.md)** - System design and components
- **[Installation](./docs/introduction/installation.md)** - Detailed installation instructions

### [Guides](./docs/guides/)
Comprehensive guides for common tasks:
- **[Authentication Guide](./docs/guides/authentication.md)** - User authentication and JWT
- **[Database Guide](./docs/guides/database.md)** - Database setup and queries
- **[Deployment Guide](./docs/guides/deployment.md)** - Production deployment

### [API Reference](./docs/api/)
Complete API documentation:
- **[API Overview](./docs/api/overview.md)** - API basics and conventions
- **[Authentication API](./docs/api/authentication-api.md)** - Auth endpoints
- **[Members API](./docs/api/members-api.md)** - Member management
- **[Admins API](./docs/api/admins-api.md)** - Admin management

### [FAQ](./docs/faq/)
- **[Troubleshooting](./docs/faq/troubleshooting.md)** - Common issues and solutions
- **[Common Issues](./docs/faq/common-issues.md)** - Quick fixes

## 🚀 Quick Start

### Starting the Documentation Site Locally

```bash
# Install dependencies
cd docs
pnpm install

# Start development server
pnpm start

# Build for production
pnpm build

# Serve production build
pnpm serve
```

The documentation site will be available at `http://localhost:3000`

### Starting the Full Project

```bash
# Terminal 1 - Backend
cd server
pnpm install
pnpm dev

# Terminal 2 - Frontend
cd client
pnpm install
pnpm dev

# Terminal 3 - Documentation (optional)
cd docs
pnpm install
pnpm start
```

## 📖 Reading the Documentation

1. **New to the project?** Start with [Getting Started](./docs/getting-started.md)
2. **Want to understand the system?** Read [Architecture](./docs/introduction/architecture.md)
3. **Setting up locally?** Follow [Installation Guide](./docs/introduction/installation.md)
4. **Implementing features?** Check the relevant [Guide](./docs/guides/)
5. **Using the API?** See [API Reference](./docs/api/)
6. **Stuck?** Check [FAQ](./docs/faq/)

## 🛠️ Development

### Technology Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: PostgreSQL/MySQL
- **Documentation**: Docusaurus

### Project Structure

```
micro-saas/
├── client/           # React frontend
├── server/           # Node.js backend
├── docs/            # Docusaurus documentation (this folder)
│   ├── docs/        # Documentation pages
│   ├── blog/        # Blog posts
│   └── src/         # Custom components & styling
└── mdfiles/         # Additional markdown references
```

## 📝 Adding Documentation

### Creating a New Page

1. Create a `.md` file in the appropriate directory
2. Add frontmatter with title and position:

```markdown
---
sidebar_position: 1
---

# Page Title

Your content here...
```

3. Update `sidebars.js` if needed
4. The page will automatically appear in navigation

### Editing the Sidebar

Edit `sidebars.js` to organize documentation sections.

### Adding Blog Posts

Add `.md` files to the `blog/` directory. They'll automatically be dated and organized.

## 🎨 Customization

### Styling

- Edit CSS in `src/css/custom.css`
- Modify colors and branding in `docusaurus.config.js`

### Navbar and Footer

Edit `docusaurus.config.js` to customize:
- Navigation menu items
- Footer links
- Branding and logo

### Configuration

Main configuration file: `docusaurus.config.js`

Key settings:
- Site title and domain
- GitHub repo links
- Social profiles
- Theme colors
- Syntax highlighting

## 🔗 Useful Links

- [Docusaurus Documentation](https://docusaurus.io)
- [Markdown Guide](https://www.markdownguide.org)
- [Project GitHub](https://github.com/your-org/micro-saas)

## 💡 Best Practices

✅ **DO**:
- Keep documentation up-to-date with code
- Include code examples and real use cases
- Provide clear step-by-step instructions
- Link between related sections
- Use consistent formatting

❌ **DON'T**:
- Let documentation fall out of sync with code
- Write overly technical content without explanation
- Forget to update docs when changing features
- Use inconsistent terminology
- Skip important details

## 📞 Support

- **Issues?** Check [FAQ](./docs/faq/)
- **Bugs?** Open an issue on GitHub
- **Questions?** See [Common Issues](./docs/faq/common-issues.md)

## 📅 Documentation Updates

This documentation is actively maintained and updated as the project evolves. Last updated: 2024-01-15

---

**Happy learning! 🎓 The documentation is here to help you succeed with Micro-SaaS.**
