/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import setColor from 'color';
import ProgressBarComponent from './ProgressBarComponent';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = {|
  /**
   * Progress value (between 0 and 1).
   */
  progress: number,
  /**
   * Color of the progress bar.
   */
  color?: string,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

/**
 * Progress bar is an indicator used to present progress of some activity in the app.
 *
 * <div class="screenshots">
 *   <img src="screenshots/progress-bar.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ProgressBar, Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <ProgressBar progress={0.5} color={Colors.red800} />
 * );
 *
 * export default MyComponent;
 * ```
 */
class ProgressBar extends React.Component<Props> {
  render() {
    const { progress, color, style, theme } = this.props;
    const tintColor = color || theme.colors.primary;
    const trackTintColor = setColor(tintColor)
      .alpha(0.38)
      .rgb()
      .string();

    return (
      <ProgressBarComponent
        progress={progress}
        progressTintColor={tintColor}
        style={[styles.progressBarHeight, style]}
        trackTintColor={trackTintColor}
      />
    );
  }
}

const styles = StyleSheet.create({
  progressBarHeight: {
    paddingVertical: 10,
  },
});

export default withTheme(ProgressBar);
