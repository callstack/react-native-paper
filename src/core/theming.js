/* @flow */
/* eslint-disable no-redeclare */

import {
  createTheming,
  type ThemingType,
} from '@callstack/react-theme-provider';
import DefaultTheme from '../styles/DefaultTheme';
import type { Theme, ThemeShape } from '../types';

export const {
  ThemeProvider,
  withTheme,
}: ThemingType<?Theme, ThemeShape> = createTheming(DefaultTheme);
