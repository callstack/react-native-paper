import type { RspressPlugin } from '@rspress/core';
import fs from 'node:fs';
import path from 'node:path';

import { createComponentParser } from './parser.ts';
import { renderComponentPage } from './render.ts';
import type { ComponentPageConfig } from './types.ts';
import type { Page, Pages } from '../../component-docs.config.ts';

type ComponentDocsPluginOptions = {
  customFields: {
    extendedExamples: Record<string, unknown>;
    knownIssues: Record<string, Record<string, string>>;
    moreExamples: Record<string, Record<string, string>>;
    screenshots: Record<string, unknown>;
    themeColors: Record<string, unknown>;
  };
  pages: Pages;
  sourceRootDir: string;
  tsconfigPath: string;
  version: string;
};

type MetaEntry =
  | {
      type: 'custom-link';
      label: string;
      link: string;
    }
  | {
      type: 'dir';
      name: string;
      label: string;
      collapsible: true;
      collapsed: false;
    };

const isPageConfig = (page: Page | Record<string, Page>): page is Page =>
  typeof page === 'string' || 'source' in page;

const normalizePage = (page: Page): ComponentPageConfig =>
  typeof page === 'string' ? { source: page } : page;

const flattenPages = (pages: Pages) =>
  Object.entries(pages).flatMap(([entryName, page]) => {
    if (isPageConfig(page)) {
      return [{ page: normalizePage(page), route: entryName }];
    }

    return Object.entries(page).map(([pageName, pageConfig]) => ({
      page: normalizePage(pageConfig),
      route: `${entryName}/${pageName}`,
    }));
  });

const writeJson = (filePath: string, value: unknown) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const createComponentLink = (route: string, title: string): MetaEntry => ({
  type: 'custom-link',
  label: title,
  link: `/docs/components/${route}`,
});

const writeNavigation = (
  rootDir: string,
  options: ComponentDocsPluginOptions,
  titles: ReadonlyMap<string, string>
) => {
  const componentsDir = path.join(
    rootDir,
    options.version,
    'docs',
    'components'
  );
  const getTitle = (route: string) => {
    const title = titles.get(route);

    if (!title) {
      throw new Error(`Missing parsed component docs for ${route}`);
    }

    return title;
  };

  fs.rmSync(componentsDir, { recursive: true, force: true });
  writeJson(
    path.join(componentsDir, '_meta.json'),
    Object.entries(options.pages).map(([entryName, page]): MetaEntry => {
      if (isPageConfig(page)) {
        return createComponentLink(entryName, getTitle(entryName));
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

  for (const [entryName, page] of Object.entries(options.pages)) {
    if (isPageConfig(page)) {
      continue;
    }

    writeJson(
      path.join(componentsDir, entryName, '_meta.json'),
      Object.keys(page).map((pageName) => {
        const route = `${entryName}/${pageName}`;

        return createComponentLink(route, getTitle(route));
      })
    );
  }
};

export const pluginComponentDocs = (
  options: ComponentDocsPluginOptions
): RspressPlugin => ({
  name: 'react-native-paper-component-docs',
  builderConfig: {
    dev: {
      watchFiles: {
        paths: path.join(options.sourceRootDir, '**/*.tsx'),
        type: 'reload-server',
      },
    },
  },
  addPages(config) {
    if (!config.root) {
      throw new Error('Rspress root is required to generate component docs');
    }

    const parse = createComponentParser(options.tsconfigPath);
    const pages = flattenPages(options.pages).map(({ page, route }) => ({
      doc: parse(options.sourceRootDir, page),
      route,
      routePath: `/${options.version}/docs/components/${route}`,
    }));
    const routes = new Set(pages.map(({ routePath }) => routePath));
    const titles = new Map(pages.map(({ doc, route }) => [route, doc.title]));

    writeNavigation(config.root, options, titles);

    return pages.map(({ doc, routePath }) => ({
      routePath,
      content: renderComponentPage(
        doc,
        options.customFields,
        routePath,
        routes
      ),
    }));
  },
});
