/* @flow */

import { style, insertGlobal } from 'glamor';

insertGlobal(`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  html, body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    margin: 0;
    padding: 0;
    color: #333;
  }
`);

const styles = style({
  lineHeight: 1.5,
});

export default styles;
