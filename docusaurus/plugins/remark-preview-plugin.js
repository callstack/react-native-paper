module.exports = () => {
  return async (tree) => {
    const { visit } = await import('unist-util-visit');

    let needsImport = false;

    visit(tree, 'code', (node, i, parent) => {
      if (!node.meta?.includes('preview')) return;

      needsImport = true;

      const nextNode = parent.children[i + 1];
      const hasTsNode = nextNode?.lang === 'tsx';

      const jsCode = node.value.replaceAll('`', '\\`');

      parent.children.splice(i, hasTsNode ? 2 : 1, {
        type: 'jsx',
        value: `<Preview jsCode={\`${jsCode}\`} />`,
      });
    });

    if (needsImport) {
      tree.children.unshift({
        type: 'import',
        value: `import Preview from '@site/src/components/preview';`,
      });
    }

    return tree;
  };
};
