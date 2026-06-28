import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import componentDocsConfig from '../component-docs.config.ts';

type MetaEntry =
  | string
  | {
      type: string;
      name: string;
      label: string;
      collapsible?: boolean;
      collapsed?: boolean;
    };

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const sourcePagesDir = path.join(rootDir, 'src', 'pages');
const publicDir = path.join(rootDir, 'public');
const basePublicDir = path.join(publicDir, 'react-native-paper');
const docsOrder = ['5.x', '6.x'];

const NUMERIC_PREFIX = /^\d+-/;

const ensureDir = (dirPath: string) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const readFile = (filePath: string) => fs.readFileSync(filePath, 'utf8');

const writeJson = (filePath: string, value: unknown) => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const readStringArrayJson = (filePath: string) => {
  const value: unknown = JSON.parse(readFile(filePath));

  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === 'string')
  ) {
    throw new Error(`${filePath} must contain a string array`);
  }

  return value;
};

const stripExtension = (fileName: string) =>
  fileName.replace(/\.(md|mdx)$/, '');

const stripNumericPrefix = (fileName: string) =>
  stripExtension(fileName).replace(NUMERIC_PREFIX, '');

const transformIndexContent = (content: string) =>
  content
    .replace(
      '![paperLogo](../../static/images/sidebar-logo.svg)',
      '<img src="/react-native-paper/images/sidebar-logo.svg" alt="React Native Paper" />'
    )
    .replace(
      "import GetStartedButtons from '../components/GetStartedButtons';",
      "import GetStartedButtons from '@docs/components/GetStartedButtons';"
    )
    .replace("import {Button} from 'react-native-paper';\n", '')
    .replace(
      "import BannerExample from '../components/BannerExample';",
      "import BannerExample from '@docs/components/BannerExample';"
    )
    .replace(/src="\.\/*gallery\//g, 'src="/react-native-paper/gallery/');

const copyFile = (
  sourcePath: string,
  targetPath: string,
  transform: (content: string) => string
) => {
  ensureDir(path.dirname(targetPath));
  const source = readFile(sourcePath);
  fs.writeFileSync(targetPath, transform(source));
};

const getVersionDocsDir = (version: string) =>
  path.join(rootDir, version, 'docs');

const createNav = (version: string) => {
  const activePrefix = version === '6.x' ? '^/(?:6\\.x/)?docs' : '^/docs';

  return [
    {
      text: 'Guides',
      link: '/docs/guides/getting-started',
      activeMatch: `${activePrefix}/guides/`,
    },
    {
      text: 'Components',
      link: '/docs/components/ActivityIndicator',
      activeMatch: `${activePrefix}/components/`,
    },
    {
      text: 'Showcase',
      link: '/docs/showcase',
      activeMatch: `${activePrefix}/showcase$`,
    },
  ];
};

const getVersionComponentOrder = (version: string): MetaEntry[] => {
  const fromConfig = Object.entries(componentDocsConfig.pages).map(
    ([entryName, value]) => {
      if (typeof value === 'string') {
        return entryName;
      }

      return {
        type: 'dir',
        name: entryName,
        label: entryName,
        collapsible: true,
        collapsed: false,
      };
    }
  );

  if (version !== '5.x') {
    return fromConfig;
  }

  return [
    ...fromConfig,
    {
      type: 'dir',
      name: 'HelperText',
      label: 'HelperText',
      collapsible: true,
      collapsed: false,
    },
  ];
};

const getComponentChildOrder = (version: string, dirName: string) => {
  const configEntry = componentDocsConfig.pages[dirName];

  if (version !== '5.x' && configEntry && typeof configEntry !== 'string') {
    return Object.keys(configEntry);
  }

  const dirPath = path.join(getVersionDocsDir(version), 'components', dirName);

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(md|mdx)$/.test(entry.name))
    .map((entry) => stripExtension(entry.name));
};

const createGuidesMeta = (version: string) => {
  const guidesDir = path.join(getVersionDocsDir(version), 'guides');
  const metaPath = path.join(guidesDir, '_meta.json');
  const existingOrder = fs.existsSync(metaPath)
    ? readStringArrayJson(metaPath)
    : [];

  const currentEntries = fs
    .readdirSync(guidesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(md|mdx)$/.test(entry.name))
    .map((entry) => stripNumericPrefix(entry.name));

  const knownEntries = existingOrder.filter((entry) =>
    currentEntries.includes(entry)
  );
  const newEntries = currentEntries.filter(
    (entry) => !existingOrder.includes(entry)
  );

  return [...knownEntries, ...newEntries];
};

const createComponentMeta = (version: string) => {
  return getVersionComponentOrder(version);
};

const writeMetaFiles = (version: string, targetVersionDir: string) => {
  const docsDir = path.join(targetVersionDir, 'docs');
  const componentsDir = path.join(docsDir, 'components');

  writeJson(path.join(docsDir, '_meta.json'), [
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

  writeJson(
    path.join(docsDir, 'guides', '_meta.json'),
    createGuidesMeta(version)
  );
  writeJson(
    path.join(componentsDir, '_meta.json'),
    createComponentMeta(version)
  );

  for (const entry of fs.readdirSync(componentsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    writeJson(
      path.join(componentsDir, entry.name, '_meta.json'),
      getComponentChildOrder(version, entry.name)
    );
  }
};

const writeIndexPage = (targetVersionDir: string) => {
  copyFile(
    path.join(sourcePagesDir, 'index.mdx'),
    path.join(targetVersionDir, 'index.mdx'),
    transformIndexContent
  );
};

const copyBasePublicAssets = () => {
  fs.rmSync(basePublicDir, { recursive: true, force: true });
  ensureDir(basePublicDir);

  for (const entry of fs.readdirSync(publicDir, { withFileTypes: true })) {
    if (entry.name === 'react-native-paper') {
      continue;
    }

    fs.cpSync(
      path.join(publicDir, entry.name),
      path.join(basePublicDir, entry.name),
      {
        recursive: true,
        force: true,
      }
    );
  }
};

const prepareVersionDir = (version: string) => {
  const targetVersionDir = path.join(rootDir, version);
  ensureDir(targetVersionDir);

  writeJson(path.join(targetVersionDir, '_nav.json'), createNav(version));
  writeIndexPage(targetVersionDir);
  writeMetaFiles(version, targetVersionDir);
};

const main = () => {
  copyBasePublicAssets();
  fs.rmSync(path.join(rootDir, 'docs'), { recursive: true, force: true });
  fs.rmSync(path.join(rootDir, 'index.mdx'), { force: true });

  for (const version of docsOrder) {
    prepareVersionDir(version);
  }
};

main();
