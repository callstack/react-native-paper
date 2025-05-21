import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useInternalTheme } from '../core/theming';
import type { $RemoveChildren, ThemeProp } from '../types';

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
  theme?: ThemeProp;
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
  theme: themeOverrides,
  bold = false,
  ...rest
}: Props) => {
  const {
    colors: { outlineVariant },
  } = useInternalTheme(themeOverrides);

  return (
    <View
      {...rest}
      style={[
        {
          height: StyleSheet.hairlineWidth,
          backgroundColor: outlineVariant,
        },
        leftInset && styles.leftInset,
        horizontalInset && styles.horizontalInset,
        bold && styles.bold,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  leftInset: {
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

export default Divider;
