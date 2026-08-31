import { parse } from '@babel/parser';
import * as types from '@babel/types';
import type { Identifier, StringLiteral } from '@babel/types';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative as relativePath, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type PackageJson = {
  name: string;
  main: string;
};

type Mapping = {
  path: string;
  name: string;
};

const isRecord = (value: unknown): value is { [key: string]: unknown } =>
  typeof value === 'object' && value !== null;

const readPackageJson = (path: string): PackageJson => {
  const packageJson: unknown = JSON.parse(readFileSync(path, 'utf8'));

  if (
    !isRecord(packageJson) ||
    typeof packageJson.name !== 'string' ||
    typeof packageJson.main !== 'string'
  ) {
    throw new Error(`Unable to read package name and main from ${path}`);
  }

  return {
    name: packageJson.name,
    main: packageJson.main,
  };
};

const getName = (node: Identifier | StringLiteral) =>
  types.isIdentifier(node) ? node.name : node.value;

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, '..');
const packageJson = readPackageJson(resolve(root, 'package.json'));
const output = join(root, 'lib/mappings.json');
const source = readFileSync(resolve(root, 'src', 'index.tsx'), 'utf8');
const ast = parse(source, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript'],
});

const index = packageJson.main;
const relative = (value: string) =>
  relativePath(root, resolve(root, dirname(index), value));

const mappings = ast.program.body.reduce<{ [key: string]: Mapping }>(
  (acc, declaration, _index, self) => {
    if (types.isExportNamedDeclaration(declaration)) {
      const declarationSource = declaration.source;

      if (declarationSource) {
        declaration.specifiers.forEach((specifier) => {
          if (!types.isExportSpecifier(specifier)) {
            return;
          }

          acc[getName(specifier.exported)] = {
            path: relative(declarationSource.value),
            name: getName(specifier.local),
          };
        });
      } else {
        declaration.specifiers.forEach((specifier) => {
          if (!types.isExportSpecifier(specifier)) {
            return;
          }

          const name = getName(specifier.exported);
          const localName = getName(specifier.local);

          self.forEach((it) => {
            if (
              types.isImportDeclaration(it) &&
              it.specifiers.some(
                (s) =>
                  types.isImportNamespaceSpecifier(s) &&
                  s.local.name === localName
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
  },
  {}
);

if (!existsSync(dirname(output))) {
  mkdirSync(dirname(output));
}

writeFileSync(
  output,
  JSON.stringify({ name: packageJson.name, index, mappings }, null, 2)
);
