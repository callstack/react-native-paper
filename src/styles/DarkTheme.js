/* @flow */

import color from 'color';
import DefaultTheme from './DefaultTheme';
import { white, grey800, cyan500, cyan700 } from './colors';
import type { Theme } from '../types';

const DarkTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: cyan500,
    primaryDark: cyan700,
    background: '#303030',
    paper: grey800,
    text: white,
    secondaryText: color(white)
      .alpha(0.7)
      .rgbaString(),
    disabled: color(white)
      .alpha(0.5)
      .rgbaString(),
    placeholder: color(white)
      .alpha(0.38)
      .rgbaString(),
  },
};

export default DarkTheme;
