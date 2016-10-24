import {
  Platform,
} from 'react-native';

const isAndroid = Platform.OS === 'android';

const fonts = {
  regular: isAndroid ? 'sans-serif' : 'Helvetica Neue',
  medium: isAndroid ? 'sans-serif-medium' : 'HelveticaNeue-Medium',
  light: isAndroid ? 'sans-serif-light' : 'HelveticaNeue-Light',
  thin: isAndroid ? 'sans-serif-thin' : 'HelveticaNeue-Thin',
};

export default fonts;
