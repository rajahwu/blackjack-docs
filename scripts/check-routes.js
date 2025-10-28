#!/usr/bin/env node

/**
 * Route Diagnostic Script for Blackjack Docs
 * 
 * Run this script to check for routing issues:
 * node scripts/check-routes.js
 * 
 * Or add to package.json:
 * "scripts": {
 *   "check:routes": "node scripts/check-routes.js"
 * }
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(color, ...args) {
  console.log(color, ...args, COLORS.reset);
}

function logSection(title) {
  console.log('\n' + COLORS.cyan + '═'.repeat(60) + COLORS.reset);
  console.log(COLORS.bright + COLORS.cyan + title + COLORS.reset);
  console.log(COLORS.cyan + '═'.repeat(60) + COLORS.reset + '\n');
}

function checkFileExists(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  return fs.existsSync(fullPath);
}

function findFiles(dir, pattern, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, pattern, results);
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }
  
  return results;
}

function analyzeRouteFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Check for getStaticPaths
  const hasGetStaticPaths = /export\s+async\s+function\s+getStaticPaths/.test(content);
  
  // Check for dynamic segments
  const isDynamic = /\[.*?\]/.test(path.basename(filePath));
  const isCatchAll = /\[\.\.\..*?\]/.test(path.basename(filePath));
  
  // Expected URL pattern
  let urlPattern = relativePath
    .replace(/^src\/pages/, '')
    .replace(/\.astro$/, '')
    .replace(/\/index$/, '/')
    .replace(/\[\.\.\.(\w+)\]/g, ':$1*')
    .replace(/\[(\w+)\]/g, ':$1');
  
  if (!urlPattern.endsWith('/') && !urlPattern.includes(':')) {
    urlPattern += '/';
  }
  
  return {
    file: relativePath,
    urlPattern,
    isDynamic,
    isCatchAll,
    hasGetStaticPaths,
    needsGetStaticPaths: isDynamic && !hasGetStaticPaths,
  };
}

function checkImportPaths(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];
  
  // Check for relative imports
  const importPattern = /import\s+.*?from\s+['"](.+?)['"]/g;
  let match;
  
  while ((match = importPattern.exec(content)) !== null) {
    const importPath = match[1];
    
    // Skip node_modules and absolute imports
    if (!importPath.startsWith('.')) continue;
    
    const fileDir = path.dirname(filePath);
    const resolvedPath = path.resolve(fileDir, importPath);
    
    // Try common extensions
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.astro'];
    const exists = extensions.some(ext => {
      const fullPath = resolvedPath + ext;
      return fs.existsSync(fullPath);
    });
    
    if (!exists && !fs.existsSync(resolvedPath)) {
      issues.push({
        import: importPath,
        line: content.substring(0, match.index).split('\n').length,
        resolved: resolvedPath,
      });
    }
  }
  
  return issues;
}

async function main() {
  logSection('🔍 Blackjack Docs Route Diagnostics');
  
  // 1. Check critical files
  logSection('📁 Checking Critical Files');
  
  const criticalFiles = [
    'src/pages/index.astro',
    'src/pages/blackjack/index.astro',
    'src/pages/blackjack/overview.astro',
    'src/pages/blackjack/drills/index.astro',
    'src/layouts/BaseLayout.astro',
    'src/utils/cards.ts',
  ];
  
  let allFilesExist = true;
  
  for (const file of criticalFiles) {
    const exists = checkFileExists(file);
    if (exists) {
      log(COLORS.green, '✓', file);
    } else {
      log(COLORS.red, '✗', file, '(MISSING)');
      allFilesExist = false;
    }
  }
  
  // 2. Analyze all route files
  logSection('🗺️  Analyzing Route Structure');
  
  const pagesDir = path.join(process.cwd(), 'src/pages');
  if (!fs.existsSync(pagesDir)) {
    log(COLORS.red, '✗ src/pages directory not found!');
    process.exit(1);
  }
  
  const routeFiles = findFiles(pagesDir, /\.astro$/);
  const routes = routeFiles.map(analyzeRouteFile);
  
  console.log('Found', COLORS.bright + routes.length + COLORS.reset, 'route files:\n');
  
  // Group by type
  const staticRoutes = routes.filter(r => !r.isDynamic);
  const dynamicRoutes = routes.filter(r => r.isDynamic && !r.isCatchAll);
  const catchAllRoutes = routes.filter(r => r.isCatchAll);
  
  // Static routes
  if (staticRoutes.length > 0) {
    log(COLORS.magenta, '\nStatic Routes:');
    for (const route of staticRoutes) {
      log(COLORS.green, '  ✓', route.urlPattern, COLORS.reset + '→', route.file);
    }
  }
  
  // Dynamic routes
  if (dynamicRoutes.length > 0) {
    log(COLORS.magenta, '\nDynamic Routes:');
    for (const route of dynamicRoutes) {
      const status = route.needsGetStaticPaths ? COLORS.red + '✗' : COLORS.green + '✓';
      log(status, route.urlPattern, COLORS.reset + '→', route.file);
      if (route.needsGetStaticPaths) {
        log(COLORS.yellow, '    ⚠️  Missing getStaticPaths()');
      }
    }
  }
  
  // Catch-all routes
  if (catchAllRoutes.length > 0) {
    log(COLORS.magenta, '\nCatch-All Routes:');
    for (const route of catchAllRoutes) {
      const status = route.needsGetStaticPaths ? COLORS.red + '✗' : COLORS.yellow + '⚠️ ';
      log(status, route.urlPattern, COLORS.reset + '→', route.file);
      if (route.needsGetStaticPaths) {
        log(COLORS.yellow, '    ⚠️  Missing getStaticPaths()');
      }
      log(COLORS.yellow, '    ⚠️  Catch-all routes can shadow other routes!');
    }
  }
  
  // 3. Check for potential conflicts
  logSection('⚠️  Checking for Route Conflicts');
  
  let hasConflicts = false;
  
  // Check for catch-all routes that might shadow others
  for (const catchAll of catchAllRoutes) {
    const basePattern = catchAll.urlPattern.split(':')[0];
    const shadowed = routes.filter(r => 
      r !== catchAll && 
      r.urlPattern.startsWith(basePattern) &&
      !r.isDynamic
    );
    
    if (shadowed.length > 0) {
      hasConflicts = true;
      log(COLORS.red, '✗ Potential conflict:');
      log(COLORS.yellow, '  Catch-all:', catchAll.file);
      log(COLORS.yellow, '  May shadow:', shadowed.map(r => r.file).join(', '));
    }
  }
  
  if (!hasConflicts) {
    log(COLORS.green, '✓ No obvious route conflicts detected');
  }
  
  // 4. Check import paths
  logSection('🔗 Checking Import Paths');
  
  const componentsDir = path.join(process.cwd(), 'src/components');
  const reactComponents = fs.existsSync(componentsDir) ? 
    findFiles(componentsDir, /\.(tsx|jsx)$/) : [];
  
  let importIssues = 0;
  
  for (const file of [...routeFiles, ...reactComponents]) {
    const issues = checkImportPaths(file);
    if (issues.length > 0) {
      importIssues += issues.length;
      log(COLORS.red, '\n✗', path.relative(process.cwd(), file));
      for (const issue of issues) {
        log(COLORS.yellow, `  Line ${issue.line}:`, issue.import, '→', issue.resolved);
      }
    }
  }
  
  if (importIssues === 0) {
    log(COLORS.green, '✓ All import paths appear valid');
  } else {
    log(COLORS.red, `\n✗ Found ${importIssues} import path issues`);
  }
  
  // 5. Summary
  logSection('📊 Summary');
  
  console.log('Total routes:', COLORS.bright + routes.length + COLORS.reset);
  console.log('Static routes:', COLORS.green + staticRoutes.length + COLORS.reset);
  console.log('Dynamic routes:', COLORS.cyan + dynamicRoutes.length + COLORS.reset);
  console.log('Catch-all routes:', COLORS.yellow + catchAllRoutes.length + COLORS.reset);
  
  const missingGetStaticPaths = routes.filter(r => r.needsGetStaticPaths).length;
  if (missingGetStaticPaths > 0) {
    log(COLORS.red, '\n⚠️  Warning:', missingGetStaticPaths, 'dynamic routes missing getStaticPaths()');
  }
  
  if (hasConflicts) {
    log(COLORS.red, '⚠️  Warning: Potential route conflicts detected');
  }
  
  if (importIssues > 0) {
    log(COLORS.red, '⚠️  Warning:', importIssues, 'import path issues found');
  }
  
  console.log('\n');
  
  // Exit code
  if (!allFilesExist || missingGetStaticPaths > 0 || hasConflicts || importIssues > 0) {
    log(COLORS.yellow, '⚠️  Some issues were found. Please review the output above.');
    process.exit(1);
  } else {
    log(COLORS.green, '✓ All checks passed!');
    process.exit(0);
  }
}