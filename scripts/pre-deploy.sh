#!/bin/bash

# Pre-Deployment Cleanup and Check Script
# Run this before deploying to catch issues early

set -e

echo "🚀 Blackjack Docs - Pre-Deployment Check"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track status
ERRORS=0
WARNINGS=0

# 1. Check Node version
echo "1️⃣  Checking Node version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo -e "${RED}✗ Node.js version too old. Need v18+${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
fi

# 2. Check pnpm
echo ""
echo "2️⃣  Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
  echo -e "${RED}✗ pnpm not installed${NC}"
  echo "  Install with: npm install -g pnpm"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✓ pnpm $(pnpm -v)${NC}"
fi

# 3. Install dependencies
echo ""
echo "3️⃣  Installing dependencies..."
pnpm install --frozen-lockfile

# 4. Run route diagnostics
echo ""
echo "4️⃣  Running route diagnostics..."
if [ -f "scripts/check-routes.js" ]; then
  if pnpm check:routes; then
    echo -e "${GREEN}✓ All routes valid${NC}"
  else
    echo -e "${YELLOW}⚠ Route issues detected${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${YELLOW}⚠ Route checker not found (skipping)${NC}"
fi

# 5. Check for TypeScript errors
echo ""
echo "5️⃣  Checking for TypeScript errors..."
if pnpm astro check; then
  echo -e "${GREEN}✓ No TypeScript errors${NC}"
else
  echo -e "${RED}✗ TypeScript errors found${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 6. Test build
echo ""
echo "6️⃣  Testing production build..."
if pnpm build; then
  echo -e "${GREEN}✓ Build successful${NC}"
  
  # Check dist size
  DIST_SIZE=$(du -sh dist | cut -f1)
  echo "  Build size: $DIST_SIZE"
  
else
  echo -e "${RED}✗ Build failed${NC}"
  ERRORS=$((ERRORS + 1))
fi

# 7. Check for common issues
echo ""
echo "7️⃣  Checking for common issues..."

# Check for console.log in production code
if grep -r "console.log" src/components --include="*.tsx" --include="*.ts" -q; then
  echo -e "${YELLOW}⚠ Found console.log statements in components${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# Check for TODO comments
TODO_COUNT=$(grep -r "TODO" src --include="*.tsx" --include="*.ts" --include="*.astro" | wc -l || echo "0")
if [ "$TODO_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠ Found $TODO_COUNT TODO comments${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# Check for large files
echo "  Checking for large files..."
find dist -type f -size +1M 2>/dev/null | while read file; do
  SIZE=$(du -h "$file" | cut -f1)
  echo -e "  ${YELLOW}⚠ Large file: $file ($SIZE)${NC}"
  WARNINGS=$((WARNINGS + 1))
done

# 8. Check Git status
echo ""
echo "8️⃣  Checking Git status..."
if [ -d ".git" ]; then
  if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠ Uncommitted changes${NC}"
    git status --short
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${GREEN}✓ Working tree clean${NC}"
  fi
else
  echo -e "${YELLOW}⚠ Not a Git repository${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# 9. Check for required files
echo ""
echo "9️⃣  Checking deployment files..."

if [ ! -f "package.json" ]; then
  echo -e "${RED}✗ package.json missing${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✓ package.json${NC}"
fi

if [ ! -f "astro.config.mjs" ]; then
  echo -e "${RED}✗ astro.config.mjs missing${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✓ astro.config.mjs${NC}"
fi

if [ ! -f ".gitignore" ]; then
  echo -e "${YELLOW}⚠ .gitignore missing${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✓ .gitignore${NC}"
fi

# 10. Final summary
echo ""
echo "=========================================="
echo "📊 Summary"
echo "=========================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✨ All checks passed! Ready to deploy! ✨${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. git add ."
  echo "  2. git commit -m 'Ready for deployment'"
  echo "  3. git push"
  echo "  4. Deploy to Vercel or Netlify"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
  echo ""
  echo "You can deploy, but consider fixing warnings first."
  exit 0
else
  echo -e "${RED}✗ $ERRORS error(s) and $WARNINGS warning(s) found${NC}"
  echo ""
  echo "Please fix errors before deploying."
  exit 1
fi
