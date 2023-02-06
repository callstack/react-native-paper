exports['no-import-react-forwardref'] = {
  meta: {
    docs: {
      description: 'Disallow importing of React.forwardRef',
      category: 'Possible Errors',
      recommended: false,
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== 'react') return;

        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportSpecifier') continue;
          if (specifier.imported.name !== 'forwardRef') continue;

          context.report({
            loc: specifier.loc,
            message: 'Import forwardRef from src/utils/forwardRef instead',
          });
        }
      },
    };
  },
};
