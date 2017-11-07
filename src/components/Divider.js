/* @flow */

import * as React from 'react';
import color from 'color';
import { StyleSheet, View } from 'react-native';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import { black, white } from '../styles/colors';

type Props = {
  /**
   *  Whether divider has a left inset
   */
  inset?: boolean,
  style?: any,
  theme: Theme,
};

/**
 * A divider is a thin, lightweight rule that groups content in lists and page layouts
 *
 * **Usage:**
 * ```
 * const MyComponent = () => (
 *   <View>
 *     <Text>Apple</Text>
 *     </Divider>
 *     <Text>Orange</Text>
 *     </Divider>
 *   </Button>
 * );
 * ```
 */
const Divider = (props: Props) => {
  const { inset, style, theme } = props;
  const { dark: isDarkTheme } = theme;
  console.log(isDarkTheme);
  return (
    <View
      {...props}
      style={[
        isDarkTheme ? styles.dividerDarkTheme : styles.dividerDeafultTheme,
        inset && styles.inset,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dividerDeafultTheme: {
    backgroundColor: color(black)
      .alpha(0.12)
      .rgbaString(),
    height: StyleSheet.hairlineWidth,
  },
  dividerDarkTheme: {
    backgroundColor: color(white)
      .alpha(0.12)
      .rgbaString(),
    height: StyleSheet.hairlineWidth,
  },
  inset: {
    marginLeft: 72,
  },
});

export default withTheme(Divider);
