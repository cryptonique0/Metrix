#!/usr/bin/env bash

# LlamaFlow - Verification Checklist
# Run this to verify all components are in place

echo "🦙 LlamaFlow - Complete Implementation Checklist"
echo "================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1 (MISSING)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        return 0
    else
        echo -e "${RED}❌${NC} $1/ (MISSING)"
        return 1
    fi
}

# Configuration files
echo "📋 Configuration Files:"
check_file "package.json"
check_file "tsconfig.json"
check_file "jest.config.cjs"
check_file "vite.config.ts"
check_file "tailwind.config.js"
check_file "postcss.config.js"
check_file ".env.example"
check_file ".gitignore"
echo ""

# Backend source files
echo "🔧 Backend Source (src/):"
check_dir "src"
check_file "src/index.ts"
check_file "src/server.ts"
check_dir "src/db"
check_file "src/db/init.ts"
check_file "src/db/connection.ts"
check_dir "src/routes"
check_file "src/routes/protocols.ts"
check_file "src/routes/metrics.ts"
check_file "src/routes/adapters.ts"
check_dir "src/services"
check_file "src/services/coingecko.ts"
check_file "src/services/metrics.ts"
check_dir "src/adapters/sample"
check_file "src/adapters/sample/index.ts"
check_dir "src/utils"
check_file "src/utils/cache.ts"
echo ""

# Frontend source files
echo "⚛️  Frontend Source (web/):"
check_dir "web"
check_file "web/index.html"
check_dir "web/src"
check_file "web/src/main.tsx"
check_file "web/src/Dashboard.tsx"
check_file "web/src/index.css"
check_dir "web/src/components"
check_file "web/src/components/ProtocolCard.tsx"
check_file "web/src/components/StatsPanel.tsx"
check_file "web/src/components/LoadingSpinner.tsx"
echo ""

# Test files
echo "✅ Test Files (__tests__/):"
check_dir "__tests__"
check_file "__tests__/server.integration.test.ts"
check_file "__tests__/sampleAdapter.test.ts"
check_file "__tests__/cache.test.ts"
check_file "__tests__/metrics.test.ts"
echo ""

# Documentation
echo "📚 Documentation:"
check_file "README.md"
check_file "QUICKSTART.md"
check_file "CONTRIBUTING.md"
check_file "IMPLEMENTATION.md"
check_file "COMPLETE.md"
check_file "LICENSE"
echo ""

# Docker files
echo "🐳 Docker Files:"
check_file "Dockerfile"
check_file "docker-compose.yml"
echo ""

# GitHub files
echo "🔄 GitHub Files:"
check_dir ".github"
check_dir ".github/workflows"
check_file ".github/workflows/test.yml"
check_file ".github/workflows/docker.yml"
echo ""

# Setup scripts
echo "🔧 Setup Scripts:"
check_file "setup.sh"
check_file "setup.bat"
echo ""

echo "================================================="
echo ""

# Check Node.js version
echo "🔍 Environment Checks:"
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${GREEN}✅${NC} Node.js $NODE_VERSION (>=18 required)"
    else
        echo -e "${RED}❌${NC} Node.js $NODE_VERSION (18+ required)"
    fi
else
    echo -e "${RED}❌${NC} Node.js not found"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅${NC} npm $NPM_VERSION"
else
    echo -e "${RED}❌${NC} npm not found"
fi

if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version 2>/dev/null)
    echo -e "${GREEN}✅${NC} $DOCKER_VERSION"
else
    echo -e "${YELLOW}⚠️${NC}  Docker not found (optional)"
fi

echo ""
echo "================================================="
echo ""

# Summary
echo "🎯 Next Steps:"
echo "1. npm install          # Install dependencies"
echo "2. npm run db:init      # Initialize database"
echo "3. npm test             # Run tests"
echo "4. npm run dev          # Start development"
echo "5. git add . && git commit && git push"
echo ""
echo "📖 Learn more:"
echo "   - README.md for full documentation"
echo "   - QUICKSTART.md for quick reference"
echo "   - IMPLEMENTATION.md for architecture details"
echo ""
