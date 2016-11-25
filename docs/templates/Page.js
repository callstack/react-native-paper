/* @flow */

import React from 'react';
import { style } from 'glamor';
import mono from './styles/mono';
import Link from './Link';

const wrapper = style({
  display: 'flex',
  height: '100vh',
  flexDirection: 'column',

  '@media(min-width: 640px)': {
    flexDirection: 'row',
  },
});

const sidebar = style({
  padding: '24px',
  backgroundColor: '#f0f0f0',
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

  '@media(min-width: 640px)': {
    height: '100%',
    overflow: 'auto',
  },
});

const menuButton = style({
  display: 'none',

  '&:checked ~ nav': {
    display: 'block',
  },
});

const menuIcon = style({
  fontSize: '24px',
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '24px',
  zIndex: 10,

  '@media(min-width: 640px)': {
    display: 'none',
  },
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
      <input
        {...menuButton}
        id='slide-sidebar'
        type='checkbox'
        role='button'
      />
      <label htmlFor='slide-sidebar'>
        <span {...menuIcon}>☰</span>
      </label>
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
