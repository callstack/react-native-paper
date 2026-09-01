import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { useInternalTheme } from '../core/theming';
import type { $RemoveChildren, ThemeProp } from '../types';

const THICKNESS = 1;
const INSET = 16;

export type Props = $RemoveChildren<typeof View> & {
  /**
   * Orientation of the divider. A vertical divider stretches to the height of
   * its parent, so the parent has to lay its children out in a row.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Whether the divider is inset from the leading edge, which is the left edge
   * in LTR and the right edge in RTL. On a vertical divider it's the top edge.
   */
  startInset?: boolean;
  /**
   * Whether the divider is inset from both edges: left and right on a
   * horizontal divider, top and bottom on a vertical one.
   */
  horizontalInset?: boolean;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A divider is a thin, lightweight separator that groups content in lists and page layouts.
 *
 * Dividers are decorative, so screen readers skip them. If a divider means
 * something on its own, pass `accessible`, `aria-hidden={false}` and
 * `role="separator"`.
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
  orientation = 'horizontal',
  startInset = false,
  horizontalInset = false,
  style,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const isVertical = orientation === 'vertical';

  return (
    <View
      aria-hidden
      {...rest}
      style={[
        isVertical ? styles.vertical : styles.horizontal,
        { backgroundColor: theme.colors.outlineVariant },
        startInset &&
          (isVertical ? styles.verticalStartInset : styles.startInset),
        horizontalInset &&
          (isVertical ? styles.verticalInset : styles.horizontalInset),
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: THICKNESS,
  },
  vertical: {
    width: THICKNESS,
    alignSelf: 'stretch',
  },
  startInset: {
    marginStart: INSET,
  },
  horizontalInset: {
    marginStart: INSET,
    marginEnd: INSET,
  },
  verticalStartInset: {
    marginTop: INSET,
  },
  verticalInset: {
    marginTop: INSET,
    marginBottom: INSET,
  },
});

export default Divider;
