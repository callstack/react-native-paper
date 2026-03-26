const fs = require('fs');
const path = require('path');

const LIB_DIR = path.resolve(__dirname, '..', 'lib');
const ALIAS_PREFIX = '@/';

// Recursively find all files with given extensions
function findFiles(dir, extensions) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

// Given a file path inside lib/<target>/..., compute the relative path
// from the file's directory to the target root (e.g. lib/commonjs/)
function resolveAlias(filePath, targetRoot, importPath) {
  if (!importPath.startsWith(ALIAS_PREFIX)) {
    return importPath;
  }

  const stripped = importPath.slice(ALIAS_PREFIX.length);
  const fileDir = path.dirname(filePath);
  let relativePath = path.relative(fileDir, path.join(targetRoot, stripped));

  // Ensure it starts with ./ or ../
  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`;
  }

  return relativePath;
}

// Patterns that match import/require statements with @/ aliases
// Handles: require("@/..."), from '@/...', from "@/...", import("@/...")
const IMPORT_PATTERN =
  /(require\(["']|from\s+["']|import\(["'])(@\/[^"']+)(["'])/g;

function processFile(filePath, targetRoot) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content.replace(
    IMPORT_PATTERN,
    (_match, prefix, importPath, suffix) => {
      const resolved = resolveAlias(filePath, targetRoot, importPath);
      return prefix + resolved + suffix;
    }
  );

  if (content !== updated) {
    fs.writeFileSync(filePath, updated);
    return true;
  }
  return false;
}

// Process each build target directory
const targets = [
  { dir: 'commonjs', extensions: ['.js', '.js.map'] },
  { dir: 'module', extensions: ['.js', '.js.map'] },
  { dir: 'typescript', extensions: ['.d.ts', '.d.ts.map'] },
];

let totalResolved = 0;

for (const target of targets) {
  const targetDir = path.join(LIB_DIR, target.dir);
  if (!fs.existsSync(targetDir)) {
    continue;
  }

  const files = findFiles(targetDir, target.extensions);
  let count = 0;

  for (const file of files) {
    if (processFile(file, targetDir)) {
      count++;
    }
  }

  if (count > 0) {
    console.log(`Resolved aliases in ${count} files in lib/${target.dir}/`);
    totalResolved += count;
  }
}

if (totalResolved > 0) {
  console.log(`Done — resolved @/ aliases in ${totalResolved} files total.`);
} else {
  console.log('No @/ aliases found in build output.');
}
