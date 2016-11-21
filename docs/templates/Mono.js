/* @flow */

import React from 'react';
import css from 'next/css';

const styles = css({
  fontFamily: '"Roboto Mono", "Operator Mono", "Fira Code", "Ubuntu Mono", "Droid Sans Mono", "Liberation Mono", "Source Code Pro", Menlo, Consolas, Courier, monospace',
  fontWeight: 'bold',
  fontSize: '16px',
  lineHeight: 2,
  color: '#000',
});

export default function Mono(props: any) {
  return <div {...props} className={`${styles} ${props.className || ''}`} />;
}
