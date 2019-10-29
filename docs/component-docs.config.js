/* @flow */

import path from 'path';
import fs from 'fs';

const root = path.join(__dirname, '..');
const dist = path.join(__dirname, 'dist');
const assets = [
  path.join(__dirname, 'assets', 'gallery'),
  path.join(__dirname, 'assets', 'showcase'),
  path.join(__dirname, 'assets', 'screenshots'),
  path.join(__dirname, 'assets', 'images'),
];
const styles = [path.join(__dirname, 'assets', 'styles.css')];
const scripts = [
  path.join(__dirname, 'assets', 'snack.js'),
  path.join(__dirname, 'assets', 'version.js'),
];
const github = 'https://github.com/callstack/react-native-paper/edit/master/';

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

require.extensions['.ts'] = require.extensions['.js'];
require.extensions['.tsx'] = require.extensions['.js'];

function getType(file: string) {
  if (/\.(js|tsx?)$/.test(file)) {
    return 'custom';
  } else if (file.endsWith('.mdx')) {
    return 'mdx';
  }
  return 'md';
}

function getPages() {
  const components = fs
    .readFileSync(path.join(__dirname, '../src/index.tsx'))
    .toString()
    .split('\n')
    .map(line =>
      line
        .split(' ')
        .pop()
        .replace(/('|;)/g, '')
    )
    .filter(line => line.startsWith('./components/'))
    .map(line => {
      const file = require.resolve(path.join(__dirname, '../src', line));
      if (/\/index\.(js|tsx?)$/.test(file)) {
        const matches = fs
          .readFileSync(file)
          .toString()
          .match(/export \{ default \} from .+/);
        if (matches && matches.length) {
          const name = matches[0]
            .split(' ')
            .pop()
            .replace(/('|;)/g, '');
          return require.resolve(path.join(__dirname, '../src', line, name));
        }
      }
      return file;
    })
    .reduce((acc, file) => {
      const content = fs.readFileSync(file).toString();
      const groupMatch = /\/\/ @component-group (\w+)/gm.exec(content);
      const group = groupMatch ? groupMatch[1] : undefined;

      if (/import \* as React/.test(content)) {
        acc.push({ file, group });
      }

      const match = content.match(/\/\/ @component (.\/\w+\.(js|tsx?))/gm);

      if (match && match.length) {
        const componentFiles = match.map(line => {
          const fileName = line.split(' ')[2];
          return {
            group,
            file: require.resolve(
              path.join(
                file
                  .split('/')
                  .slice(0, -1)
                  .join('/'),
                fileName
              )
            ),
          };
        });

        acc.push(...componentFiles);
      }

      return acc;
    }, [])
    .filter(
      (info, index, self) =>
        index === self.findIndex(other => info.file === other.file)
    )
    .sort((a, b) => {
      const nameA = a.file.split('/').pop();
      const nameB = b.file.split('/').pop();
      return nameA.localeCompare(nameB);
    })
    .sort((a, b) => {
      const nameA = (a.group || a.file).split('/').pop();
      const nameB = (b.group || b.file).split('/').pop();
      return nameA.localeCompare(nameB);
    })
    .map(info => ({ ...info, type: 'component' }));

  const docs = fs
    .readdirSync(path.join(__dirname, 'pages'))
    .filter(file => file.includes('.'))
    .map(file => ({
      file: path.join(__dirname, 'pages', file),
      type: getType(file),
    }));

  return [...docs, { type: 'separator' }, ...components];
}

module.exports = {
  root,
  logo: 'images/sidebar-logo.svg',
  assets,
  styles,
  scripts,
  pages: getPages,
  output: dist,
  github,
};
