/* @flow */

import React from 'react';
import { style } from 'glamor';
import mono from './styles/mono';

const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
});

const sidebar = style({
  width: '240px',
  padding: '24px',
  backgroundColor: '#f0f0f0',
  overflow: 'auto',
});

const content = style({
  flex: 1,
  height: '100%',
  overflow: 'auto',
});

const separator = style({
  border: 0,
  backgroundColor: '#ddd',
  height: '1px',
  margin: '4px 0',
});

const link = style({
  display: 'block',
  padding: '4px 0',
  textDecoration: 'none',
  opacity: 0.32,

  ':hover': {
    opacity: 1,
  },
});

const active = style({
  opacity: 1,
});

export default function Body({ url, pages, children }: any) {
  return (
    <div {...wrapper}>
      <nav {...sidebar}>
        <a href='index.html' {...mono} {...link} {...(url.pathname === '/index' ? active : null)}>
          Home
        </a>
        <hr {...separator} />
        {pages.map(page =>
          <a
            key={page}
            href={`${page.toLowerCase()}.html`}
            {...mono}
            {...link}
            {...(url.pathname === `/${page.toLowerCase()}` ? active : null)}
          >
            {page}
          </a>
        )}
      </nav>
      <div {...content}>
        {children}
      </div>
    </div>
  );
}
