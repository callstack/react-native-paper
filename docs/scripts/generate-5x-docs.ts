import * as childProcess from 'node:child_process';
import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as vm from 'node:vm';

type LegacyPages = Record<string, string | Record<string, string>>;

type PluginOptions = {
  docsRootDir: string;
  libsRootDir: string;
  pages: LegacyPages;
};

type PluginFactory = (
  context: unknown,
  options: PluginOptions
) => Promise<{
  loadContent: () => Promise<unknown>;
}>;

type CustomFields = {
  extendedExamples: unknown;
  knownIssues: unknown;
  moreExamples: unknown;
  screenshots: unknown;
  themeColors: unknown;
};

const docsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const rootDir = path.resolve(docsDir, '..');
const versionDir = path.join(docsDir, '5.x');
const versionDocsDir = path.join(versionDir, 'docs');
const componentDocsPath = path.join(versionDir, 'component-docs.json');

const NUMERIC_PREFIX = /^\d+-/;

const isRecord = (value: unknown): value is { [key: string]: unknown } =>
  typeof value === 'object' && value !== null;

const isLegacyPages = (value: unknown): value is LegacyPages =>
  isRecord(value) &&
  Object.values(value).every(
    (page) =>
      typeof page === 'string' ||
      (isRecord(page) &&
        Object.values(page).every((source) => typeof source === 'string'))
  );

const isPluginOptions = (value: unknown): value is PluginOptions => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.docsRootDir === 'string' &&
    typeof value.libsRootDir === 'string' &&
    isLegacyPages(value.pages)
  );
};

const isPluginFactory = (value: unknown): value is PluginFactory =>
  typeof value === 'function';

const findObjectEnd = (source: string, start: number) => {
  let depth = 0;

  for (let index = start; index < source.length; index++) {
    const char = source[index];

    if (char === '{') {
      depth++;
    }

    if (char === '}') {
      depth--;
    }

    if (depth === 0) {
      return index + 1;
    }
  }

  return -1;
};

const loadLegacyPluginConfig = (
  docusaurusConfigPath: string
): PluginOptions => {
  const source = fs.readFileSync(docusaurusConfigPath, 'utf8');
  const pluginPathIndex = source.indexOf("'./component-docs-plugin'");
  const optionsStart = source.indexOf('{', pluginPathIndex);
  const optionsEnd = findObjectEnd(source, optionsStart);

  if (pluginPathIndex === -1 || optionsStart === -1 || optionsEnd === -1) {
    throw new Error(
      `Unable to read component docs plugin options from ${docusaurusConfigPath}`
    );
  }

  const optionsSource = source.slice(optionsStart, optionsEnd);
  const pluginOptions: unknown = vm.runInNewContext(`(${optionsSource})`, {
    __dirname: path.dirname(docusaurusConfigPath),
    path,
  });

  if (!isPluginOptions(pluginOptions)) {
    throw new Error(
      `Unable to read component docs plugin options from ${docusaurusConfigPath}`
    );
  }

  return pluginOptions;
};

const loadLegacyCustomFields = (
  docusaurusConfigPath: string,
  requireFromScript: ReturnType<typeof createRequire>
): CustomFields => {
  const source = fs.readFileSync(docusaurusConfigPath, 'utf8');
  const customFieldsIndex = source.indexOf('customFields:');
  const customFieldsStart = source.indexOf('{', customFieldsIndex);
  const customFieldsEnd = findObjectEnd(source, customFieldsStart);

  if (
    customFieldsIndex === -1 ||
    customFieldsStart === -1 ||
    customFieldsEnd === -1
  ) {
    throw new Error(
      `Unable to read custom fields from ${docusaurusConfigPath}`
    );
  }

  const dataDir = path.join(path.dirname(docusaurusConfigPath), 'src', 'data');
  const extendedExamplesModule: unknown = requireFromScript(
    path.join(dataDir, 'extendedExamples.js')
  );
  const screenshotsModule: unknown = requireFromScript(
    path.join(dataDir, 'screenshots.js')
  );
  const themeColorsModule: unknown = requireFromScript(
    path.join(dataDir, 'themeColors.js')
  );

  if (
    !isRecord(extendedExamplesModule) ||
    !isRecord(screenshotsModule) ||
    !isRecord(themeColorsModule)
  ) {
    throw new Error(`Unable to read custom field data from ${dataDir}`);
  }

  const customFields: unknown = vm.runInNewContext(
    `(${source.slice(customFieldsStart, customFieldsEnd)})`,
    {
      extendedExamples: extendedExamplesModule.extendedExamples,
      screenshots: screenshotsModule.screenshots,
      themeColors: themeColorsModule.themeColors,
    }
  );

  if (!isRecord(customFields)) {
    throw new Error(
      `Unable to read custom fields from ${docusaurusConfigPath}`
    );
  }

  return {
    extendedExamples: customFields.extendedExamples,
    knownIssues: customFields.knownIssues,
    moreExamples: customFields.moreExamples,
    screenshots: customFields.screenshots,
    themeColors: customFields.themeColors,
  };
};

