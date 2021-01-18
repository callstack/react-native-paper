import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const APPROX_STATUSBAR_HEIGHT = Platform.select({
  android: Constants.statusBarHeight,
  ios: Platform.Version < 11 ? Constants.statusBarHeight : 0,
});
