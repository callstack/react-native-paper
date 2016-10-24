/* @flow */
import color from 'color';
import {
  indigo500,
  indigo700,
  pinkA200,
  black,
} from './colors';

export default {
  colors: {
    primary: indigo500,
    primaryDark: indigo700,
    accent: pinkA200,
    primaryText: black,
    secondaryText: color(black).alpha(0.7).rgbaString(),
    disabledText: color(black).alpha(0.5).rgbaString(),
  },
};
