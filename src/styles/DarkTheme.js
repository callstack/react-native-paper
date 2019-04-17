/* @flow */

import color from 'color';
import DefaultTheme from './DefaultTheme';
import {
  black,
  white,
  grey800,
  lightBlue500,
  redA400,
  pinkA100,
} from './colors';
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
    typography: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.54)',
    },
    disabled: color(white)
      .alpha(0.3)
      .rgb()
      .string(),
    backdrop: color(black)
      .alpha(0.5)
      .rgb()
      .string(),
    notification: pinkA100,
  },
};

export default DarkTheme;
