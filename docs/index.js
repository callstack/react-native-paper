/* @flow */

import path from 'path';
import fs from 'fs';
import { build, serve } from 'component-docs';

const task = process.argv[2];
const dist = path.join(__dirname, 'dist');
const assets = [
  path.join(__dirname, 'assets', 'gallery'),
  path.join(__dirname, 'assets', 'showcase'),
  path.join(__dirname, 'assets', 'screenshots'),
  path.join(__dirname, 'assets', 'images'),
];
const styles = [path.join(__dirname, 'assets', 'styles.css')];
const scripts = [path.join(__dirname, 'assets', 'snack.js')];

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

function getPages() {
  const components = fs
    .readFileSync(path.join(__dirname, '../src/index.js'))
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
      if (file.endsWith('/index.js')) {
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

      if (/import \* as React/.test(content)) {
        acc.push(file);
      }

      const match = content.match(/\/\/ @component (.\/\w+\.js)/gm);

      if (match && match.length) {
        const componentFiles = match.map(line => {
          const fileName = line.split(' ')[2];
          return require.resolve(
            path.join(
              file
                .split('/')
                .slice(0, -1)
                .join('/'),
              fileName
            )
          );
        });

        acc.push(...componentFiles);
      }

      return acc;
    }, [])
    .filter((name, index, self) => self.indexOf(name) === index)
    .sort((a, b) => {
      const nameA = a.split('/').pop();
      const nameB = b.split('/').pop();
      return nameA.localeCompare(nameB);
    })
    .map(file => ({ file, type: 'component' }));

  const docs = fs
    .readdirSync(path.join(__dirname, 'pages'))
    .filter(file => file.includes('.'))
    .map(file => ({
      file: path.join(__dirname, 'pages', file),
      type: file.endsWith('.js') ? 'custom' : 'markdown',
    }));

  return [...docs, { type: 'separator' }, ...components];
}

if (task !== 'build') {
  serve({
    assets,
    styles,
    scripts,
    pages: getPages,
    output: path.join(__dirname, 'dist'),
  });
} else {
  build({
    assets,
    styles,
    scripts,
    pages: getPages,
    output: path.join(__dirname, 'dist'),
  });
}
