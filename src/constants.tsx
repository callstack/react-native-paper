import { NativeModules, Platform } from 'react-native';

// Use the existence of expo-constants as a heuristic for determining if the
// status bar is translucent on Android. This should be replaced in the future
// with react-native-safe-area-context.
const estimatedStatusBarHeight =
  NativeModules.NativeUnimoduleProxy?.modulesConstants?.ExponentConstants
    ?.statusBarHeight ?? 0;

export const APPROX_STATUSBAR_HEIGHT = Platform.select({
  android: estimatedStatusBarHeight,
  ios:
    typeof Platform.Version === 'number' && Platform.Version < 11
      ? estimatedStatusBarHeight
      : 0,
});
