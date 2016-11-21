/* @flow */

import path from 'path';
import fs from 'fs';
import del from 'del';
import { parse } from 'react-docgen';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { renderStatic } from 'glamor/server';
import HTML from './templates/HTML';
import Page from './templates/Page';
import Home from './templates/Home';
import ComponentDocs from './templates/ComponentDocs';

const dist = path.join(__dirname, 'dist');

del.sync(dist);
fs.mkdirSync(dist);

const components = fs.readFileSync(path.join(__dirname, '../src/index.js'))
  .toString()
  .split('\n')
  .map(line => line.split(' ').pop().replace(/('|;)/g, ''))
  .filter(line => line.startsWith('./components/'))
  .map(line => {
    const file = require.resolve(path.join(__dirname, '../src', line));
    if (file.endsWith('/index.js')) {
      const matches = fs.readFileSync(file).toString().match(/export \{ default as default \} from .+/);
      if (matches && matches.length) {
        const name = matches[0].split(' ').pop().replace(/('|;)/g, '');
        return require.resolve(path.join(__dirname, '../src', line, name));
      }
    }
    return file;
  });

const items = [];
const pages = [];

components.forEach(comp => {
  const componentName = comp.split('/').pop().split('.')[0];
  try {
    const componentInfo = parse(fs.readFileSync(comp).toString());
    items.push({ name: componentName, info: componentInfo });
    pages.push(componentName);
  } catch (e) {
    console.log(`${componentName}: ${e.message}`);
  }
});

pages.sort();
items.forEach(it => {
  const { html, css } = renderStatic(
    () => ReactDOMServer.renderToString(
      <Page url={{ pathname: `/${it.name.toLowerCase()}` }} pages={pages}>
        <ComponentDocs name={it.name} info={it.info} />
      </Page>
    )
  );
  fs.writeFileSync(
    path.join(dist, `${it.name.toLowerCase()}.html`),
    ReactDOMServer.renderToString(
      // eslint-disable-next-line react/jsx-pascal-case
      <HTML
        title={it.name}
        description={it.info.description}
        body={html}
        css={css}
      />
    )
  );
});

const { html, css } = renderStatic(
  () => ReactDOMServer.renderToString(
    <Page url={{ pathname: '/' }} pages={pages}>
      <Home />
    </Page>
  )
);
fs.writeFileSync(path.join(dist, 'index.html'),
  ReactDOMServer.renderToString(
    // eslint-disable-next-line react/jsx-pascal-case
    <HTML
      title='Home'
      description=''
      body={html}
      css={css}
    />
  )
);

