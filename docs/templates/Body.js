/* @flow */

import React from 'react';
import css, { insertGlobal } from 'next/css';

insertGlobal(`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  html, body {
    margin: 0;
    padding: 0;
  }
`);

const styles = css({
  fontFamily: '"Roboto Slab", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontSize: 16,
  lineHeight: 1.5,
  color: '#555',
});

export default function Body(props: any) {
  return <div {...props} className={`${styles} ${props.className || ''}`} />;
}
