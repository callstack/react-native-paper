/* @flow */

import path from 'path';
import fs from 'fs';
import del from 'del';
import { parse } from 'react-docgen';

const pages = path.join(__dirname, 'pages');

del.sync(pages);
fs.mkdirSync(pages);

const components = fs.readFileSync(path.join(__dirname, '../src/index.js'))
  .toString()
  .split('\n')
  .map(line => line.split(' ').pop().replace(/('|;)/g, ''))
  .filter(line => line.startsWith('./components/'))
  .map(line => require.resolve(path.join(__dirname, '../src', line)));

components.forEach(comp => {
  const componentName = comp.split('/').pop().split('.')[0];
  try {
    const componentInfo = parse(fs.readFileSync(comp).toString());

    fs.writeFileSync(path.join(pages, `${componentName.toLowerCase()}.js`), `
      import React from 'react';
      import ComponentDocs from '../templates/ComponentDocs';

      export default function ${componentName}Doc() {
        return <ComponentDocs name='${componentName}' info={${JSON.stringify(componentInfo)}} />
      }
    `);
  } catch (e) {
    console.log(`${componentName}: ${e.message}`);
  }
});

fs.writeFileSync(path.join(pages, 'index.js'), `
export { default as default } from '../templates/Home';
`);
