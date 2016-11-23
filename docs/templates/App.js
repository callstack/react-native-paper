/* @flow */

import React from 'react';
import Router from './Router';
import Page from './Page';
import Home from './Home';
import ComponentDocs from './ComponentDocs';

export default function App({ pages, name }: any) {
  const routes = pages.map(it => ({
    name: it.name.toLowerCase(),
    component: props => (
      <Page {...props} pages={pages}>
        <ComponentDocs {...it} />
      </Page>
    ),
  })).concat({
    name: 'index',
    component: props => (
      <Page {...props} pages={pages}>
        <Home />
      </Page>
    ),
  });

  return (
    <Router
      name={name}
      routes={routes}
    />
  );
}
