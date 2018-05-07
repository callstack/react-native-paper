/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import shadow from '../styles/shadow';
import withTheme from '../core/withTheme';
import * as Colors from '../styles/colors';
import type { Theme } from '../types';

type Props = {
  /**
   * Content of the `Paper`.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * Paper is a basic container that can give depth to an element with elevation shadow.
 * A shadow can be applied by specifying the `elevation` property both on Android and iOS.
 *
 * <div class="screenshots">
 *   <img src="screenshots/paper.1_2.png" />
 *   <img src="screenshots/paper.4_6.png" />
 *   <img src="screenshots/paper.9_12.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Paper, Text } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Paper style={styles.paper}>
 *      <Text>Paper</Text>
 *   </Paper>
 * );
 *
 * const styles = StyleSheet.create({
 *   paper: {
 *     padding: 8,
 *     height: 80,
 *     width: 80,
 *     alignItems: 'center',
 *     justifyContent: 'center',
 *     elevation: 4,
 *   },
 * });
 * ```
 */
class Paper extends React.Component<Props> {
  render() {
    const { style, theme, ...rest } = this.props;
    const flattenedStyles = StyleSheet.flatten(style) || {};
    const { elevation } = flattenedStyles;

    return (
      <View
        {...rest}
        style={[
          styles.paper,
          { backgroundColor: theme.colors.paper },
          elevation && shadow(elevation),
          style,
        ]}
      />
    );
  }
}

export default withTheme(Paper);

const styles = StyleSheet.create({
  paper: {
    backgroundColor: Colors.white,
  },
});