const writeDocusaurusConfigStub = (
  sourceDir: string,
  customFields: CustomFields
) => {
  fs.writeFileSync(
    path.join(sourceDir, 'docs', 'docusaurus.config.js'),
    `module.exports = {
  baseUrl: '/react-native-paper/',
  customFields: ${JSON.stringify(customFields)},
};
`
  );
};

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

const writeJson = (destination: string, value: unknown) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(value, null, 2)}\n`);
};

const readStringArrayJson = (filePath: string) => {
  const value: unknown = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === 'string')
  ) {
    throw new Error(`${filePath} must contain a string array`);
  }

  return value;
};

const writeVersionNavigation = () => {
  const guidesDir = path.join(versionDocsDir, 'guides');
  const guidesMetaPath = path.join(guidesDir, '_meta.json');
  const existingOrder = fs.existsSync(guidesMetaPath)
    ? readStringArrayJson(guidesMetaPath)
    : [];
  const currentEntries = fs
    .readdirSync(guidesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(md|mdx)$/.test(entry.name))
    .map((entry) =>
      entry.name.replace(/\.(md|mdx)$/, '').replace(NUMERIC_PREFIX, '')
    );
  const knownEntries = existingOrder.filter((entry) =>
    currentEntries.includes(entry)
  );
  const newEntries = currentEntries.filter(
    (entry) => !existingOrder.includes(entry)
  );

  writeJson(path.join(versionDir, '_nav.json'), [
    {
      text: 'Guides',
      link: '/docs/guides/getting-started',
      activeMatch: '^/docs/guides/',
    },
    {
      text: 'Components',
      link: '/docs/components/ActivityIndicator',
      activeMatch: '^/docs/components/',
    },
    {
      text: 'Showcase',
      link: '/docs/showcase',
      activeMatch: '^/docs/showcase$',
    },
  ]);
  writeJson(path.join(versionDocsDir, '_meta.json'), [
    {
      type: 'dir-section-header',
      name: 'guides',
      label: 'Guides',
    },
    {
      type: 'dir-section-header',
      name: 'components',
      label: 'Components',
    },
    {
      type: 'file',
      name: 'showcase',
      label: 'Showcase',
    },
  ]);
  writeJson(guidesMetaPath, [...knownEntries, ...newEntries]);
};

const writeComponentNavigation = (destination: string, pages: LegacyPages) => {
  writeJson(
    path.join(destination, '_meta.json'),
    Object.entries(pages).map(([name, page]) =>
      typeof page === 'string'
        ? name
        : {
            type: 'dir',
            name,
            label: name,
            collapsible: true,
            collapsed: false,
          }
    )
  );

  for (const [name, page] of Object.entries(pages)) {
    if (typeof page !== 'string') {
      writeJson(path.join(destination, name, '_meta.json'), Object.keys(page));
    }
  }
};

const resolveRelativeLinks = (
  content: string,
  relativePath: string,
  routes: ReadonlySet<string>
) => {
  const routePath = `/docs/components/${relativePath
    .replace(/\.mdx$/, '')
    .split(path.sep)
    .join('/')}`;

  return content.replace(
    /\]\((?!https?:\/\/|mailto:|#|\/)([^)\s]+)([^)]*)\)/g,
    (_link, href: string, suffix: string) => {
      const [pathname, hash = ''] = href.split('#');
      const componentRelativePath = pathname.replace(/^(?:\.\.?\/)+/, '');
      const resolvedPaths = [
        path.posix.resolve(path.posix.dirname(routePath), pathname),
        path.posix.resolve('/docs/components', componentRelativePath),
      ];
      const target = resolvedPaths
        .flatMap((resolvedPath) => [
          resolvedPath,
          `${resolvedPath}/${path.posix.basename(resolvedPath)}`,
        ])
        .find((resolvedPath) => routes.has(resolvedPath));

      if (!target) {
        throw new Error(
          `Unable to generate docs for ${routePath}: relative link ${href} does not match a component page`
        );
      }

      return `](${target}${hash ? `#${hash}` : ''}${suffix})`;
    }
  );
};

const writeComponentPages = (
  source: string,
  destination: string,
  pages: LegacyPages
) => {
  fs.rmSync(destination, { recursive: true, force: true });
  const routes = new Set(
    Object.entries(pages).flatMap(([name, page]) =>
      typeof page === 'string'
        ? [`/docs/components/${name}`]
        : Object.keys(page).map(
            (pageName) => `/docs/components/${name}/${pageName}`
          )
    )
  );

  for (const entry of fs.readdirSync(source, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!entry.isFile() || path.extname(entry.name) !== '.mdx') {
      continue;
    }

    const sourcePath = path.join(entry.parentPath, entry.name);
    const relativePath = path.relative(source, sourcePath);
    const destinationPath = path.join(destination, relativePath);
    const componentDocsImport = path
      .relative(path.dirname(destinationPath), componentDocsPath)
      .split(path.sep)
      .join('/');
    const content = resolveRelativeLinks(
      fs
        .readFileSync(sourcePath, 'utf8')
        .replaceAll('@site/src/components/', '@docs/components/')
        .replace(
          "import PropTable from '@docs/components/PropTable.tsx';",
          `import PropTable from '@docs/components/PropTable.tsx';\nimport componentDocs5x from '${componentDocsImport}';`
        )
        .replaceAll(
          '<PropTable componentLink=',
          '<PropTable componentDocs={componentDocs5x.docs} componentLink='
        )
        .replaceAll('/react-native-paper/screenshots/', 'screenshots/')
        .replace(/\s+baseUrl="[^"]*"/g, ''),
      relativePath,
      routes
    );

    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.writeFileSync(destinationPath, content);
  }

  writeComponentNavigation(destination, pages);
};

const main = async () => {
  const [branchName] = process.argv.slice(2);

  if (!branchName) {
    console.error('Usage: node docs/scripts/generate-5x-docs.ts <branch>');
    process.exitCode = 1;
    return;
  }

  const requireFromScript = createRequire(import.meta.url);
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'react-native-paper-docs-')
  );

  try {
    const archivePath = path.join(tempDir, 'source.tar');
    const sourceDir = path.join(tempDir, 'source');

    childProcess.execFileSync(
      'git',
      ['rev-parse', '--verify', `${branchName}^{commit}`],
      {
        cwd: rootDir,
        stdio: 'ignore',
      }
    );
    childProcess.execFileSync(
      'git',
      ['archive', '--format=tar', '--output', archivePath, branchName],
      {
        cwd: rootDir,
        stdio: 'inherit',
      }
    );

    fs.mkdirSync(sourceDir);
    childProcess.execFileSync('tar', ['-xf', archivePath, '-C', sourceDir], {
      cwd: rootDir,
      stdio: 'inherit',
    });

    const nodeModulesPath = path.join(rootDir, 'docs', 'node_modules');
    const archivedNodeModulesPath = path.join(
      sourceDir,
      'docs',
      'node_modules'
    );

    if (fs.existsSync(nodeModulesPath)) {
      fs.symlinkSync(nodeModulesPath, archivedNodeModulesPath, 'dir');
    }

    const docusaurusConfigPath = path.join(
      sourceDir,
      'docs',
      'docusaurus.config.js'
    );
    const customFields = loadLegacyCustomFields(
      docusaurusConfigPath,
      requireFromScript
    );
    const pluginOptions = loadLegacyPluginConfig(docusaurusConfigPath);

    writeDocusaurusConfigStub(sourceDir, customFields);

    const pluginFactoryPath = path.join(
      sourceDir,
      'docs',
      'component-docs-plugin'
    );
    const pluginFactory: unknown = requireFromScript(pluginFactoryPath);

    if (!isPluginFactory(pluginFactory)) {
      throw new Error(
        `Unable to read component docs plugin from ${pluginFactoryPath}`
      );
    }

    const plugin = await pluginFactory({}, pluginOptions);
    const docs = await plugin.loadContent();
    writeJson(componentDocsPath, {
      docs: normalizeDocs(docs, fs.realpathSync(sourceDir)),
    });

    writeComponentPages(
      pluginOptions.docsRootDir,
      path.join(versionDocsDir, 'components'),
      pluginOptions.pages
    );
    writeVersionNavigation();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
};

void main();
