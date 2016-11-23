/* @flow */

import React from 'react';
import { style } from 'glamor';
import mono from './styles/mono';
import Link from './Link';

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

export default function Body({ name, pages, children }: any) {
  return (
    <div {...wrapper}>
      <nav {...sidebar}>
        <Link to='index' {...mono} {...link} {...(name === 'index' ? active : null)}>
          Home
        </Link>
        <hr {...separator} />
        {pages.map(page =>
          <Link
            key={page.name}
            to={page.name.toLowerCase()}
            {...mono}
            {...link}
            {...(name === page.name.toLowerCase() ? active : null)}
          >
            {page.name}
          </Link>
        )}
      </nav>
      <div {...content}>
        {children}
      </div>
    </div>
  );
}
