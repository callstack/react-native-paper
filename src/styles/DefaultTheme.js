/* @flow */

import color from 'color';
import { indigo500, indigo700, pinkA200, black, white, grey50 } from './colors';
import fonts from './fonts';

export default {
  dark: false,
  roundness: 2,
  colors: {
    primary: indigo500,
    primaryDark: indigo700,
    accent: pinkA200,
    background: grey50,
    paper: white,
    text: black,
    secondaryText: color(black)
      .alpha(0.7)
      .rgb()
      .string(),
    disabled: color(black)
      .alpha(0.26)
      .rgb()
      .string(),
    placeholder: color(black)
      .alpha(0.38)
      .rgb()
      .string(),
  },
  fonts,
};
