/* @flow */

import * as React from 'react';
import {
  Platform,
  StyleSheet,
  ProgressViewIOS,
  ProgressBarAndroid,
} from 'react-native';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import setColor from 'color';

type Props = {
  /**
   * Progress value (between 0 and 1)
   */
  progress: number,
  /**
   * Color of the progress bar
   */
  color?: string,
  style?: any,
  theme: Theme,
};

const ProgressBarComponent = Platform.select({
  ios: ProgressViewIOS,
  android: ProgressBarAndroid,
});

/**
 * Progress bar is an indicator used to present some activity in the app
 *
 * **Usage:**
 * ```js
 * const MyComponent = () => (
 *   <ProgressBar progress={0.5} color={Colors.red800} />
 * );
 * ```
 */
const ProgressBar = ({ progress, color, style, theme }: Props) => {
  const tintColor = color || theme.colors.primary;
  const trackTintColor = setColor(tintColor)
    .alpha(0.38)
    .rgb()
    .string();

  return (
    <ProgressBarComponent
      styleAttr="Horizontal"
      indeterminate={false}
      progress={progress}
      progressTintColor={tintColor}
      color={tintColor}
      style={[styles.progressBarHeight, style]}
      trackTintColor={trackTintColor}
    />
  );
};

const styles = StyleSheet.create({
  progressBarHeight: {
    paddingVertical: 10,
  },
});

export default withTheme(ProgressBar);
