/* @flow */

import React from 'react';
import { style } from 'glamor';
import Link from './Link';

const wrapper = style({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',

  '@media(min-width: 640px)': {
    flexDirection: 'row',
  },
});

const sidebar = style({
  padding: '24px',
  backgroundColor: '#262939',
  display: 'none',

  '@media(min-width: 640px)': {
    display: 'block',
    height: '100%',
    width: '240px',
    overflow: 'auto',
  },
});

const content = style({
  flex: 1,
  padding: '12px 24px',

  '@media(min-width: 640px)': {
    height: '100%',
    overflow: 'auto',
    padding: '24px 48px',
  },
});

const menuButton = style({
  display: 'none',

  '&:checked ~ nav': {
    display: 'block',
  },

  '&:checked ~ label': {
    color: '#fff',
    opacity: 0.64,
  },

  '&:checked ~ label > :first-child': {
    display: 'none',
  },

  '&:not(:checked) ~ label > :last-child': {
    display: 'none',
  },
});

const menuIcon = style({
  fontSize: '24px',
  lineHeight: 1,
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '32px 24px',
  zIndex: 10,

  '@media(min-width: 640px)': {
    display: 'none',
  },
});

const separator = style({
  border: 0,
  backgroundColor: '#fff',
  height: '1px',
  margin: '8px 0',
  opacity: 0.04,
});

const link = style({
  display: 'block',
  padding: '4px 0',
  textDecoration: 'none',
  opacity: 0.16,

  ':hover': {
    opacity: 0.64,
  },

  '& code': {
    color: '#fff',
  },
});

const active = style({
  opacity: 0.64,
});

export default function Page({ name, pages, components, children }: any) {
  return (
    <div {...wrapper}>
      <input
        {...menuButton}
        id='slide-sidebar'
        type='checkbox'
        role='button'
      />
      <label {...menuIcon} htmlFor='slide-sidebar'>
        <span>☰</span>
        <span>✕</span>
      </label>
      <nav {...sidebar}>
        <Link to='index' {...link} {...(name === 'index' ? active : null)}>
          <code>Home</code>
        </Link>
        {pages.map(page =>
          <Link
            key={page.name}
            to={page.name.toLowerCase().replace(/\s+/g, '-')}
            {...link}
            {...(name === page.name.toLowerCase().replace(/\s+/g, '-') ? active : null)}
          >
            <code>{page.name}</code>
          </Link>
        )}
        <hr {...separator} />
        {components.map(page =>
          <Link
            key={page.name}
            to={page.name.toLowerCase()}
            {...link}
            {...(name === page.name.toLowerCase() ? active : null)}
          >
            <code>{page.name}</code>
          </Link>
        )}
      </nav>
      <div {...content}>
        {children}
      </div>
    </div>
  );
}
