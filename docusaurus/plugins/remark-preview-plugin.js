const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');

const previewsDir = 'src/__previews__';
const previewsDirPath = path.join(__dirname, '..', previewsDir);

const processNode = async (node, i, parent) => {
  const nextNode = parent.children[i + 1];
  const hastTsNode = nextNode?.lang === 'tsx';

  const componentName = `A${node.position.start.line}${node.position.start.offset}`;

  fs.writeFileSync(
    path.join(previewsDirPath, `${componentName}.js`),
    node.value
  );

  const nodesToInsert = [
    {
      type: 'import',
      value: `import ${componentName} from '@site/${previewsDir}/${componentName}';`,
    },
    {
      type: 'jsx',
      value: `<Preview><${componentName} /></Preview>`,
    },
  ];

  node.meta = node.meta.replace('preview', '');

  if (hastTsNode) {
    nodesToInsert.push(
      { type: 'jsx', value: '<Tabs groupId="previewLang">' },
      {
        type: 'jsx',
        value: '<TabItem value="js" label="JavaScript">',
      },
      node,
      { type: 'jsx', value: '</TabItem>' },
      {
        type: 'jsx',
        value: '<TabItem value="ts" label="TypeScirpt">',
      },
      nextNode,
      { type: 'jsx', value: '</TabItem>' },
      { type: 'jsx', value: '</Tabs>' }
    );
  } else {
    nodesToInsert.push(node);
  }

  parent.children.splice(i, nextNode?.lang === 'tsx' ? 2 : 1, ...nodesToInsert);
};

module.exports = () => {
  return async (tree) => {
    const { visit } = await import('unist-util-visit');

    if (!fs.existsSync(previewsDirPath)) {
      await fsPromise.mkdir(previewsDirPath);
    }

    const nodesToProcess = [];

    visit(tree, 'code', (node, i, parent) => {
      if (node.meta?.includes('preview')) {
        nodesToProcess.push(processNode(node, i, parent));
      }
    });

    if (nodesToProcess.length > 0) {
      tree.children.unshift({
        type: 'import',
        value: `import Preview from '@site/src/components/preview';`,
      });

      await Promise.all(nodesToProcess);
    }

    return tree;
  };
};
