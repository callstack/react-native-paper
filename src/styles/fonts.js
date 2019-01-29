import { Platform } from 'react-native';

const fonts = Platform.select({
  web: {
    regular: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    medium:
      'Roboto-Medium, Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    light:
      'Roboto-Light, Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    thin: 'Roboto-Thin, Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
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
