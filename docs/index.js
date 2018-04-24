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
    pages: getPages,
    output: path.join(__dirname, 'dist'),
  });
} else {
  build({
    assets,
    styles,
    pages: getPages,
    output: path.join(__dirname, 'dist'),
  });
}
