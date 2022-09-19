const fs = require('fs');
const path = require('path');

const {
  default: parseComponentDocs,
} = require('component-docs/dist/parsers/component');

const clean = require('./clean');
const createCategory = require('./createCategory');
const generatePageMDX = require('./generatePageMDX');
const getPages = require('./getPages');
const { docsRootDir } = require('./paths');

async function componentsPlugin() {
  return {
    name: 'component-docs-plugin',
    async loadContent() {
      // Clean up docs directory.
      clean();
      // Create root components category.
      createCategory('Components', '.');

      const pages = getPages().map((page) => {
        const filepath = page.file;
        const root = page.file.split('/').slice(0, -1).join('/');
        const doc = parseComponentDocs(filepath, { root });
        return {
          ...page,
          doc,
        };
      });

      for (const page of pages) {
        // Create subcategory if necessary.
        if (page.group) {
          createCategory(page.group, page.group ?? '.');
        }
        fs.writeFile(
          path.join(docsRootDir, page.group ?? '.', `${page.doc.link}.mdx`),
          generatePageMDX(page.doc),
          () => {}
        );
      }

      return pages;
    },
    async contentLoaded({ content, actions }) {
      // Store component docs global data so it can be used in `PropsTable` component.
      actions.setGlobalData({
        pages: content,
      });
    },
  };
}

module.exports = componentsPlugin;
