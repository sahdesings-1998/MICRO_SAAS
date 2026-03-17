---
sidebar_position: 1
---

# Getting Started with Documentation

Quick guide to access and use the Micro-SaaS documentation site.

## Starting the Documentation Site

The documentation site runs independently from the main application and can be started separately.

### Prerequisites

- Node.js v18+ installed
- pnpm or npm package manager

### Option 1: Using Scripts (Recommended)

**On Windows**:
```bash
cd docs
start.bat
```

**On macOS/Linux**:
```bash
cd docs
chmod +x start.sh
./start.sh
```

### Option 2: Manual Start

```bash
cd docs

# Install dependencies (first time only)
pnpm install

# Start development server
pnpm start

# Site opens at http://localhost:3000
```

### Option 3: Using npm instead of pnpm

```bash
cd docs

# Install dependencies
npm install

# Start development server
npm run start
```

## Available Commands

```bash
cd docs

# Start development server
pnpm start

# Build for production
pnpm build

# Serve production build locally
pnpm serve

# Clear build cache
pnpm clear

# Deploy (if configured)
pnpm deploy
```

## Documentation Site Features

### Navigation

- **Top Navigation Bar**: Quick access to main sections
- **Sidebar**: Browse all documentation pages
- **Search**: Full-text search across all pages (use search icon)
- **Breadcrumbs**: Navigate document hierarchy

### Sections

1. **Introduction** - Project overview and architecture
2. **Guides** - Step-by-step instructions
3. **API Reference** - Complete endpoint documentation
4. **FAQ** - Troubleshooting and common issues
5. **Blog** - Updates and announcements

### Theme Toggle

- Use the moon/sun icon in the top-right to toggle dark/light mode
- Your preference is automatically saved

## Accessing the Docs

### Local Development

```
http://localhost:3000
```

### Features
- Hot reload on file changes
- Full-text search
- Code syntax highlighting
- Mobile responsive
- Light and dark themes

## Project Structure

```
docs/
├── docs/                    # Documentation pages
│   ├── getting-started.md
│   ├── introduction/        # Intro section
│   ├── guides/             # How-to guides
│   ├── api/                # API documentation
│   └── faq/                # FAQ section
├── blog/                   # Blog posts
├── src/
│   ├── css/               # Styling
│   └── components/        # Custom React components
├── docusaurus.config.js   # Main configuration
├── sidebars.js           # Navigation structure
├── package.json
├── README.md
├── start.sh              # Start script (Linux/macOS)
└── start.bat             # Start script (Windows)
```

## Editing Documentation

### Adding a New Page

1. Create a `.md` file in the appropriate directory
2. Add frontmatter at the top:

```markdown
---
sidebar_position: 1
---

# Page Title

Your content here...
```

3. File appears automatically in navigation

### Updating Sidebar

Edit `sidebars.js` to reorganize sections and pages.

### Styling

Custom CSS: `src/css/custom.css`

### Theme Configuration

Edit `docusaurus.config.js` to:
- Change site title and description
- Update navbar and footer
- Configure colors
- Add custom menus

## Deployment

### Build for Production

```bash
cd docs
pnpm build

# Output in: docs/build/
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build first
pnpm build

# Then deploy the 'build' folder to Netlify
```

### Other Hosting Options

- GitHub Pages
- AWS Amplify
- Firebase Hosting
- Cloudflare Pages

See [Deployment Guide](./guides/deployment) for detailed instructions.

## Customization

### Change Site Title

Edit `docusaurus.config.js`:
```javascript
const config = {
  title: 'My SaaS Docs',
  // ...
};
```

### Add Navigation Links

Edit `docusaurus.config.js` in the `themeConfig`:
```javascript
navbar: {
  items: [
    {
      type: 'docSidebar',
      sidebarId: 'tutorialSidebar',
      label: 'Documentation',
    },
    { to: '/blog', label: 'Blog' },
  ],
}
```

### Change Colors

Edit `src/css/custom.css`:
```css
:root {
  --ifm-color-primary: #2563eb;
}
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Change port in docusaurus.config.js or use:
pnpm start -- --port 3001
```

### Build Fails

```bash
# Clear cache and rebuild
pnpm clear
pnpm build
```

### Content Not Updating

```bash
# Restart dev server
# Press Ctrl+C and run:
pnpm start
```

## Best Practices

✅ **DO**:
- Keep documentation updated with code
- Use clear, concise language
- Include code examples
- Link between related sections
- Add indexes and metadata to pages

❌ **DON'T**:
- Leave outdated information
- Skip important details
- Forget to update sidebar
- Use broken links
- Ignore documentation warnings

## Next Steps

- Read [Introduction](./introduction/overview)
- Check [Installation Guide](./introduction/installation)
- Explore [Guides](./guides/introduction)
- Review [API Reference](./api/overview)

## Documentation Resources

- [Docusaurus Docs](https://docusaurus.io)
- [Markdown Guide](https://www.markdownguide.org)
- [Front Matter Reference](https://docusaurus.io/docs/markdown-features/front-matter)

## Support

- Check [Troubleshooting](./faq/troubleshooting)
- See [Common Issues](./faq/common-issues)
- Review [FAQ](../faq/)

---

**Happy documenting! The documentation site is ready to use.** 📚
