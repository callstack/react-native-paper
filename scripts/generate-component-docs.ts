import * as childProcess from 'node:child_process';
import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

type PluginOptions = {
  docsRootDir: string;
  libsRootDir: string;
  pages: unknown;
};

type PluginConfig = [string, PluginOptions];

type PluginFactory = (
  context: unknown,
  options: PluginOptions
) => Promise<{
  loadContent: () => Promise<unknown>;
}>;

const isRecord = (value: unknown): value is { [key: string]: unknown } =>
  typeof value === 'object' && value !== null;

const isPluginFactory = (value: unknown): value is PluginFactory =>
  typeof value === 'function';

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

const main = async () => {
  const [branchName, outputPath = 'docs/src/data/componentDocs5x.json'] =
    process.argv.slice(2);

  if (!branchName) {
    console.error(
      'Usage: node scripts/generate-component-docs.ts <branch> [output]'
    );
    process.exitCode = 1;
    return;
  }

  const requireFromScript = createRequire(import.meta.url);
  const rootDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..'
  );
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

    const configPath = path.join(sourceDir, 'docs', 'docusaurus.config.js');
    const config: unknown = requireFromScript(configPath);

    if (!isRecord(config) || !Array.isArray(config.plugins)) {
      throw new Error(`Unable to read plugins from ${configPath}`);
    }

    const pluginConfig = config.plugins.find(
      (plugin: unknown): plugin is PluginConfig =>
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

    const plugin = await pluginFactory({}, pluginConfig[1]);
    const docs = await plugin.loadContent();
    const destination = path.resolve(rootDir, outputPath);

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(
      destination,
      `${JSON.stringify(
        { docs: normalizeDocs(docs, fs.realpathSync(sourceDir)) },
        null,
        2
      )}\n`
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
};

void main();
