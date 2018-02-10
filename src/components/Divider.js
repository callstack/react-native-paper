/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

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
 * A divider is a thin, lightweight rule that groups content in lists and page layouts.
 *
 * ## Usage
 * ```js
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
const Divider = (props: Props) => {
  const { inset, style, theme: { colors: { divider } } } = props;

  return (
    <View
      {...props}
      style={[
        styles.divider,
        { backgroundColor: divider },
        inset && styles.inset,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  inset: {
    marginLeft: 72,
  },
});

export default withTheme(Divider);
