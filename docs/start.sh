#!/bin/bash

# Docusaurus Site Startup Script

echo "🚀 Starting Micro-SaaS Documentation Site..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo ""
fi

# Check if .docusaurus exists
if [ ! -d ".docusaurus" ]; then
    echo "🔨 Building Docusaurus..."
    pnpm build
    echo ""
fi

echo "✅ Starting development server..."
echo "📍 Documentation site will be available at: http://localhost:3000"
echo ""

pnpm start
