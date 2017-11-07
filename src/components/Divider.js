/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

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
        isDarkTheme ? styles.dividerDarkTheme : styles.divider,
        inset && styles.inset,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: 'rgba(0, 0, 0, .12)',
    height: StyleSheet.hairlineWidth,
  },
  dividerDarkTheme: {
    backgroundColor: 'rgba(255,255,255, .2)',
    height: StyleSheet.hairlineWidth,
  },
  inset: {
    marginLeft: 72,
  },
});

export default withTheme(Divider);
