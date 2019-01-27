import { Platform } from 'react-native';

const fonts = Platform.select({
  web: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    light: 'Roboto-Light',
    thin: 'Roboto-Thin',
  },
  ios: {
    regular: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
    light: 'HelveticaNeue-Light',
    thin: 'HelveticaNeue-Thin',
  },
  default: {
    regular: 'sans-serif',
    medium: 'sans-serif-medium',
    light: 'sans-serif-light',
    thin: 'sans-serif-thin',
  },
});

export default fonts;
