import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

const fonts = {
  regular: isIOS ? 'Helvetica Neue' : 'sans-serif',
  medium: isIOS ? 'HelveticaNeue-Medium' : 'sans-serif-medium',
  light: isIOS ? 'HelveticaNeue-Light' : 'sans-serif-light',
  thin: isIOS ? 'HelveticaNeue-Thin' : 'sans-serif-thin',
};

export default fonts;
