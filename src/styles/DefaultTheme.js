/* @flow */

import color from 'color';
import {
  indigo500,
  indigo700,
  pinkA200,
  black,
} from './colors';
import fonts from './fonts';

export default {
  colors: {
    primary: indigo500,
    primaryDark: indigo700,
    accent: pinkA200,
    text: black,
    secondaryText: color(black).alpha(0.7).rgbaString(),
    disabled: color(black).alpha(0.5).rgbaString(),
  },
  fonts,
};
