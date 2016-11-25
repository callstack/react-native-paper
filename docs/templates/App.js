/* @flow */

import React from 'react';
import Router from './Router';
import Page from './Page';
import Home from './Home';
import ComponentDocs from './ComponentDocs';

export const buildRoutes = (pages: Array<*>) =>
  pages.map(it => ({
    title: it.name,
    name: it.name.toLowerCase(),
    description: it.info.description,
    component: props => (
      <Page {...props} pages={pages}>
        <ComponentDocs {...it} />
      </Page>
    ),
  })).concat({
    title: 'Home',
    name: 'index',
    description: '',
    component: props => (
      <Page {...props} pages={pages}>
        <Home />
      </Page>
    ),
  });

export default function App({ pages, name }: any) {
  const routes = buildRoutes(pages);
  return (
    <Router
      name={name}
      routes={routes}
    />
  );
}
