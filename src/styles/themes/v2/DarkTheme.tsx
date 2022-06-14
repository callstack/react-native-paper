import color from 'color';
import LightTheme from './LightTheme';
import { black, white, pinkA100 } from './colors';
import configureFonts from '../../fonts';
import type { ThemeBase } from '../../../types';

const DarkTheme: ThemeBase = {
  ...LightTheme,
  dark: true,
  mode: 'adaptive',
  version: 2,
  isV3: false,
  colors: {
    ...LightTheme.colors,
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
  },
  fonts: configureFonts(),
};

export default DarkTheme;
