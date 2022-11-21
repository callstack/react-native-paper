import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import color from 'color';

import { withInternalTheme } from '../core/theming';
import { black, white } from '../styles/themes/v2/colors';
import type { $RemoveChildren, InternalTheme } from '../types';

export type Props = $RemoveChildren<typeof View> & {
  /**
   * @renamed Renamed from 'inset' to 'leftInset` in v5.x
   * Whether divider has a left inset.
   */
  leftInset?: boolean;
  /**
   * @supported Available in v5.x with theme version 3
   *  Whether divider has a horizontal inset on both sides.
   */
  horizontalInset?: boolean;
  /**
   * @supported Available in v5.x with theme version 3
   *  Whether divider should be bolded.
   */
  bold?: boolean;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: InternalTheme;
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
  leftInset,
  horizontalInset = false,
  style,
  theme,
  bold = false,
  ...rest
}: Props) => {
  const { dark: isDarkTheme, isV3 } = theme;

  const dividerColor = isV3
    ? theme.colors.outlineVariant
    : color(isDarkTheme ? white : black)
        .alpha(0.12)
        .rgb()
        .string();

  return (
    <View
      {...rest}
      style={[
        { height: StyleSheet.hairlineWidth, backgroundColor: dividerColor },
        leftInset && (isV3 ? styles.v3LeftInset : styles.leftInset),
        isV3 && horizontalInset && styles.horizontalInset,
        isV3 && bold && styles.bold,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  leftInset: {
    marginLeft: 72,
  },
  v3LeftInset: {
    marginLeft: 16,
  },
  horizontalInset: {
    marginLeft: 16,
    marginRight: 16,
  },
  bold: {
    height: 1,
  },
});

export default withInternalTheme(Divider);
