import * as React from 'react';
import color from 'color';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { withTheme } from '../core/theming';
import { black, white } from '../styles/themes/v2/colors';
import type { $RemoveChildren, Theme } from '../types';

type Props = $RemoveChildren<typeof View> & {
  /**
   *  Whether divider has a left inset.
   */
  inset?: boolean;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
  bold?: boolean;
  insets?: boolean;
};

/**
 * A divider is a thin, lightweight separator that groups content in lists and page layouts.
 *
 * <div class="screenshots">
 *  <figure>
 *    <img class="medium" src="screenshots/divider.png" />
 *  </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Divider, Text } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <View>
 *     <Text>Lemon</Text>
 *     <Divider />
 *     <Text>Mango</Text>
 *     <Divider />
 *   </View>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Divider = ({
  inset,
  style,
  theme,
  bold = false,
  insets = false,
  ...rest
}: Props) => {
  const { dark: isDarkTheme } = theme;

  return (
    <View
      {...rest}
      style={[
        isDarkTheme ? styles.dark : styles.light,
        inset && styles.inset,
        insets && styles.insets,
        bold && styles.bold,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  light: {
    backgroundColor: color(black).alpha(0.12).rgb().string(),
    height: StyleSheet.hairlineWidth,
  },
  dark: {
    backgroundColor: color(white).alpha(0.12).rgb().string(),
    height: StyleSheet.hairlineWidth,
  },
  inset: {
    marginLeft: 72,
  },
  insets: {
    marginLeft: 28,
    marginRight: 28,
  },
  bold: {
    height: 1,
  },
});

export default withTheme(Divider);
