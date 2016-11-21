/* @flow */

import React from 'react';
import css from 'next/css';
import Mono from './Mono';
import Body from './Body';

const wrapper = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  padding: '24px 48px',
});

const inner = css({
  textAlign: 'center',
});

const heading = css({
  fontSize: '36px',
  margin: '16px 0 16px -24px',
});

const description = css({
  fontSize: '24px',
});

export default function Home() {
  return (
    <div className={wrapper}>
      <div className={inner}>
        <Mono className={heading}>React Native Paper</Mono>
        <Body className={description}>Documentation</Body>
      </div>
    </div>
  );
}
