/* @flow */

import React from 'react';
import Mono from './Mono';
import css from 'next/css';

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

export default function Body({ pages, children }: any) {
  const pathname = global.location && global.location.pathname;
  return (
    <div className={wrapper}>
      <div className={sidebar}>
        <a
          className={`${link} ${pathname === '/' ? active : ''}`}
          href='/'
        >
          <Mono>Home</Mono>
        </a>
        {pages.map(page =>
          <a
            key={page}
            className={`${link} ${pathname === '/' + page.toLowerCase() ? active : ''}`}
            href={`/${page.toLowerCase()}`}
          >
            <Mono>{page}</Mono>
          </a>
        )}
      </div>
      <div className={content}>
        {children}
      </div>
    </div>
  );
}
