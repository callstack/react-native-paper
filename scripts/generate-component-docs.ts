const childProcess = require('child_process') as typeof import('child_process');
const fs = require('fs') as typeof import('fs');
const Module = require('module') as typeof import('module') & {
  _load: (request: string, parent: unknown, isMain: boolean) => unknown;
};
const os = require('os') as typeof import('os');
const path = require('path') as typeof import('path');

type UnknownRecord = Record<string, unknown>;
type ComponentDocsConfig = {
  docsRootDir: string;
  libsRootDir: string;
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;
const legacyDocusaurusShims = new Set([
  '@docusaurus/remark-plugin-npm2yarn',
  'prism-react-renderer/themes/dracula',
  'prism-react-renderer/themes/github',
]);

const loadLegacyDocusaurusConfig = (configPath: string): unknown => {
  const originalLoad = Module._load;

  Module._load = function loadWithLegacyDocsShims(
    request: string,
    parent: unknown,
    isMain: boolean
  ) {
    if (legacyDocusaurusShims.has(request)) {
      return {};
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    return require(configPath);
  } finally {
    Module._load = originalLoad;
  }
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

const main = async () => {
  const [branchName, outputPath = 'docs/src/data/componentDocs5x.json'] =
    process.argv.slice(2);

  if (!branchName) {
    console.error(
      'Usage: node --experimental-strip-types scripts/generate-component-docs.ts <branch> [output]'
    );
    process.exitCode = 1;
    return;
  }

  const rootDir = path.resolve(__dirname, '..');
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

    const sharedConfigPath = path.join(
      sourceDir,
      'docs',
      'component-docs.config.js'
    );

    let pluginConfig: [string, ComponentDocsConfig] | undefined;

    if (fs.existsSync(sharedConfigPath)) {
      const sharedConfig = require(sharedConfigPath) as UnknownRecord;

      if (
        isRecord(sharedConfig) &&
        typeof sharedConfig.docsRootDir === 'string' &&
        typeof sharedConfig.libsRootDir === 'string'
      ) {
        pluginConfig = [
          './component-docs-plugin',
          {
            docsRootDir: sharedConfig.docsRootDir,
            libsRootDir: sharedConfig.libsRootDir,
          },
        ];
      }
    }

    if (!pluginConfig) {
      const configPath = path.join(sourceDir, 'docs', 'docusaurus.config.js');
      const config = loadLegacyDocusaurusConfig(configPath);

      if (!isRecord(config) || !Array.isArray(config.plugins)) {
        throw new Error(`Unable to read plugins from ${configPath}`);
      }

      pluginConfig = config.plugins.find(
        (plugin) =>
          Array.isArray(plugin) &&
          plugin[0] === './component-docs-plugin' &&
          isRecord(plugin[1]) &&
          typeof plugin[1].docsRootDir === 'string' &&
          typeof plugin[1].libsRootDir === 'string'
      );

      if (!pluginConfig) {
        throw new Error(
          `Unable to find component docs plugin config in ${configPath}`
        );
      }
    }

    const pluginFactory = require(path.join(
      sourceDir,
      'docs',
      'component-docs-plugin'
    )) as (
      context: unknown,
      options: ComponentDocsConfig
    ) => Promise<{ loadContent: () => Promise<unknown> }>;
    const plugin = await pluginFactory({}, pluginConfig[1]);
    const docs = await plugin.loadContent();
    const destination = path.resolve(rootDir, outputPath);

    writeJson(destination, {
      docs: normalizeDocs(docs, fs.realpathSync(sourceDir)),
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    fs.rmdirSync(tempDir, { recursive: true });
  }
};

void main();
