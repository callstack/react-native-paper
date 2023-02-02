const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');

module.exports = () => {
  return async (tree) => {
    const { visit } = await import('unist-util-visit');

    const previewsDir = 'src/__previews__';

    const previewsDirPath = path.join(__dirname, '..', previewsDir);

    if (!fs.existsSync(previewsDirPath)) await fsPromise.mkdir(previewsDirPath);

    tree.children.unshift({
      type: 'import',
      value: `import Preview from '@site/src/components/preview';`,
    });

    visit(tree, 'code', (node, i, parent) => {
      if (node.meta?.includes('preview')) {
        const nextNode = parent.children[i + 1];

        const componentName = `A${node.position.start.line}${node.position.start.offset}`;

        fs.writeFileSync(
          path.join(previewsDirPath, componentName + '.js'),
          node.value
        );

        parent.children.unshift({
          type: 'import',
          value: `import ${componentName} from '@site/${previewsDir}/${componentName}';`,
        });

        const a = [
          // {
          //   type: 'jsx',
          //   value: `<Preview><${componentName} /></Preview>`,
          // },
          { type: 'jsx', value: '<Tabs>' },
          {
            type: 'jsx',
            value: '<TabItem value="js" label="JavaScript">',
          },
          {
            type: 'code',
            lang: 'js',
            value: 'const a = 1;',
          },
          { type: 'jsx', value: '</TabItem>' },
          { type: 'jsx', value: '</Tabs>' },
        ];

        parent.children.splice(
          i + 1,
          nextNode?.lang === 'tsx' ? 2 : 1,
          {
            type: 'jsx',
            value: `<Preview><${componentName} /></Preview>`,
          },
          { type: 'jsx', value: '<Tabs>' },
          {
            type: 'jsx',
            value: '<TabItem value="js" label="JavaScript">',
          },
          {
            type: 'code',
            lang: 'js',
            value: node.value,
          },
          { type: 'jsx', value: '</TabItem>' },
          {
            type: 'jsx',
            value: '<TabItem value="ts" label="TypeScirpt">',
          },
          {
            type: 'code',
            lang: 'tsx',
            value: nextNode?.lang === 'tsx' ? nextNode.value : '',
          },
          { type: 'jsx', value: '</TabItem>' },
          { type: 'jsx', value: '</Tabs>' }
        );
      }
    });
    return tree;
  };
};
