/* @flow */

import React from 'react';
import css from 'next/css';
import Link from 'next/link';
import Mono from './Mono';

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
    <div className={wrapper}>
      <div className={sidebar}>
        <Link href='/'>
          <a className={`${link} ${url.pathname === '/' ? active : ''}`}>
            <Mono>Home</Mono>
          </a>
        </Link>
        {pages.map(page =>
          <Link key={page} href={`/${page.toLowerCase()}`}>
            <a className={`${link} ${url.pathname === '/' + page.toLowerCase() ? active : ''}`}>
              <Mono>{page}</Mono>
            </a>
          </Link>
        )}
      </div>
      <div className={content}>
        {children}
      </div>
    </div>
  );
}
