/* @flow */

import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import shadow from '../styles/shadow';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

type Props = React.ElementConfig<typeof View> & {
  /**
   * Content of the `Surface`.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * Surface is a basic container that can give depth to an element with elevation shadow.
 * A shadow can be applied by specifying the `elevation` property both on Android and iOS.
 *
 * <div class="screenshots">
 *   <img src="screenshots/surface-1.png" />
 *   <img src="screenshots/surface-2.png" />
 *   <img src="screenshots/surface-3.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Surface, Text } from 'react-native-paper';
 * import { StyleSheet } from 'react-native';
 *
 * const MyComponent = () => (
 *   <Surface style={styles.surface}>
 *      <Text>Surface</Text>
 *   </Surface>
 * );
 *
 * export default MyComponent;
 *
 * const styles = StyleSheet.create({
 *   surface: {
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
class Surface extends React.Component<Props> {
  render() {
    const { style, theme, ...rest } = this.props;
    const flattenedStyles = StyleSheet.flatten(style) || {};
    const { elevation } = flattenedStyles;

    return (
      <Animated.View
        {...rest}
        style={[
          { backgroundColor: theme.colors.surface },
          elevation && shadow(elevation),
          style,
        ]}
      />
    );
  }
}

export default withTheme(Surface);
