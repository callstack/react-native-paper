/* @flow */

import path from 'path';
import fs from 'fs';
import { server, bundle } from 'quik';
import { parse } from 'react-docgen';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { renderStatic } from 'glamor/server';
import HTML from './templates/HTML';
import Page from './templates/Page';
import Home from './templates/Home';
import ComponentDocs from './templates/ComponentDocs';

const PORT = 3031;

const task = process.argv[2];
const dist = path.join(__dirname, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

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

function buildHTML({ component, title, description, filename }: any) {
  const pathname = `/${filename}`;
  const { html, css, ids } = renderStatic(
    () => ReactDOMServer.renderToString(
      <Page url={{ pathname }} pages={pages}>
        {React.createElement(component.type, component.props)}
      </Page>
    )
  );

  let body = `<div id='root'>${html}</div>`;

  if (task === 'build') {
    body += `
      <script src='common.bundle.js'></script>
      <script src='${filename}.bundle.js'></script>
    `;
  } else {
    body += `
      <script src='${filename}.js'></script>
    `;
  }

  fs.writeFileSync(
    path.join(dist, `${filename}.js`),
    `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { rehydrate } from 'glamor';
    import Page from '../templates/Page';
    import ${component.type.name} from '../templates/${component.type.name}';

    rehydrate(${JSON.stringify(ids)});

    ReactDOM.render(
      <Page url={{ pathname: '${pathname}' }} pages={${JSON.stringify(pages)}}>
        {React.createElement(${component.type.name}, ${JSON.stringify(component.props)})}
      </Page>,
      document.getElementById('root')
    );
    `,
  );

  fs.writeFileSync(
    path.join(dist, `${filename}.html`),
    ReactDOMServer.renderToString(
      // eslint-disable-next-line react/jsx-pascal-case
      <HTML
        title={title}
        description={description}
        body={body}
        css={css}
      />
    )
  );
}

items.forEach(it => buildHTML({
  component: {
    type: ComponentDocs,
    props: {
      name: it.name,
      info: it.info,
    },
  },
  title: it.name,
  description: it.info.description,
  filename: it.name.toLowerCase(),
}));

buildHTML({
  component: {
    type: Home,
    props: {},
  },
  title: 'Home',
  description: '',
  filename: 'index',
});

const entry = pages.map(page => `dist/${page.toLowerCase()}.js`).concat('dist/index.js');

if (task !== 'build') {
  server({
    root: __dirname,
    watch: entry,
  }).listen(PORT);

  console.log(`Open http://localhost:${PORT}/dist/index.html in your browser.\n`);
} else {
  bundle({
    root: __dirname,
    entry,
    output: 'dist/[name].bundle.js',
    common: 'dist/common.bundle.js',
    sourcemaps: true,
    production: true,
  });
}

