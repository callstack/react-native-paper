/* @flow */

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
    color: '#555',
  }
`);

const styles = css({
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  lineHeight: 1.5,
});

export default styles;
