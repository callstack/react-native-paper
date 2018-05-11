/* @flow */

import color from 'color';
import DefaultTheme from './DefaultTheme';
import { white, grey800, lightBlue500, redA400 } from './colors';
import type { Theme } from '../types';

const DarkTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: lightBlue500,
    background: '#242424',
    surface: grey800,
    error: redA400,
    text: white,
    disabled: color(white)
      .alpha(0.3)
      .rgb()
      .string(),
    placeholder: color(white)
      .alpha(0.38)
      .rgb()
      .string(),
  },
};

export default DarkTheme;
