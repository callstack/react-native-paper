/* @flow */

import path from 'path';
import fs from 'fs';
import { server, bundle } from 'quik';
import watch from 'node-watch';
import { parse } from 'react-docgen';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { renderStatic } from 'glamor/server';
import HTML from './templates/HTML';
import App from './templates/App';

const PORT = 3031;

const task = process.argv[2];
const dist = path.join(__dirname, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

let items = [];
let pages = [];

function collectInfo() {
  items = [];
  pages = [];

  const files = fs.readFileSync(path.join(__dirname, '../src/index.js'))
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

  files.forEach(comp => {
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

  fs.writeFileSync(path.join(dist, 'app.data.json'), JSON.stringify(items));
}

collectInfo();

fs.writeFileSync(
  path.join(dist, 'app.src.js'),
  `
  import React from 'react';
  import ReactDOM from 'react-dom';
  import RedBox from 'redbox-react';
  import { rehydrate } from 'glamor';
  import App from '../templates/App';
  import pages from './app.data.json';

  rehydrate(window.__GLAMOR__);

  const root = document.getElementById('root')
  const render = () => {
    try {
      ReactDOM.render(
        <App
          pages={pages}
          name={window.__INITIAL_PATH__}
        />,
        root
      );
    } catch (e) {
      ReactDOM.render(
        <RedBox error={ error } />,
        root
      )
    }
  }

  if (module.hot) {
    module.hot.accept(() => {
      setTimeout(render)
    })
  }

  render()
  `,
);

function buildHTML({ title, description, filename }: any) {
  const { html, css, ids } = renderStatic(
    () => ReactDOMServer.renderToString(
      <App
        pages={items}
        name={filename}
      />
    )
  );

  let body = `<div id='root'>${html}</div>`;

  body += `
    <script>
      window.__INITIAL_PATH__ = '${filename}'
      window.__GLAMOR__ = ${JSON.stringify(ids)}
    </script>
  `;

  if (task === 'build') {
    body += '<script src="app.bundle.js?transpile=false"></script>';
  } else {
    body += '<script src="app.src.js"></script>';
  }

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
  title: it.name,
  description: it.info.description,
  filename: it.name.toLowerCase(),
}));

buildHTML({
  title: 'Home',
  description: '',
  filename: 'index',
});

const entry = [ 'dist/app.src.js' ];

if (task !== 'build') {
  watch(path.join(__dirname, '../src'), () => {
    console.log('Files changed. Rebuilding...\n');
    collectInfo();
  });

  server({
    root: __dirname,
    watch: entry,
  }).listen(PORT);

  console.log(`Open http://localhost:${PORT}/dist/index.html in your browser.\n`);
} else {
  bundle({
    root: __dirname,
    entry,
    output: 'dist/app.bundle.js',
    sourcemaps: true,
    production: true,
  });
}

