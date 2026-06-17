import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const docsRoot = path.resolve(import.meta.dirname, '..');

const read = (relativePath) =>
  fs.readFileSync(path.join(docsRoot, relativePath), 'utf8');
const routeFallbacks = JSON.parse(read('src/data/versionRouteFallbacks.json'));

test('guide routes keep stripped public paths', () => {
  assert.ok(
    fs.existsSync(path.join(docsRoot, '5.x/docs/guides/getting-started.md'))
  );
  assert.ok(fs.existsSync(path.join(docsRoot, '6.x/docs/guides/rtl.md')));
  assert.equal(
    fs.existsSync(
      path.join(docsRoot, '5.x/docs/guides/01-getting-started.md')
    ),
    false
  );
});

test('generated pages stay free of layout-only version selector markup', () => {
  assert.doesNotMatch(
    read('5.x/docs/guides/getting-started.md'),
    /PaperVersionSelector/
  );
  assert.doesNotMatch(
    read('6.x/docs/components/ActivityIndicator.mdx'),
    /PaperVersionSelector/
  );
});

test('theme layout does not append a second right-side version selector', () => {
  const themeLayoutSource = read('theme/index.tsx');

  assert.match(themeLayoutSource, /PaperVersionSelector/);
  assert.match(themeLayoutSource, /VersionedPrereleaseNotice/);
  assert.doesNotMatch(themeLayoutSource, /afterNavMenu/);
});

test('component prop metadata exists for both 5.x and 6.x', () => {
  const componentDocs5x = JSON.parse(read('src/data/componentDocs5x.json'));
  const componentDocs6x = JSON.parse(read('src/data/componentDocs6x.json'));

  assert.ok(componentDocs5x.docs.ActivityIndicator);
  assert.ok(componentDocs6x.docs.ActivityIndicator);
});

test('component prop metadata does not contain local absolute paths', () => {
  const componentDocs5x = JSON.parse(read('src/data/componentDocs5x.json'));
  const componentDocs6x = JSON.parse(read('src/data/componentDocs6x.json'));

  for (const [version, data] of [
    ['5.x', componentDocs5x],
    ['6.x', componentDocs6x],
  ]) {
    for (const doc of Object.values(data.docs)) {
      for (const dependency of doc.dependencies ?? []) {
        assert.equal(
          path.isAbsolute(dependency),
          false,
          `${version} dependency should be relative: ${dependency}`
        );
      }
    }
  }
});

test('version route fallbacks cover version-specific pages', () => {
  const stableRoutes = readRoutes('5.x');
  const nextRoutes = readRoutes('6.x');

  for (const route of nextRoutes) {
    const stableRoute = route.replace(/^\/6\.x/, '') || '/';

    if (stableRoutes.has(stableRoute)) {
      continue;
    }

    assert.ok(
      Object.hasOwn(routeFallbacks.stable, route),
      `Missing 5.x fallback for ${route}`
    );
    assert.ok(
      stableRoutes.has(routeFallbacks.stable[route]),
      `5.x fallback for ${route} does not exist: ${routeFallbacks.stable[route]}`
    );
  }

  for (const route of stableRoutes) {
    const nextRoute = route === '/' ? '/6.x/' : `/6.x${route}`;

    if (nextRoutes.has(nextRoute)) {
      continue;
    }

    assert.ok(
      Object.hasOwn(routeFallbacks.next, route),
      `Missing 6.x fallback for ${route}`
    );
    assert.ok(
      nextRoutes.has(routeFallbacks.next[route]),
      `6.x fallback for ${route} does not exist: ${routeFallbacks.next[route]}`
    );
  }
});

test('version selector exposes current and legacy versions', () => {
  const selectorSource = read('src/components/PaperVersionSelector.tsx');

  for (const label of ['6.x', '5.x', '4.x', '3.x', '2.x', '1.x']) {
    assert.match(selectorSource, new RegExp(label.replace('.', '\\.')));
  }

  assert.match(selectorSource, /window\.location\.assign\(link\.href\)/);
  assert.match(selectorSource, /anchor\.target = '_blank'/);
  assert.match(
    selectorSource,
    /window\.open\(link\.href, '_blank', 'noopener,noreferrer'\)/
  );
  assert.match(selectorSource, /getStableRoute/);
  assert.match(selectorSource, /getNextRoute/);
});

test('6.x getting started stays free of page-local prerelease notice markup', () => {
  const gettingStarted6x = read('6.x/docs/guides/getting-started.mdx');

  assert.doesNotMatch(gettingStarted6x, /PrereleaseNotice/);
});

test('homepage theme layout includes the Callstack banner and live Paper showcase', () => {
  const themeLayoutSource = read('theme/index.tsx');
  const bannerExampleSource = read('src/components/BannerExample.tsx');

  assert.match(themeLayoutSource, /HomeBanner/);
  for (const marker of [
    "from 'react-native'",
    "from 'react-native-paper'",
    'Button loading',
    'ProgressBar indeterminate',
    'BrowserOnly fallback',
  ]) {
    assert.match(bannerExampleSource, new RegExp(marker));
  }
});

test('generated nav files use Paper-style docs routes', () => {
  const stableNav = JSON.parse(read('5.x/_nav.json'));
  const prereleaseNav = JSON.parse(read('6.x/_nav.json'));

  assert.equal(stableNav[0].link, '/docs/guides/getting-started');
  assert.equal(stableNav[1].link, '/docs/components/ActivityIndicator');
  assert.equal(prereleaseNav[0].link, '/docs/guides/getting-started');
  assert.equal(prereleaseNav[1].link, '/docs/components/ActivityIndicator');
});

function readRoutes(version) {
  const versionDir = path.join(docsRoot, version);
  const routes = new Set();

  for (const filePath of walk(versionDir)) {
    if (!/\.(md|mdx)$/.test(filePath)) {
      continue;
    }

    const relativePath = path
      .relative(versionDir, filePath)
      .replace(/\.(md|mdx)$/, '')
      .split(path.sep)
      .join('/');
    const routePath =
      relativePath === 'index'
        ? '/'
        : `/${relativePath.replace(/\/index$/, '')}`;

    routes.add(version === '6.x' ? `/6.x${routePath}` : routePath);
  }

  return routes;
}

function walk(dirPath) {
  const files = [];

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(entryPath));
      continue;
    }

    files.push(entryPath);
  }

  return files;
}
