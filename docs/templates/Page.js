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
  padding: '16px',
  backgroundColor: '#f9f9f9',
  overflow: 'auto',
});

const content = css({
  flex: 1,
  height: '100%',
  overflow: 'auto',
});

const link = css({
  display: 'block',
  margin: '8px',
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
      <div {...sidebar}>
        <Link href='/'>
          <a {...mono} {...link} {...(url.pathname === '/' ? active : null)}>
            Home
          </a>
        </Link>
        {pages.map(page =>
          <Link key={page} href={`/${page.toLowerCase()}`}>
            <a {...mono} {...link} {...(url.pathname === '/' + page.toLowerCase() ? active : null)}>
              {page}
            </a>
          </Link>
        )}
      </div>
      <div {...content}>
        {children}
      </div>
    </div>
  );
}
