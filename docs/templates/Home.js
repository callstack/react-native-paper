/* @flow */

import React from 'react';
import css from 'next/css';
import mono from './styles/mono';
import body from './styles/body';

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
  fontWeight: 'bold',
  margin: '16px 0 16px -24px',
});

const description = css({
  fontSize: '24px',
});

export default function Home() {
  return (
    <div {...wrapper}>
      <div {...inner}>
        <h1 {...mono} {...heading}>React Native Paper</h1>
        <p {...body} {...description}>Documentation</p>
      </div>
    </div>
  );
}
