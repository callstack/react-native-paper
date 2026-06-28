import componentDocsParser from 'component-docs/dist/parsers/component.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ComponentDoc } from '../component-docs-plugin/generatePageMDX.ts';
import generatePageMDX from '../component-docs-plugin/generatePageMDX.ts';
import componentDocsConfig from '../component-docs.config.ts';

const parseComponentDocs = componentDocsParser.default;

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const repoRootDir = path.resolve(rootDir, '..');
const outputDir = componentDocsConfig.docsRootDir;
const metadataPath = path.join(rootDir, 'src', 'data', 'componentDocs6x.json');

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeDocs = (value: unknown, sourceDir: string): unknown => {
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

const ensureDir = (dirPath: string) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const writeJson = (filePath: string, value: unknown) => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const writeDocPage = (
  targetPath: string,
  sourcePath: string,
  docs: Record<string, ComponentDoc>
) => {
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
        .join('/')
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

  for (const [entryName, pageValue] of Object.entries(
    componentDocsConfig.pages
  )) {
    if (typeof pageValue === 'string') {
      continue;
    }

    writeJson(
      path.join(outputDir, entryName, '_meta.json'),
      Object.keys(pageValue)
    );
  }
};

const main = () => {
  fs.rmSync(outputDir, { recursive: true, force: true });
  ensureDir(outputDir);

  const docs: Record<string, ComponentDoc> = {};

  for (const [entryName, pageValue] of Object.entries(
    componentDocsConfig.pages
  )) {
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
  writeJson(metadataPath, {
    docs: normalizeDocs(docs, fs.realpathSync(repoRootDir)),
  });

  writeMetaFiles();
};

main();
