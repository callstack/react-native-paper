import color from 'color';
import { black, white, pinkA400 } from './colors';
import configureFonts from '../../fonts';
import type { MD2Theme } from '../../../types';

const LightTheme: MD2Theme = {
  dark: false,
  roundness: 4,
  version: 2,
  colors: {
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: white,
    error: '#B00020',
    text: black,
    onSurface: '#000000',
    disabled: color(black).alpha(0.26).rgb().string(),
    placeholder: color(black).alpha(0.54).rgb().string(),
    backdrop: color(black).alpha(0.5).rgb().string(),
    notification: pinkA400,
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
};

export default LightTheme;
