const mappings = require('../../dist/mappings.json');

const SKIP = Symbol('SKIP');

module.exports = function rewire(babel) {
  const t = babel.types;

  return {
    visitor: {
      ImportDeclaration(path) {
        if (
          path.node.source.value !== 'react-native-paper' ||
          path.node[SKIP]
        ) {
          return;
        }

        path.replaceWithMultiple(
          path.node.specifiers.reduce((declarations, specifier) => {
            const mapping = mappings[specifier.imported.name];

            if (mapping) {
              const alias = `${path.node.source.value}/${mapping.path}`;
              const identifier = t.identifier(specifier.local.name);

              let s;

              switch (mapping.name) {
                case 'default':
                  s = t.importDefaultSpecifier(identifier);
                  break;
                case '*':
                  s = t.importNamespaceSpecifier(identifier);
                  break;
                default:
                  s = t.importSpecifier(identifier, t.identifier(mapping.name));
              }

              declarations.push(
                t.importDeclaration([s], t.stringLiteral(alias))
              );
            } else {
              const previous = declarations.find(
                d => d.source.value === path.node.source.value
              );

              if (previous) {
                previous.specifiers.push(specifier);
              } else {
                const node = t.importDeclaration([specifier], path.node.source);
                node[SKIP] = true;
                declarations.push(node);
              }
            }

            return declarations;
          }, [])
        );

        path.requeue();
      },
    },
  };
};
