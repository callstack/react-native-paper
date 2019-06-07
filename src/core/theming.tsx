/* eslint-disable no-redeclare */

import {
  createTheming,
  ThemingType,
  WithThemeType,
} from '@callstack/react-theme-provider';
import DefaultTheme from '../styles/DefaultTheme';
import { Theme, ThemeShape } from '../types';

export const {
  ThemeProvider,
  withTheme,
}: ThemingType<Theme, ThemeShape> = createTheming(DefaultTheme);
