/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import shadow from '../styles/shadow';
import withTheme from '../core/withTheme';
import * as Colors from '../styles/colors';
import type { Theme } from '../types';

type Props = {
  children: React.Node,
  style?: any,
  theme: Theme,
};

/**
 * Paper is a basic container that can give depth to the page.
 *
 * **Usage:**
 * ```js
 * const MyComponent = () => (
 *   <Paper style={styles.paper}>
 *      <Text>Paper</Text>
 *   </Paper>
 * );
 *
 *
 * const styles = StyleSheet.create({
 *   paper: {
 *    padding: 8,
 *    height: 80,
 *    width: 80,
 *    alignItems: 'center',
 *    justifyContent: 'center',
 *    },
 * });
 * ```
 * Note: Pass *elevation* style, to apply shadow to the component. Defaults to 2.
 */
class Paper extends React.Component<Props> {
  render() {
    const { style, theme, ...restOfProps } = this.props;
    const flattenedStyles = StyleSheet.flatten(style) || {};
    const { elevation } = flattenedStyles;

    return (
      <View
        {...restOfProps}
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
