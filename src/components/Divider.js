/* @flow */

import * as React from 'react';
import color from 'color';
import { StyleSheet, View } from 'react-native';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import { black, white } from '../styles/colors';

type Props = {
  /**
   *  Whether divider has a left inset.
   */
  inset?: boolean,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * A divider is a thin, lightweight separator that groups content in lists and page layouts.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Divider, Text } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <View>
 *     <Text>Apple</Text>
 *     <Divider />
 *     <Text>Orange</Text>
 *     <Divider />
 *   </View>
 * );
 * ```
 */
class Divider extends React.Component<Props> {
  render() {
    const { inset, style, theme, ...rest } = this.props;
    const { dark: isDarkTheme } = theme;
    return (
      <View
        {...rest}
        style={[
          isDarkTheme ? styles.dark : styles.light,
          inset && styles.inset,
          style,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  light: {
    backgroundColor: color(black)
      .alpha(0.12)
      .rgb()
      .string(),
    height: StyleSheet.hairlineWidth,
  },
  dark: {
    backgroundColor: color(white)
      .alpha(0.12)
      .rgb()
      .string(),
    height: StyleSheet.hairlineWidth,
  },
  inset: {
    marginLeft: 72,
  },
});

export default withTheme(Divider);
