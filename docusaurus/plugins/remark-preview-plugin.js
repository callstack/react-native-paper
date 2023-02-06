const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');

const previewsDir = 'src/__previews__';
const previewsDirPath = path.join(__dirname, '..', previewsDir);

const processNode = async (node, i, parent) => {
  const nextNode = parent.children[i + 1];
  const hasTsNode = nextNode?.lang === 'tsx';

  const nodesToInsert = [
    {
      type: 'jsx',
      value: `<Preview jsCode={\`${node.value.replaceAll('`', '\\`')}\`} />`,
    },
  ];

  node.meta = node.meta.replace('preview', '');

  parent.children.splice(i, hasTsNode ? 2 : 1, ...nodesToInsert);
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
