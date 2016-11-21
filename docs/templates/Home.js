/* @flow */

import React from 'react';
import { style } from 'glamor';
import mono from './styles/mono';
import body from './styles/body';

const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  padding: '24px 48px',
});

const inner = style({
  textAlign: 'center',
});

const heading = style({
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '16px 0 16px -24px',
});

const description = style({
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
