/* @flow */

import { style, insertGlobal } from 'glamor';

const fontFamily = '"Roboto Mono", "Operator Mono", "Fira Code", "Ubuntu Mono", "Droid Sans Mono", "Liberation Mono", "Source Code Pro", Menlo, Consolas, Courier, monospace';

insertGlobal(`
  code {
    font-family: ${fontFamily};
    color: #000;
  }
`);

const styles = style({
  fontFamily,
  color: '#000',
  lineHeight: 2,
});

export default styles;
