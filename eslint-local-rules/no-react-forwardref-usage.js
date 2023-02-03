exports['no-react-forwardref-usage'] = {
  meta: {
    docs: {
      description: 'Disallow usage of React.forwardRef',
      category: 'Possible Errors',
      recommended: false,
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee?.type !== 'MemberExpression') return;

        const { callee } = node;
        if (callee.object.type !== 'Identifier') return;
        if (callee.object.name !== 'React') return;
        if (callee.property.type !== 'Identifier') return;
        if (callee.property.name !== 'forwardRef') return;

        context.report({
          loc: callee.loc,
          message: 'Use forwardRef from src/utils/forwardRef instead',
        });
      },
    };
  },
};
