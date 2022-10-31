const {
  default: parseComponentDocs,
} = require('component-docs/dist/parsers/component');
const fs = require('fs');
const path = require('path');

const generatePageMDX = require('./generatePageMDX');

const pluginName = 'component-docs-plugin';

async function componentsPlugin(_, options) {
  const { docsRootDir, libsRootDir, pages } = options;

  function clean() {
    fs.rmSync(docsRootDir, { recursive: true, force: true });
  }

  function createCategory(label, dir = '.') {
    const categoryJSON = JSON.stringify({ label }, undefined, 2);
    const docsCategoryDir = path.join(docsRootDir, dir);
    if (!fs.existsSync(docsCategoryDir)) {
      fs.mkdirSync(docsCategoryDir);
    }
    fs.writeFileSync(
      path.join(docsCategoryDir, `_category_.json`),
      categoryJSON
    );
  }

  function createPageForComponent(targetArray, source) {
    const [item, subitem] = targetArray;
    const target = subitem ? `${item}/${subitem}` : item;
    const targetPath = target + '.mdx';
    const sourcePath = source + '.tsx';

    // Parse component using component-docs.
    const doc = parseComponentDocs(path.join(libsRootDir, sourcePath), {
      root: libsRootDir,
    });

    // Create directory for the output mdx file.
    fs.mkdirSync(
      path.join(docsRootDir, targetPath).split('/').slice(0, -1).join('/'),
      { recursive: true }
    );

    // Generate and write mdx file.
    fs.writeFileSync(
      path.join(docsRootDir, targetPath),
      generatePageMDX(doc, source)
    );

    return doc;
  }

  return {
    name: pluginName,
    async loadContent() {
      // Clean up docs directory.
      clean();
      // Create root components category.
      createCategory('Components', '.');

      const docs = {};

      for (const item in pages) {
        if (typeof pages[item] === 'string') {
          const doc = createPageForComponent([item], pages[item]);
          docs[pages[item]] = doc;
        } else {
          for (const subitem in pages[item]) {
            const doc = createPageForComponent(
              [item, subitem],
              pages[item][subitem]
            );
            docs[pages[item][subitem]] = doc;
          }
        }
      }

      return docs;
    },
    async contentLoaded({ content: docs, actions }) {
      // Store component docs global data so it can be used in `PropsTable` component.
      actions.setGlobalData({
        docs,
      });
    },
  };
}

module.exports = componentsPlugin;
