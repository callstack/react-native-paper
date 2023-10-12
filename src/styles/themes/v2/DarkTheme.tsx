import color from 'color';

import { black, pinkA100, white } from './colors';
import { MD2LightTheme } from './LightTheme';
import type { Fonts, MD2Theme } from '../../../types';
import configureFonts from '../../fonts';

export const MD2DarkTheme: MD2Theme = {
  ...MD2LightTheme,
  dark: true,
  mode: 'adaptive',
  version: 2,
  isV3: false,
  colors: {
    ...MD2LightTheme.colors,
    primary: '#BB86FC',
    accent: '#03dac6',
    background: '#121212',
    surface: '#121212',
    error: '#CF6679',
    onSurface: '#FFFFFF',
    text: white,
    disabled: color(white).alpha(0.38).rgb().string(),
    placeholder: color(white).alpha(0.54).rgb().string(),
    backdrop: color(black).alpha(0.5).rgb().string(),
    notification: pinkA100,
    tooltip: 'rgba(230, 225, 229, 1)',
  },
  fonts: configureFonts({ isV3: false }) as Fonts,
};
