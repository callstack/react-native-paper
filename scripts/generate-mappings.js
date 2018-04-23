/* @flow */

const path = require('path');
const fs = require('fs');
const types = require('babel-types');
const babylon = require('babylon');

const output = path.join(__dirname, '../dist/mappings.json');
const source = fs.readFileSync(require.resolve('..'), 'utf8');
const ast = babylon.parse(source, {
  sourceType: 'module',
  plugins: [
    'jsx',
    'flow',
    'objectRestSpread',
    'classProperties',
    'asyncGenerators',
  ],
});

const relative = (value /* : string */) =>
  path.relative(
    path.resolve(__dirname, '..'),
    path.resolve(path.dirname(require.resolve('..')), value)
  );

const mappings = ast.program.body.reduce((acc, declaration, index, self) => {
  if (types.isExportNamedDeclaration(declaration)) {
    if (declaration.source) {
      declaration.specifiers.forEach(specifier => {
        acc[specifier.exported.name] = {
          path: relative(declaration.source.value),
          name: specifier.local.name,
        };
      });
    } else {
      declaration.specifiers.forEach(specifier => {
        const name = specifier.exported.name;

        self.forEach(it => {
          if (
            types.isImportDeclaration(it) &&
            it.specifiers.some(
              s =>
                types.isImportNamespaceSpecifier(s) &&
                s.local.name === specifier.local.name
            )
          ) {
            acc[name] = {
              path: relative(it.source.value),
              name: '*',
            };
          }
        });
      });
    }
  }

  return acc;
}, {});

fs.existsSync(path.dirname(output)) || fs.mkdirSync(path.dirname(output));
fs.writeFileSync(output, JSON.stringify(mappings, null, 2));
