/* @flow */

import path from 'path';
import fs from 'fs';
import { build, serve } from 'component-docs';

const task = process.argv[2];
const dist = path.join(__dirname, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

function getFiles() {
  const components = fs
    .readFileSync(path.join(__dirname, '../src/index.js'))
    .toString()
    .split('\n')
    .map(line => line.split(' ').pop().replace(/('|;)/g, ''))
    .filter(line => line.startsWith('./components/'))
    .map(line => {
      const file = require.resolve(path.join(__dirname, '../src', line));
      if (file.endsWith('/index.js')) {
        const matches = fs
          .readFileSync(file)
          .toString()
          .match(/export \{ default \} from .+/);
        if (matches && matches.length) {
          const name = matches[0].split(' ').pop().replace(/('|;)/g, '');
          return require.resolve(path.join(__dirname, '../src', line, name));
        }
      }
      return file;
    })
    .sort();
  const pages = fs
    .readdirSync(path.join(__dirname, 'pages'))
    .map(page => path.join(__dirname, 'pages', page));
  return [pages, components];
}

if (task !== 'build') {
  serve({
    files: getFiles,
    output: path.join(__dirname, 'dist'),
  });
} else {
  build({
    files: getFiles,
    output: path.join(__dirname, 'dist'),
  });
}
