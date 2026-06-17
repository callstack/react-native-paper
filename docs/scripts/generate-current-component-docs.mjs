import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const parseComponentDocs =
  require('component-docs/dist/parsers/component').default;
const generatePageMDX = require('../component-docs-plugin/generatePageMDX');
const componentDocsConfig = require('../component-docs.config');

const rootDir = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '..'
);
const repoRootDir = path.resolve(rootDir, '..');
const outputDir = componentDocsConfig.docsRootDir;
const metadataPath = path.join(rootDir, 'src', 'data', 'componentDocs6x.json');

const isRecord = (value) => typeof value === 'object' && value !== null;

const normalizeDocs = (value, sourceDir) => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeDocs(item, sourceDir));
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (key !== 'dependencies' || !Array.isArray(item)) {
        return [key, normalizeDocs(item, sourceDir)];
      }

      return [
        key,
        item.map((dependency) => {
          if (typeof dependency !== 'string' || !path.isAbsolute(dependency)) {
            return dependency;
          }

          const realDependency = fs.existsSync(dependency)
            ? fs.realpathSync(dependency)
            : dependency;
          const relativeDependency = path.relative(sourceDir, realDependency);

          if (
            relativeDependency.startsWith('..') ||
            path.isAbsolute(relativeDependency)
          ) {
            return dependency;
          }

          return relativeDependency.split(path.sep).join('/');
        }),
      ];
    })
  );
};

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const writeJson = (filePath, value) => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const writeDocPage = (targetPath, sourcePath, docs) => {
  const doc = parseComponentDocs(sourcePath, {
    root: componentDocsConfig.libsRootDir,
  });

  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(
    targetPath,
    generatePageMDX(
      doc,
      path
        .relative(componentDocsConfig.libsRootDir, sourcePath)
        .replace(/\.tsx$/, '')
        .split(path.sep)
        .join('/'),
      { version: '6.x' }
    )
  );

  docs[
    path
      .relative(componentDocsConfig.libsRootDir, sourcePath)
      .replace(/\.tsx$/, '')
      .split(path.sep)
      .join('/')
  ] = doc;
};

const writeMetaFiles = () => {
  writeJson(
    path.join(outputDir, '_meta.json'),
    Object.entries(componentDocsConfig.pages).map(([entryName, pageValue]) => {
      if (typeof pageValue === 'string') {
        return entryName;
      }

      return {
        type: 'dir',
        name: entryName,
        label: entryName,
        collapsible: true,
        collapsed: false,
      };
    })
  );

  for (const [entryName, pageValue] of Object.entries(componentDocsConfig.pages)) {
    if (typeof pageValue === 'string') {
      continue;
    }

    writeJson(path.join(outputDir, entryName, '_meta.json'), Object.keys(pageValue));
  }
};

const main = () => {
  fs.rmSync(outputDir, { recursive: true, force: true });
  ensureDir(outputDir);

  const docs = {};

  for (const [entryName, pageValue] of Object.entries(componentDocsConfig.pages)) {
    if (typeof pageValue === 'string') {
      writeDocPage(
        path.join(outputDir, `${entryName}.mdx`),
        path.join(componentDocsConfig.libsRootDir, `${pageValue}.tsx`),
        docs
      );
      continue;
    }

    const groupDir = path.join(outputDir, entryName);

    for (const [subitem, source] of Object.entries(pageValue)) {
      writeDocPage(
        path.join(groupDir, `${subitem}.mdx`),
        path.join(componentDocsConfig.libsRootDir, `${source}.tsx`),
        docs
      );
    }
  }

  ensureDir(path.dirname(metadataPath));
  fs.writeFileSync(
    metadataPath,
    `${JSON.stringify(
      {
        docs: normalizeDocs(docs, fs.realpathSync(repoRootDir)),
      },
      null,
      2
      )}\n`
  );

  writeMetaFiles();
};

main();
