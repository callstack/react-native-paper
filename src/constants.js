/* @flow */

import { Platform } from 'react-native';

const DEFAULT_STATUSBAR_HEIGHT_EXPO =
  global.__expo && global.__expo.Constants
    ? global.__expo.Constants.statusBarHeight
    : 0;

export const APPROX_STATUSBAR_HEIGHT = Platform.select({
  android: DEFAULT_STATUSBAR_HEIGHT_EXPO,
  ios: Platform.Version < 11 ? DEFAULT_STATUSBAR_HEIGHT_EXPO : 0,
});
