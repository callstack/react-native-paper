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
  leftInset?: boolean;
  /**
   * `Available in v3.x`
   *
   *  Whether divider has a horizontal inset on both sides.
   */
  horizontalInset?: boolean;
  /**
   * `Available in v3.x`
   *
   *  Whether divider should be bolded.
   */
  bold?: boolean;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
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
  const { dark: isDarkTheme, isV3, md } = theme;

  const dividerColor = isV3
    ? (md('md.sys.color.surface-variant') as string)
    : color(isDarkTheme ? white : black)
        .alpha(0.12)
        .rgb()
        .string();

  return (
    <View
      {...rest}
      style={[
        { height: StyleSheet.hairlineWidth, backgroundColor: dividerColor },
        leftInset && styles.leftInset,
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
  horizontalInset: {
    marginLeft: 28,
    marginRight: 28,
  },
  bold: {
    height: 1,
  },
});

export default withTheme(Divider);
