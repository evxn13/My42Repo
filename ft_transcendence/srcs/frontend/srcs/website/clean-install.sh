#!/bin/bash

echo "🧹 Cleaning frontend installation..."

# Remove potential problematic files
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml
rm -f .vite
rm -f vite.config.ts.timestamp-*

echo "🔧 Fresh npm install..."
npm install

echo "✅ Clean installation completed!" 