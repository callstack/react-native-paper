/* @flow */

import React from 'react';
import { insertGlobal } from 'glamor';
import Router from './Router';
import Page from './Page';
import Home from './Home';
import ComponentDocs from './ComponentDocs';
import Markdown from './Markdown';

insertGlobal(`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  html, body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    margin: 0;
    padding: 0;
    color: #333;
    lineHeight: 1.5;
  }
  code {
    font-family: "Roboto Mono", "Operator Mono", "Fira Code", "Ubuntu Mono", "Droid Sans Mono", "Liberation Mono", "Source Code Pro", Menlo, Consolas, Courier, monospace;
    color: #000;
    line-height: 2;
  }
  a {
    color: #1976D2;
    text-decoration: none;
  }
  a:hover {
    color: #2196F3;
  }
`);

export const buildRoutes = (pages: Array<*>, components: Array<*>) =>
  components.map(it => ({
    title: it.name,
    name: it.name.toLowerCase(),
    description: it.info.description,
    component: props => (
      <Page {...props} pages={pages} components={components}>
        <ComponentDocs {...it} />
      </Page>
    ),
  })).concat(pages.map(it => ({
    title: it.name,
    name: it.name.toLowerCase().replace(/\s+/g, '-'),
    description: '',
    component: props => (
      <Page {...props} pages={pages} components={components}>
        <Markdown source={it.text} />
      </Page>
    ),
  }))).concat({
    title: 'Home',
    name: 'index',
    description: '',
    component: props => (
      <Page {...props} pages={pages} components={components}>
        <Home />
      </Page>
    ),
  });

export default function App({ pages, components, name }: any) {
  const routes = buildRoutes(pages, components);
  return (
    <Router
      name={name}
      routes={routes}
    />
  );
}
