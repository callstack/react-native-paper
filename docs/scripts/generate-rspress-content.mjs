import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const componentDocsConfig = require('../component-docs.config');

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const versionedDocsDir = path.join(rootDir, 'versioned_docs');
const sourcePagesDir = path.join(rootDir, 'src', 'pages');
const staticDir = path.join(rootDir, 'static');
const publicDir = path.join(rootDir, 'public');
const docsOrder = ['5.x', '6.x'];

const FRONTMATTER_TITLE = /^---[\s\S]*?title:\s*(.+?)\s*$/m;
const NUMERIC_PREFIX = /^\d+-/;

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');

const writeJson = (filePath, value) => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const stripExtension = (fileName) => fileName.replace(/\.(md|mdx)$/, '');

const stripNumericPrefix = (fileName) =>
  stripExtension(fileName).replace(NUMERIC_PREFIX, '');

const getTitle = (content, fallbackName) => {
  const match = content.match(FRONTMATTER_TITLE);
  if (match?.[1]) {
    return match[1].trim();
  }

  return fallbackName;
};

const transformSharedContent = (content, version) =>
  content
    .replace(/((?:\.\.\/)+)static\//g, '/react-native-paper/')
    .replace(
      /\]\(((?:\.\.\/|\.\/)?)(\d{2}-[a-z0-9-]+)\.(md|mdx)\)/gi,
      (_, prefix, fileName) => `](${prefix}${fileName.replace(NUMERIC_PREFIX, '')})`
    )
    .replace(/\]\(\.\/Portal\)/g, '](./Portal/Portal)')
    .replace(/\]\(\.\.\/Portal\)/g, '](../Portal/Portal)')
    .replace(
      /2\. <b>Advanced theme overrides<\/b> - when you <i>add new properties<\/i> or <i>\s+change the built-in schema shape\s+<\/i>/g,
      '2. <b>Advanced theme overrides</b> - when you <i>add new properties</i> or <i>change the built-in schema shape</i>'
    )
    .replace(
      /<i>\s+We are planning to provide a better support of handling custom theme overrides\s+in future releases\.\s+<\/i>/g,
      '<i>We are planning to provide a better support of handling custom theme overrides in future releases.</i>'
    )
    .replace(
      /<PropTable componentLink="([^"]+)" prop="([^"]+)" \/>/g,
      '<PropTable componentLink="$1" prop="$2" version="' + version + '" />'
    );

const transformIndexContent = (content) =>
  content
    .replace(
      '![paperLogo](../../static/images/sidebar-logo.svg)',
      '<img src="/react-native-paper/images/sidebar-logo.svg" alt="React Native Paper" />'
    )
    .replace(
      "import GetStartedButtons from '../components/GetStartedButtons';",
      "import GetStartedButtons from '../src/components/GetStartedButtons';"
    )
    .replace("import {Button} from 'react-native-paper';\n", '')
    .replace(
      "import BannerExample from '../components/BannerExample';",
      "import BannerExample from '../src/components/BannerExample';"
    )
    .replace(/src="\.\/*gallery\//g, 'src="/react-native-paper/gallery/');

const copyFile = (sourcePath, targetPath, transform) => {
  ensureDir(path.dirname(targetPath));
  const source = readFile(sourcePath);
  fs.writeFileSync(targetPath, transform(source));
};

const createNav = (version) => {
  const activePrefix =
    version === '6.x' ? '^/(?:6\\.x/)?docs' : '^/docs';

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

const getVersionComponentOrder = (version) => {
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

const getComponentChildOrder = (version, dirName) => {
  const configEntry = componentDocsConfig.pages[dirName];

  if (version !== '5.x' && configEntry && typeof configEntry !== 'string') {
    return Object.keys(configEntry);
  }

  const dirPath = path.join(
    versionedDocsDir,
    `version-${version}`,
    'components',
    dirName
  );

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(md|mdx)$/.test(entry.name))
    .map((entry) => stripExtension(entry.name));
};

const createGuidesMeta = (version) => {
  const guidesDir = path.join(versionedDocsDir, `version-${version}`, 'guides');

  return fs
    .readdirSync(guidesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(md|mdx)$/.test(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }))
    .map((entry) => stripNumericPrefix(entry.name));
};

const createComponentMeta = (version) => {
  return getVersionComponentOrder(version);
};

const copyGuides = (version, targetVersionDir) => {
  const guidesDir = path.join(versionedDocsDir, `version-${version}`, 'guides');
  const targetGuidesDir = path.join(targetVersionDir, 'docs', 'guides');

  for (const entry of fs.readdirSync(guidesDir, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.(md|mdx)$/.test(entry.name)) {
      continue;
    }

    const sourcePath = path.join(guidesDir, entry.name);
    const cleanName = `${stripNumericPrefix(entry.name)}${path.extname(entry.name)}`;
    copyFile(sourcePath, path.join(targetGuidesDir, cleanName), (content) =>
      transformSharedContent(content, version)
    );
  }
};

const copyComponentDocs = (version, targetVersionDir) => {
  const componentsDir = path.join(
    versionedDocsDir,
    `version-${version}`,
    'components'
  );
  const targetComponentsDir = path.join(targetVersionDir, 'docs', 'components');

  const walk = (sourceDir, outputDir) => {
    ensureDir(outputDir);

    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
      if (entry.name === '_category_.json') {
        continue;
      }

      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(outputDir, entry.name);

      if (entry.isDirectory()) {
        walk(sourcePath, targetPath);
        continue;
      }

      if (!/\.(md|mdx)$/.test(entry.name)) {
        continue;
      }

      copyFile(sourcePath, targetPath, (content) =>
        transformSharedContent(content, version)
      );
    }
  };

  walk(componentsDir, targetComponentsDir);
};

const writeMetaFiles = (version, targetVersionDir) => {
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
  writeJson(path.join(componentsDir, '_meta.json'), createComponentMeta(version));

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

const writeIndexPage = (targetVersionDir) => {
  copyFile(
    path.join(sourcePagesDir, 'index.mdx'),
    path.join(targetVersionDir, 'index.mdx'),
    transformIndexContent
  );
};

const writeShowcasePage = (version, targetVersionDir) => {
  copyFile(
    path.join(versionedDocsDir, `version-${version}`, 'showcase.mdx'),
    path.join(targetVersionDir, 'docs', 'showcase.mdx'),
    (content) => transformSharedContent(content, version)
  );
};

const copyStaticAssets = () => {
  fs.cpSync(staticDir, publicDir, { recursive: true, force: true });
  fs.cpSync(staticDir, path.join(publicDir, 'react-native-paper'), {
    recursive: true,
    force: true,
  });
};

const prepareVersionDir = (version) => {
  const targetVersionDir = path.join(rootDir, version);
  fs.rmSync(targetVersionDir, { recursive: true, force: true });
  ensureDir(targetVersionDir);

  writeJson(path.join(targetVersionDir, '_nav.json'), createNav(version));
  writeIndexPage(targetVersionDir);
  writeShowcasePage(version, targetVersionDir);
  copyGuides(version, targetVersionDir);
  copyComponentDocs(version, targetVersionDir);
  writeMetaFiles(version, targetVersionDir);
};

const main = () => {
  copyStaticAssets();
  fs.rmSync(path.join(rootDir, 'docs'), { recursive: true, force: true });
  fs.rmSync(path.join(rootDir, 'index.mdx'), { force: true });

  for (const version of docsOrder) {
    prepareVersionDir(version);
  }
};

main();
