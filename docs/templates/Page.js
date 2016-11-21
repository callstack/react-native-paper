/* @flow */

import React from 'react';
import css from 'next/css';
import Link from 'next/link';
import mono from './styles/mono';

const wrapper = css({
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
});

const sidebar = css({
  width: '240px',
  padding: '24px',
  backgroundColor: '#f0f0f0',
  overflow: 'auto',
});

const content = css({
  flex: 1,
  height: '100%',
  overflow: 'auto',
});

const separator = css({
  border: 0,
  backgroundColor: '#ddd',
  height: '1px',
  margin: '4px 0',
});

const link = css({
  display: 'block',
  padding: '4px 0',
  textDecoration: 'none',
  opacity: 0.32,

  ':hover': {
    opacity: 1,
  },
});

const active = css({
  opacity: 1,
});

export default function Body({ url, pages, children }: any) {
  return (
    <div {...wrapper}>
      <nav {...sidebar}>
        <Link href='/'>
          <a {...mono} {...link} {...(url.pathname === '/' ? active : null)}>
            Home
          </a>
        </Link>
        <hr {...separator} />
        {pages.map(page =>
          <Link key={page} href={`/${page.toLowerCase()}`}>
            <a {...mono} {...link} {...(url.pathname === '/' + page.toLowerCase() ? active : null)}>
              {page}
            </a>
          </Link>
        )}
      </nav>
      <div {...content}>
        {children}
      </div>
    </div>
  );
}
