const SKIP = Symbol('SKIP');

module.exports = function rewire(babel, options) {
  const t = babel.types;

  const { name, index, mappings } = require(
    options.mappings || '../../mappings.json'
  );

  return {
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value !== name || path.node[SKIP]) {
          return;
        }

        path.node.source.value = `${name}/${index}`;
        path.replaceWithMultiple(
          path.node.specifiers.reduce((declarations, specifier) => {
            const mapping = mappings[specifier.imported.name];

            if (mapping) {
              const alias = `${name}/${mapping.path}`;
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
                (d) => d.source.value === path.node.source.value
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
      ExportNamedDeclaration(path) {
        if (
          !path.node.source ||
          path.node.source.value !== name ||
          path.node[SKIP]
        ) {
          return;
        }

        path.node.source.value = `${name}/${index}`;
        path.replaceWithMultiple(
          path.node.specifiers.reduce((declarations, specifier) => {
            const mapping = mappings[specifier.local.name];

            if (mapping) {
              const alias = `${name}/${mapping.path}`;
              let s;

              switch (mapping.name) {
                case 'default':
                  s = t.exportSpecifier(
                    t.identifier('default'),
                    t.identifier(specifier.exported.name)
                  );
                  break;
                case '*':
                  s = t.exportNamespaceSpecifier(
                    t.identifier(specifier.exported.name)
                  );
                  break;
                default:
                  s = t.exportSpecifier(
                    t.identifier(mapping.name),
                    t.identifier(specifier.exported.name)
                  );
              }

              declarations.push(
                t.exportNamedDeclaration(null, [s], t.stringLiteral(alias))
              );
            } else {
              const previous = declarations.find(
                (d) => d.source.value === path.node.source.value
              );

              if (previous) {
                previous.specifiers.push(specifier);
              } else {
                const node = t.exportNamedDeclaration(
                  null,
                  [specifier],
                  path.node.source
                );
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
